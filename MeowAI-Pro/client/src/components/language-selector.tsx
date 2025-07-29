import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  currentLanguage: 'en' | 'pl';
  onLanguageChange: (language: 'en' | 'pl') => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg z-50">
      <Button
        variant={currentLanguage === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLanguageChange('en')}
        className={`rounded-full text-sm font-medium transition-all duration-300 ${
          currentLanguage === 'en' 
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
            : 'hover:bg-orange-500/20'
        }`}
      >
        🇬🇧 EN
      </Button>
      <Button
        variant={currentLanguage === 'pl' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLanguageChange('pl')}
        className={`rounded-full text-sm font-medium transition-all duration-300 ml-1 ${
          currentLanguage === 'pl' 
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
            : 'hover:bg-orange-500/20'
        }`}
      >
        🇵🇱 PL
      </Button>
    </div>
  );
}
