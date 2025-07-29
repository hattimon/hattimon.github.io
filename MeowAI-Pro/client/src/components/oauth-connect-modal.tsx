import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Key, AlertCircle, CheckCircle } from "lucide-react";
import { translate, type Language } from "@/lib/translations";

interface OAuthConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  providerDisplayName: string;
  language: Language;
  onConnect: (apiKey: string) => void;
  isConnecting: boolean;
}

const providerInstructions = {
  claude: {
    url: "https://console.anthropic.com/settings/keys",
    steps: {
      en: [
        "1. Go to Anthropic Console",
        "2. Sign in or create account",
        "3. Navigate to 'API Keys' section",
        "4. Click 'Create Key'", 
        "5. Copy your API key"
      ],
      pl: [
        "1. Przejdź do Konsoli Anthropic",
        "2. Zaloguj się lub utwórz konto",
        "3. Przejdź do sekcji 'Klucze API'",
        "4. Kliknij 'Utwórz Klucz'",
        "5. Skopiuj swój klucz API"
      ]
    }
  },
  openai: {
    url: "https://platform.openai.com/api-keys",
    steps: {
      en: [
        "1. Go to OpenAI Platform",
        "2. Sign in or create account",
        "3. Navigate to 'API Keys' section",
        "4. Click 'Create new secret key'",
        "5. Copy your API key"
      ],
      pl: [
        "1. Przejdź do Platformy OpenAI",
        "2. Zaloguj się lub utwórz konto", 
        "3. Przejdź do sekcji 'Klucze API'",
        "4. Kliknij 'Utwórz nowy tajny klucz'",
        "5. Skopiuj swój klucz API"
      ]
    }
  },
  gemini: {
    url: "https://aistudio.google.com/app/apikey",
    steps: {
      en: [
        "1. Go to Google AI Studio",
        "2. Sign in with Google account",
        "3. Click 'Get API Key'",
        "4. Create new API key",
        "5. Copy your API key"
      ],
      pl: [
        "1. Przejdź do Google AI Studio",
        "2. Zaloguj się kontem Google",
        "3. Kliknij 'Pobierz klucz API'",
        "4. Utwórz nowy klucz API",
        "5. Skopiuj swój klucz API"
      ]
    }
  },
  cohere: {
    url: "https://dashboard.cohere.ai/api-keys",
    steps: {
      en: [
        "1. Go to Cohere Dashboard",
        "2. Sign in or create account",
        "3. Navigate to 'API Keys'",
        "4. Generate new API key",
        "5. Copy your API key"
      ],
      pl: [
        "1. Przejdź do Panelu Cohere",
        "2. Zaloguj się lub utwórz konto",
        "3. Przejdź do 'Kluczy API'",
        "4. Wygeneruj nowy klucz API",
        "5. Skopiuj swój klucz API"
      ]
    }
  }
};

export function OAuthConnectModal({
  isOpen,
  onClose,
  providerName,
  providerDisplayName,
  language,
  onConnect,
  isConnecting
}: OAuthConnectModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [step, setStep] = useState<"instructions" | "input">("instructions");
  
  const provider = providerInstructions[providerName as keyof typeof providerInstructions];
  
  const handleConnect = () => {
    if (apiKey.trim()) {
      onConnect(apiKey.trim());
    }
  };

  const handleClose = () => {
    setApiKey("");
    setStep("instructions");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5 text-orange-500" />
            {language === 'en' ? `Connect ${providerDisplayName}` : `Połącz ${providerDisplayName}`}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? `Get your free API key from ${providerDisplayName} to start using professional cat expertise.`
              : `Uzyskaj darmowy klucz API od ${providerDisplayName}, aby rozpocząć korzystanie z profesjonalnej ekspertyzy kotów.`
            }
          </DialogDescription>
        </DialogHeader>

        {step === "instructions" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-800">
                    {language === 'en' ? 'How to get your API key:' : 'Jak uzyskać klucz API:'}
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {provider?.steps[language]?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => window.open(provider?.url, '_blank')}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {language === 'en' ? `Get ${providerDisplayName} Key` : `Uzyskaj klucz ${providerDisplayName}`}
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("input")}
                className="flex-1"
              >
                {language === 'en' ? 'I have my key' : 'Mam już klucz'}
              </Button>
            </div>
          </div>
        )}

        {step === "input" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">
                {language === 'en' ? `${providerDisplayName} API Key` : `Klucz API ${providerDisplayName}`}
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={language === 'en' ? 'Paste your API key here...' : 'Wklej swój klucz API tutaj...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-gray-500">
                {language === 'en' 
                  ? 'Your API key is stored securely and only used for cat expertise.'
                  : 'Twój klucz API jest przechowywany bezpiecznie i używany tylko do ekspertyz kotów.'
                }
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setStep("instructions")}
                className="flex-1"
              >
                {language === 'en' ? 'Back' : 'Wstecz'}
              </Button>
              <Button
                onClick={handleConnect}
                disabled={!apiKey.trim() || isConnecting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    {language === 'en' ? 'Connecting...' : 'Łączenie...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Connect' : 'Połącz'}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}