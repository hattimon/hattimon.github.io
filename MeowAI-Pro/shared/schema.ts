import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const aiProviders = pgTable("ai_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // 'claude', 'openai', 'gemini', 'cohere'
  displayName: text("display_name").notNull(),
  isConnected: boolean("is_connected").default(false),
  tokensUsed: integer("tokens_used").default(0),
  tokenLimit: integer("token_limit").default(100000),
  apiKey: text("api_key"),
  lastUsed: timestamp("last_used"),
  status: text("status").default("disconnected"), // 'connected', 'disconnected', 'error'
  errorMessage: text("error_message"),
  priority: integer("priority").default(0), // for failover ordering
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`)
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'bot'
  aiProvider: text("ai_provider"), // which AI provider was used for bot messages
  timestamp: timestamp("timestamp").default(sql`now()`),
  sessionId: text("session_id"), // for grouping chat sessions
  metadata: jsonb("metadata") // for storing additional data like token usage, response time, etc.
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  language: text("language").default("en"),
  activeProvider: text("active_provider"),
  createdAt: timestamp("created_at").default(sql`now()`),
  lastActivity: timestamp("last_activity").default(sql`now()`)
});

export const insertAiProviderSchema = createInsertSchema(aiProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  lastActivity: true
});

export type AiProvider = typeof aiProviders.$inferSelect;
export type InsertAiProvider = z.infer<typeof insertAiProviderSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
