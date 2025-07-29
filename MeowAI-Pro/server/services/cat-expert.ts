export const CAT_EXPERT_SYSTEM_PROMPT = `You are Dr. Whiskers, a highly experienced and professional veterinary cat specialist with over 15 years of clinical experience. You provide expert-level advice on feline health, behavior, nutrition, and care.

EXPERTISE AREAS:
- Veterinary medicine and cat health diagnostics
- Feline behavior analysis and training
- Cat nutrition and dietary planning
- Breed-specific care and characteristics
- Emergency care and first aid for cats
- Preventive healthcare and wellness

RESPONSE GUIDELINES:
1. ALWAYS prioritize cat safety and health
2. Recommend veterinary consultation for serious health concerns
3. Provide evidence-based, professional advice
4. Use clear, actionable recommendations
5. Include relevant medical terminology when appropriate
6. Distinguish between emergency and non-emergency situations
7. Consider both physical and behavioral aspects

EMERGENCY INDICATORS:
- Breathing difficulties
- Inability to urinate (especially male cats)
- Severe lethargy or hiding
- Vomiting/diarrhea for 24+ hours
- Loss of appetite for 2+ days
- Signs of pain or distress
- Injuries or bleeding
- Suspected poisoning

For emergencies, ALWAYS recommend immediate veterinary care.

RESPONSE FORMAT:
- Start with assessment of urgency level
- Provide specific, actionable advice
- Include "when to see a vet" guidance
- End with supportive care tips when appropriate

Remember: You're providing professional veterinary guidance to help cat owners make informed decisions about their pet's health and wellbeing.`;

export interface CatExpertQuery {
  question: string;
  context?: {
    catAge?: string;
    catBreed?: string;
    symptoms?: string[];
    duration?: string;
    urgency?: 'low' | 'medium' | 'high' | 'emergency';
  };
}

export function enhancePromptWithContext(query: CatExpertQuery): string {
  let enhancedPrompt = query.question;

  if (query.context) {
    const contextInfo: string[] = [];
    
    if (query.context.catAge) {
      contextInfo.push(`Cat age: ${query.context.catAge}`);
    }
    
    if (query.context.catBreed) {
      contextInfo.push(`Cat breed: ${query.context.catBreed}`);
    }
    
    if (query.context.symptoms && query.context.symptoms.length > 0) {
      contextInfo.push(`Observed symptoms: ${query.context.symptoms.join(', ')}`);
    }
    
    if (query.context.duration) {
      contextInfo.push(`Duration: ${query.context.duration}`);
    }

    if (contextInfo.length > 0) {
      enhancedPrompt = `Context: ${contextInfo.join(' | ')}\n\nQuestion: ${query.question}`;
    }
  }

  return enhancedPrompt;
}

export function classifyUrgency(question: string): 'low' | 'medium' | 'high' | 'emergency' {
  const emergencyKeywords = [
    'emergency', 'urgent', 'bleeding', 'breathing', 'unconscious', 'seizure',
    'poisoned', 'toxic', 'can\'t breathe', 'choking', 'hit by car',
    'broken bone', 'severe pain', 'collapse'
  ];

  const highUrgencyKeywords = [
    'vomiting', 'diarrhea', 'not eating', 'hiding', 'lethargic',
    'pain', 'limping', 'blood', 'urinating', 'constipated'
  ];

  const mediumUrgencyKeywords = [
    'behavior change', 'appetite', 'drinking', 'sleeping',
    'scratching', 'meowing', 'aggression'
  ];

  const lowerQuestion = question.toLowerCase();

  if (emergencyKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return 'emergency';
  }

  if (highUrgencyKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return 'high';
  }

  if (mediumUrgencyKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return 'medium';
  }

  return 'low';
}

export function generateQuickPrompts(language: 'en' | 'pl') {
  const prompts = {
    en: {
      health: "What are the signs of a healthy cat I should look for?",
      behavior: "My cat is acting differently lately. What could this mean?",
      nutrition: "What's the best diet for my adult cat?",
      emergency: "What should I do in a cat emergency?"
    },
    pl: {
      health: "Jakie oznaki zdrowego kota powinienem obserwować?",
      behavior: "Mój kot zachowuje się ostatnio inaczej. Co to może oznaczać?",
      nutrition: "Jaka jest najlepsza dieta dla mojego dorosłego kota?",
      emergency: "Co powinienem zrobić w nagłym przypadku z kotem?"
    }
  };

  return prompts[language];
}
