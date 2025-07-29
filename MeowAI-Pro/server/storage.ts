import { type AiProvider, type InsertAiProvider, type ChatMessage, type InsertChatMessage, type ChatSession, type InsertChatSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // AI Providers
  getAiProviders(): Promise<AiProvider[]>;
  getAiProvider(name: string): Promise<AiProvider | undefined>;
  createAiProvider(provider: InsertAiProvider): Promise<AiProvider>;
  updateAiProvider(name: string, updates: Partial<AiProvider>): Promise<AiProvider | undefined>;
  
  // Chat Messages
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Chat Sessions
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
}

export class MemStorage implements IStorage {
  private aiProviders: Map<string, AiProvider>;
  private chatMessages: Map<string, ChatMessage>;
  private chatSessions: Map<string, ChatSession>;

  constructor() {
    this.aiProviders = new Map();
    this.chatMessages = new Map();
    this.chatSessions = new Map();
    
    // Initialize default AI providers
    this.initializeDefaultProviders();
  }

  private initializeDefaultProviders() {
    const defaultProviders: InsertAiProvider[] = [
      {
        name: "claude",
        displayName: "Claude",
        isConnected: false,
        tokensUsed: 0,
        tokenLimit: 100000,
        status: "disconnected",
        priority: 1
      },
      {
        name: "openai",
        displayName: "GPT-4",
        isConnected: true,
        tokensUsed: 15200,
        tokenLimit: 100000,
        status: "connected",
        priority: 2
      },
      {
        name: "gemini",
        displayName: "Gemini",
        isConnected: false,
        tokensUsed: 0,
        tokenLimit: 100000,
        status: "error",
        errorMessage: "API key not configured",
        priority: 3
      },
      {
        name: "cohere",
        displayName: "Command",
        isConnected: false,
        tokensUsed: 0,
        tokenLimit: 100000,
        status: "disconnected",
        priority: 4
      }
    ];

    defaultProviders.forEach(provider => {
      const id = randomUUID();
      const fullProvider: AiProvider = {
        ...provider,
        id,
        lastUsed: null,
        apiKey: null,
        status: provider.status || "disconnected",
        isConnected: provider.isConnected || false,
        tokensUsed: provider.tokensUsed || 0,
        tokenLimit: provider.tokenLimit || 100000,
        priority: provider.priority || 0,
        errorMessage: provider.errorMessage || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.aiProviders.set(provider.name, fullProvider);
    });
  }

  async getAiProviders(): Promise<AiProvider[]> {
    return Array.from(this.aiProviders.values());
  }

  async getAiProvider(name: string): Promise<AiProvider | undefined> {
    return this.aiProviders.get(name);
  }

  async createAiProvider(insertProvider: InsertAiProvider): Promise<AiProvider> {
    const id = randomUUID();
    const provider: AiProvider = {
      ...insertProvider,
      id,
      lastUsed: null,
      apiKey: insertProvider.apiKey || null,
      status: insertProvider.status || "disconnected",
      isConnected: insertProvider.isConnected || false,
      tokensUsed: insertProvider.tokensUsed || 0,
      tokenLimit: insertProvider.tokenLimit || 100000,
      priority: insertProvider.priority || 0,
      errorMessage: insertProvider.errorMessage || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.aiProviders.set(provider.name, provider);
    return provider;
  }

  async updateAiProvider(name: string, updates: Partial<AiProvider>): Promise<AiProvider | undefined> {
    const provider = this.aiProviders.get(name);
    if (!provider) return undefined;

    const updatedProvider: AiProvider = {
      ...provider,
      ...updates,
      updatedAt: new Date()
    };
    this.aiProviders.set(name, updatedProvider);
    return updatedProvider;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      sessionId: insertMessage.sessionId || null,
      aiProvider: insertMessage.aiProvider || null,
      metadata: insertMessage.metadata || null
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...insertSession,
      id,
      language: insertSession.language || "en",
      activeProvider: insertSession.activeProvider || null,
      createdAt: new Date(),
      lastActivity: new Date()
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;

    const updatedSession: ChatSession = {
      ...session,
      ...updates,
      lastActivity: new Date()
    };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
