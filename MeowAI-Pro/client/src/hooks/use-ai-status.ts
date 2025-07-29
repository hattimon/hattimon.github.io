import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AiProvider } from "@shared/schema";

export function useAiProviders() {
  return useQuery<AiProvider[]>({
    queryKey: ["/api/ai-providers"],
  });
}

export function useConnectProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, apiKey }: { name: string; apiKey?: string }) => {
      const response = await apiRequest("POST", `/api/ai-providers/${name}/connect`, { apiKey });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-providers"] });
    },
  });
}

export function useDisconnectProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", `/api/ai-providers/${name}/disconnect`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-providers"] });
    },
  });
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ name, updates }: { name: string; updates: Partial<AiProvider> }) => {
      const response = await apiRequest("PATCH", `/api/ai-providers/${name}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-providers"] });
    },
  });
}
