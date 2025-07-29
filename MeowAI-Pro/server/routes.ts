import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiManager } from "./services/ai-providers";
import { CAT_EXPERT_SYSTEM_PROMPT, enhancePromptWithContext, classifyUrgency, generateQuickPrompts, type CatExpertQuery } from "./services/cat-expert";
import { insertChatMessageSchema, insertChatSessionSchema, insertAiProviderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get AI providers status
  app.get("/api/ai-providers", async (req, res) => {
    try {
      const providers = await storage.getAiProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI providers" });
    }
  });

  // Update AI provider
  app.patch("/api/ai-providers/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const updates = req.body;
      
      const updatedProvider = await storage.updateAiProvider(name, updates);
      if (!updatedProvider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      
      res.json(updatedProvider);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update AI provider" });
    }
  });

  // Connect AI provider (simulate OAuth)
  app.post("/api/ai-providers/:name/connect", async (req, res) => {
    try {
      const { name } = req.params;
      const { apiKey } = req.body;

      const provider = await storage.getAiProvider(name);
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }

      // Add provider to AI manager
      try {
        const { ClaudeProvider, OpenAIProvider, GeminiProvider, CohereProvider } = require('./services/ai-providers');
        
        let providerInstance;
        switch (name) {
          case 'claude':
            providerInstance = new ClaudeProvider(apiKey);
            break;
          case 'openai':
            providerInstance = new OpenAIProvider(apiKey);
            break;
          case 'gemini':
            providerInstance = new GeminiProvider(apiKey);
            break;
          case 'cohere':
            providerInstance = new CohereProvider(apiKey);
            break;
          default:
            throw new Error(`Unknown provider: ${name}`);
        }

        aiManager.addProvider(providerInstance, apiKey);
        
        // Test connection
        const isConnected = await providerInstance.checkConnection();

        const updatedProvider = await storage.updateAiProvider(name, {
          isConnected: !!isConnected,
          status: isConnected ? "connected" : "error",
          errorMessage: isConnected ? null : "Connection failed",
          apiKey: apiKey,
          lastUsed: isConnected ? new Date() : null
        });

        res.json(updatedProvider);
      } catch (error: any) {
        await storage.updateAiProvider(name, {
          isConnected: false,
          status: "error",
          errorMessage: error.message
        });
        res.status(400).json({ error: error.message });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to connect AI provider" });
    }
  });

  // Disconnect AI provider
  app.post("/api/ai-providers/:name/disconnect", async (req, res) => {
    try {
      const { name } = req.params;
      
      const updatedProvider = await storage.updateAiProvider(name, {
        isConnected: false,
        status: "disconnected",
        errorMessage: null,
        apiKey: null
      });

      if (!updatedProvider) {
        return res.status(404).json({ error: "Provider not found" });
      }

      res.json(updatedProvider);
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect AI provider" });
    }
  });

  // Create chat session
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid session data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create chat session" });
      }
    }
  });

  // Get chat messages
  app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  // Send chat message and get AI response
  app.post("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        sessionId
      });

      // Save user message
      const userMessage = await storage.createChatMessage(messageData);

      // Get connected providers ordered by priority
      const providers = await storage.getAiProviders();
      const connectedProviders = providers
        .filter(p => p.isConnected && p.status === "connected")
        .sort((a, b) => (a.priority || 0) - (b.priority || 0))
        .map(p => p.name);

      if (connectedProviders.length === 0) {
        return res.status(503).json({ error: "No AI providers available" });
      }

      try {
        // Enhance prompt with cat expert context
        const query: CatExpertQuery = {
          question: messageData.content,
          context: {
            urgency: classifyUrgency(messageData.content)
          }
        };

        const enhancedPrompt = enhancePromptWithContext(query);
        
        // Get AI response with failover
        const aiResponse = await aiManager.generateResponseWithFailover(
          enhancedPrompt,
          CAT_EXPERT_SYSTEM_PROMPT,
          connectedProviders
        );

        // Update token usage for the provider
        await storage.updateAiProvider(aiResponse.provider, {
          tokensUsed: (providers.find(p => p.name === aiResponse.provider)?.tokensUsed || 0) + aiResponse.tokensUsed,
          lastUsed: new Date()
        });

        // Save bot response
        const botMessage = await storage.createChatMessage({
          content: aiResponse.content,
          sender: "bot",
          sessionId,
          aiProvider: aiResponse.provider,
          metadata: {
            model: aiResponse.model,
            tokensUsed: aiResponse.tokensUsed,
            urgency: query.context?.urgency
          }
        });

        // Update session activity
        await storage.updateChatSession(sessionId, {
          activeProvider: aiResponse.provider,
          lastActivity: new Date()
        });

        res.json({
          userMessage,
          botMessage,
          aiResponse: {
            provider: aiResponse.provider,
            model: aiResponse.model,
            tokensUsed: aiResponse.tokensUsed
          }
        });

      } catch (error) {
        // If all AI providers fail, return error
        res.status(503).json({ 
          error: "AI service temporarily unavailable", 
          details: (error as any).message,
          userMessage 
        });
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid message data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to process message" });
      }
    }
  });

  // Get quick prompts for language
  app.get("/api/quick-prompts/:language", (req, res) => {
    try {
      const { language } = req.params;
      if (language !== 'en' && language !== 'pl') {
        return res.status(400).json({ error: "Unsupported language" });
      }
      
      const prompts = generateQuickPrompts(language as 'en' | 'pl');
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get quick prompts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
