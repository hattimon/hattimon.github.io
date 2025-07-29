import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Circle, Plug, CheckCircle, Loader2 } from "lucide-react";
import type { AiProvider } from "@shared/schema";
import { translate, type Language } from "@/lib/translations";

interface AiProviderCardProps {
  provider: AiProvider;
  language: Language;
  onConnect: (name: string) => void;
  onDisconnect: (name: string) => void;
  isConnecting: boolean;
}

const providerColors = {
  claude: "purple",
  openai: "green", 
  gemini: "blue",
  cohere: "orange"
};

const providerIcons = {
  claude: "C",
  openai: "O",
  gemini: "G", 
  cohere: "Co"
};

export function AiProviderCard({ 
  provider, 
  language, 
  onConnect, 
  onDisconnect, 
  isConnecting 
}: AiProviderCardProps) {
  const color = providerColors[provider.name as keyof typeof providerColors] || "gray";
  const icon = providerIcons[provider.name as keyof typeof providerIcons] || "?";
  
  const usagePercent = Math.round(((provider.tokensUsed || 0) / (provider.tokenLimit || 100000)) * 100);
  
  const getStatusIcon = () => {
    if (isConnecting) {
      return <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />;
    }
    
    switch (provider.status) {
      case "connected":
        return <Circle className="h-3 w-3 text-green-500 fill-current animate-pulse" />;
      case "error":
        return <Circle className="h-3 w-3 text-red-500 fill-current" />;
      default:
        return <Circle className="h-3 w-3 text-yellow-500 fill-current animate-pulse" />;
    }
  };

  const getStatusText = () => {
    if (isConnecting) return translate("connecting", language);
    
    switch (provider.status) {
      case "connected":
        return translate("status-connected", language);
      case "error":
        return translate("status-error", language);
      default:
        return translate("status-disconnected", language);
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-2xl p-4 border-2 border-${color}-200 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-10 h-10 bg-${color}-500 rounded-xl flex items-center justify-center text-white font-bold mr-3`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{provider.displayName}</h3>
            <p className="text-xs text-gray-600 capitalize">{provider.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-xs text-gray-600">{getStatusText()}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Tokens Used</span>
          <span>{(provider.tokensUsed || 0).toLocaleString()} / {(provider.tokenLimit || 100000).toLocaleString()}</span>
        </div>
        <Progress 
          value={usagePercent} 
          className={`h-2 bg-gray-200`}
        />
      </div>
      
      {provider.errorMessage && (
        <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded">
          {provider.errorMessage}
        </div>
      )}
      
      <Button
        onClick={() => provider.isConnected ? onDisconnect(provider.name) : onConnect(provider.name)}
        disabled={isConnecting}
        className={`w-full font-medium py-2 px-4 rounded-xl transition-all duration-300 ${
          provider.isConnected
            ? `bg-gray-400 text-white cursor-not-allowed`
            : `bg-${color}-500 hover:bg-${color}-600 text-white hover:scale-105`
        }`}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {translate("connecting", language)}
          </>
        ) : provider.isConnected ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            {translate("connected", language)}
          </>
        ) : (
          <>
            <Plug className="mr-2 h-4 w-4" />
            {translate("connect", language)}
          </>
        )}
      </Button>
    </Card>
  );
}
