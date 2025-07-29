import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Circle, Settings } from "lucide-react";
import { AiProviderCard } from "./ai-provider-card";
import { useAiProviders, useConnectProvider, useDisconnectProvider } from "@/hooks/use-ai-status";
import { translate, type Language } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { OAuthConnectModal } from "./oauth-connect-modal";

interface AiConfigPanelProps {
  language: Language;
}

export function AiConfigPanel({ language }: AiConfigPanelProps) {
  const { data: providers, isLoading } = useAiProviders();
  const connectProvider = useConnectProvider();
  const disconnectProvider = useDisconnectProvider();
  const { toast } = useToast();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<{ name: string; displayName: string } | null>(null);

  const handleConnect = (providerName: string) => {
    const provider = providers?.find(p => p.name === providerName);
    if (provider) {
      setSelectedProvider({ name: provider.name, displayName: provider.displayName });
      setConnectModalOpen(true);
    }
  };

  const handleConnectWithKey = async (apiKey: string) => {
    if (!selectedProvider) return;
    
    try {
      await connectProvider.mutateAsync({ name: selectedProvider.name, apiKey });
      toast({
        title: "Connected Successfully",
        description: `${selectedProvider.displayName} has been connected`,
      });
      setConnectModalOpen(false);
      setSelectedProvider(null);
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect ${selectedProvider.displayName}`,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (providerName: string) => {
    try {
      await disconnectProvider.mutateAsync(providerName);
      toast({
        title: "Disconnected",
        description: `${providerName} has been disconnected`,
      });
    } catch (error: any) {
      toast({
        title: "Disconnection Failed",
        description: error.message || `Failed to disconnect ${providerName}`,
        variant: "destructive",
      });
    }
  };

  const activeProvider = providers?.find(p => p.isConnected && p.status === "connected");
  const connectedCount = providers?.filter(p => p.isConnected).length || 0;

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-6 border border-orange-500/20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-6 border border-orange-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="text-purple-500 text-2xl mr-3" />
          <h2 className="text-2xl font-bold text-amber-800">
            {translate("ai-config-title", language)}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Circle className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">
            {translate("auto-failover", language)}
          </span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers?.map(provider => (
          <AiProviderCard
            key={provider.id}
            provider={provider}
            language={language}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnecting={connectProvider.isPending && connectProvider.variables?.name === provider.name}
          />
        ))}
      </div>

      {/* Active Model Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="text-orange-500 text-xl mr-3" />
            <div>
              <h3 className="font-semibold text-amber-800">
                {translate("active-model", language)}
              </h3>
              <p className="text-sm text-gray-600">
                {activeProvider 
                  ? `${activeProvider.displayName} (Primary)` 
                  : "No active model"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span>{translate("auto-switch", language)} </span>
              <span className="text-green-600 font-medium">
                {connectedCount > 1 ? translate("enabled", language) : "Disabled"}
              </span>
            </div>
            <Button 
              size="sm"
              className="bg-orange-500 hover:bg-red-500 text-white rounded-xl transition-all duration-300"
            >
              <Settings className="mr-2 h-4 w-4" />
              {translate("settings", language)}
            </Button>
          </div>
        </div>
      </div>

      <OAuthConnectModal
        isOpen={connectModalOpen}
        onClose={() => {
          setConnectModalOpen(false);
          setSelectedProvider(null);
        }}
        providerName={selectedProvider?.name || ""}
        providerDisplayName={selectedProvider?.displayName || ""}
        language={language}
        onConnect={handleConnectWithKey}
        isConnecting={connectProvider.isPending}
      />
    </Card>
  );
}
