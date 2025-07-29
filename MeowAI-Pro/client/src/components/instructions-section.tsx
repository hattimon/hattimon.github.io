import { Card } from "@/components/ui/card";
import { Info, CheckCircle } from "lucide-react";
import { translate, type Language } from "@/lib/translations";

interface InstructionsSectionProps {
  language: Language;
}

export function InstructionsSection({ language }: InstructionsSectionProps) {
  return (
    <Card className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-6 border border-orange-500/20">
      <div className="flex items-center mb-4">
        <Info className="text-orange-500 text-2xl mr-3" />
        <h2 className="text-2xl font-bold text-amber-800">
          {translate("instructions-title", language)}
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-gray-700">
            {translate("instructions-desc", language)}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
              <span>{translate("step1", language)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
              <span>{translate("step2", language)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
              <span>{translate("step3", language)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-4">
          <h3 className="font-semibold text-amber-800 mb-2">
            {translate("benefits-title", language)}
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>{translate("benefit1", language)}</li>
            <li>{translate("benefit2", language)}</li>
            <li>{translate("benefit3", language)}</li>
            <li>{translate("benefit4", language)}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
