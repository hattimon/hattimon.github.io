import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from "@google/genai";

/*
<important_code_snippet_instructions>
The newest Anthropic model is "claude-sonnet-4-20250514", not "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022" nor "claude-3-sonnet-20240229". 
If the user doesn't specify a model, always prefer using "claude-sonnet-4-20250514" as it is the latest model.
The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
The newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro".
</important_code_snippet_instructions>
*/

// <important_do_not_delete>
const DEFAULT_CLAUDE_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_OPENAI_MODEL = "gpt-4o";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
// </important_do_not_delete>

export interface AIResponse {
  content: string;
  provider: string;
  tokensUsed: number;
  model: string;
}

export interface AIProvider {
  name: string;
  generateResponse(prompt: string, systemPrompt?: string): Promise<AIResponse>;
  checkConnection(): Promise<boolean>;
}

export class ClaudeProvider implements AIProvider {
  name = 'claude';
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY || ''
    });
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const message = await this.client.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
        model: DEFAULT_CLAUDE_MODEL,
        system: systemPrompt
      });

      const content = message.content[0].type === 'text' ? message.content[0].text : '';
      
      return {
        content,
        provider: this.name,
        tokensUsed: message.usage?.input_tokens + message.usage?.output_tokens || 0,
        model: DEFAULT_CLAUDE_MODEL
      };
    } catch (error: any) {
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.client.messages.create({
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }],
        model: DEFAULT_CLAUDE_MODEL
      });
      return true;
    } catch {
      return false;
    }
  }
}

export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY || ''
    });
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await this.client.chat.completions.create({
        model: DEFAULT_OPENAI_MODEL,
        messages
      });

      const content = response.choices[0].message.content || '';
      const tokensUsed = response.usage?.total_tokens || 0;

      return {
        content,
        provider: this.name,
        tokensUsed,
        model: DEFAULT_OPENAI_MODEL
      };
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.client.chat.completions.create({
        model: DEFAULT_OPENAI_MODEL,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      });
      return true;
    } catch {
      return false;
    }
  }
}

export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({
      apiKey: apiKey || process.env.GEMINI_API_KEY || ''
    });
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt;
      
      const response = await this.client.models.generateContent({
        model: DEFAULT_GEMINI_MODEL,
        contents: fullPrompt
      });

      const content = response.text || '';
      
      return {
        content,
        provider: this.name,
        tokensUsed: 0, // Gemini doesn't provide token count in the same way
        model: DEFAULT_GEMINI_MODEL
      };
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.client.models.generateContent({
        model: DEFAULT_GEMINI_MODEL,
        contents: 'test'
      });
      return true;
    } catch {
      return false;
    }
  }
}

// Note: Cohere implementation would be similar but requires their SDK
export class CohereProvider implements AIProvider {
  name = 'cohere';

  constructor(apiKey: string) {
    // TODO: Implement Cohere client when needed
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    // TODO: Implement Cohere API call
    throw new Error('Cohere provider not yet implemented');
  }

  async checkConnection(): Promise<boolean> {
    return false; // Not implemented yet
  }
}

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();

  addProvider(provider: AIProvider, apiKey: string) {
    let providerInstance: AIProvider;
    
    switch (provider.name) {
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
        throw new Error(`Unknown provider: ${provider.name}`);
    }
    
    this.providers.set(provider.name, providerInstance);
  }

  getProvider(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }

  async generateResponseWithFailover(prompt: string, systemPrompt: string, preferredProviders: string[]): Promise<AIResponse> {
    let lastError: any = null;

    for (const providerName of preferredProviders) {
      const provider = this.providers.get(providerName);
      if (!provider) continue;

      try {
        return await provider.generateResponse(prompt, systemPrompt);
      } catch (error: any) {
        lastError = error;
        console.warn(`Provider ${providerName} failed:`, error.message);
        continue;
      }
    }

    throw new Error(`All providers failed. Last error: ${lastError?.message}`);
  }
}

export const aiManager = new AIProviderManager();
