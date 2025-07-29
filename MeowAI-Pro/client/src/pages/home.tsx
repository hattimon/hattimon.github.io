import { useState } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { InstructionsSection } from "@/components/instructions-section";
import { AiConfigPanel } from "@/components/ai-config-panel";
import { ChatContainer } from "@/components/chat-container";
import { translate, type Language } from "@/lib/translations";

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-amber-100 overflow-x-hidden">
      <LanguageSelector 
        currentLanguage={language} 
        onLanguageChange={setLanguage} 
      />
      
      <div className="container mx-auto max-w-6xl p-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="text-6xl mb-4 animate-bounce">🐱</div>
          <h1 className="text-5xl font-bold text-amber-800 mb-2 drop-shadow-lg">
            {translate("title", language)}
          </h1>
          <p className="text-xl text-amber-700 mb-6">
            {translate("subtitle", language)}
          </p>
        </div>

        {/* Instructions Section */}
        <InstructionsSection language={language} />

        {/* AI Configuration Panel */}
        <AiConfigPanel language={language} />

        {/* Chat Container */}
        <ChatContainer language={language} />
      </div>
    </div>
  );
}
