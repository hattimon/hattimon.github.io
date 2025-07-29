import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage, ChatSession } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useChatSession(sessionId: string | null) {
  return useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/sessions", sessionId, "messages"],
    enabled: !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { language?: string }) => {
      const response = await apiRequest("POST", "/api/chat/sessions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions"] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      const response = await apiRequest("POST", `/api/chat/sessions/${sessionId}/messages`, {
        content,
        sender: "user"
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/chat/sessions", variables.sessionId, "messages"] 
      });
    },
    onError: (error: any) => {
      toast({
        title: "Message failed",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });
}

export function useQuickPrompts(language: 'en' | 'pl') {
  return useQuery({
    queryKey: ["/api/quick-prompts", language],
  });
}

export function useChat() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const createSession = useCreateSession();
  const sendMessage = useSendMessage();
  const chatMessages = useChatSession(currentSessionId);

  const startNewSession = useCallback(async (language: 'en' | 'pl' = 'en') => {
    try {
      const session = await createSession.mutateAsync({ language });
      setCurrentSessionId(session.id);
      return session;
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  }, [createSession]);

  const sendChatMessage = useCallback(async (content: string) => {
    if (!currentSessionId) {
      const session = await startNewSession();
      if (!session) return;
      setCurrentSessionId(session.id);
    }

    if (!currentSessionId) return;

    setIsTyping(true);
    try {
      await sendMessage.mutateAsync({ sessionId: currentSessionId, content });
    } finally {
      setIsTyping(false);
    }
  }, [currentSessionId, sendMessage, startNewSession]);

  return {
    currentSessionId,
    messages: chatMessages.data || [],
    isLoading: chatMessages.isLoading,
    isTyping,
    isSending: sendMessage.isPending,
    startNewSession,
    sendMessage: sendChatMessage,
    error: chatMessages.error || sendMessage.error,
  };
}
