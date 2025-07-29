import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Heart, 
  Brain, 
  Utensils, 
  AlertTriangle,
  Stethoscope,
  Circle 
} from "lucide-react";
import { useChat, useQuickPrompts } from "@/hooks/use-chat";
import { useAiProviders } from "@/hooks/use-ai-status";
import { translate, type Language } from "@/lib/translations";
import type { ChatMessage } from "@shared/schema";

interface ChatContainerProps {
  language: Language;
}

export function ChatContainer({ language }: ChatContainerProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    currentSessionId,
    messages,
    isLoading,
    isTyping,
    isSending,
    startNewSession,
    sendMessage,
  } = useChat();
  
  const { data: providers } = useAiProviders();
  const { data: quickPrompts } = useQuickPrompts(language);
  
  const activeProvider = providers?.find(p => p.isConnected && p.status === "connected");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Start a session when component mounts
  useEffect(() => {
    if (!currentSessionId) {
      startNewSession(language);
    }
  }, [currentSessionId, startNewSession, language]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;
    
    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (type: string) => {
    if (quickPrompts && (quickPrompts as any)[type]) {
      setInputValue((quickPrompts as any)[type]);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return translate("just-now", language);
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const getUrgencyIcon = (metadata: any) => {
    if (metadata?.urgency === 'emergency') {
      return <Stethoscope className="h-3 w-3 text-red-500" />;
    }
    return <Stethoscope className="h-3 w-3 text-blue-500" />;
  };

  const getUrgencyLabel = (metadata: any) => {
    if (metadata && typeof metadata === 'object' && 'urgency' in metadata && metadata.urgency === 'emergency') {
      return translate("emergency", language);
    }
    return translate("professional", language);
  };

  return (
    <Card className="flex-1 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-orange-500/20">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🐱</div>
            <div>
              <h3 className="font-semibold">
                {translate("chat-title", language)}
              </h3>
              <p className="text-sm opacity-90">
                {translate("chat-subtitle", language)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">
              {activeProvider?.displayName || "No AI"}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 overflow-y-auto max-h-96 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="text-center p-6 text-amber-800">
            <div className="text-4xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold mb-2">
              {translate("welcome-title", language)}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {translate("welcome-desc", language)}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'text-right' : ''}`}
            >
              {message.sender === 'user' ? (
                <div className="inline-block max-w-xs lg:max-w-md">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-lg">
                    <p>{message.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {translate("you", language)} • {formatTimestamp(message.timestamp!)}
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    🐱
                  </div>
                  <div className="flex-1 max-w-xs lg:max-w-md">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>
                        Meow AI Pro • {message.aiProvider || 'AI'}
                      </span>
                      <div className="flex items-center space-x-2">
                        {getUrgencyIcon(message.metadata)}
                        <span className={`font-medium ${
                          (message.metadata && typeof message.metadata === 'object' && 'urgency' in message.metadata && message.metadata.urgency === 'emergency')
                            ? 'text-red-600' 
                            : 'text-blue-600'
                        }`}>
                          {getUrgencyLabel(message.metadata)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              🐱
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-orange-500/20 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={translate("chat-placeholder", language)}
              className="w-full px-6 py-4 border-2 border-transparent rounded-2xl bg-white shadow-lg focus:border-orange-500 focus:shadow-xl transition-all duration-300 text-gray-700 placeholder-gray-400"
              disabled={isSending || !activeProvider}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending || !activeProvider}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickPrompt('health')}
            className="px-3 py-2 bg-white/80 hover:bg-orange-500/20 rounded-xl text-sm text-gray-700 border border-gray-200 transition-all duration-300"
          >
            <Heart className="mr-1 h-4 w-4 text-red-500" />
            {translate("quick-health", language)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickPrompt('behavior')}
            className="px-3 py-2 bg-white/80 hover:bg-orange-500/20 rounded-xl text-sm text-gray-700 border border-gray-200 transition-all duration-300"
          >
            <Brain className="mr-1 h-4 w-4 text-purple-500" />
            {translate("quick-behavior", language)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickPrompt('nutrition')}
            className="px-3 py-2 bg-white/80 hover:bg-orange-500/20 rounded-xl text-sm text-gray-700 border border-gray-200 transition-all duration-300"
          >
            <Utensils className="mr-1 h-4 w-4 text-green-500" />
            {translate("quick-nutrition", language)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickPrompt('emergency')}
            className="px-3 py-2 bg-white/80 hover:bg-orange-500/20 rounded-xl text-sm text-gray-700 border border-gray-200 transition-all duration-300"
          >
            <AlertTriangle className="mr-1 h-4 w-4 text-orange-500" />
            {translate("quick-emergency", language)}
          </Button>
        </div>
      </div>
    </Card>
  );
}
