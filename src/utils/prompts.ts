/**
 * Prompt engineering utilities for LinguAI Studio
 * Constructs system and user prompts for OpenRouter API
 */

import type {
  ToneOption,
  StyleOption,
  LanguageOption,
  LengthOption,
} from "./types";

interface PromptParams {
  tone: ToneOption;
  style: StyleOption;
  language: LanguageOption;
  length: LengthOption;
  customPrompt?: string;
  targetText: string;
}

/**
 * Get tone description for the prompt
 */
function getToneDescription(tone: ToneOption): string {
  const tones: Record<ToneOption, string> = {
    formal: "Maintain a formal, professional, and eloquent tone",
    casual: "Use a casual, conversational, and friendly tone",
    professional: "Use a professional and business-appropriate tone",
    humorous: "Add humor and wit while maintaining clarity",
  };
  return tones[tone];
}

/**
 * Get style description for the prompt
 */
function getStyleDescription(style: StyleOption): string {
  const styles: Record<StyleOption, string> = {
    concise: "Keep the rewrite concise and to the point",
    descriptive: "Provide a more detailed and descriptive rewrite",
    academic: "Use academic language and structure",
  };
  return styles[style];
}

/**
 * Get length instruction for the prompt
 */
function getLengthInstruction(length: LengthOption): string {
  const lengths: Record<LengthOption, string> = {
    shorter: "Make the text significantly shorter (reduce by 30-50%)",
    original: "Keep approximately the same length",
    longer: "Expand the text with more detail and explanation (add 30-50%)",
  };
  return lengths[length];
}

/**
 * Build system role prompt
 */
export function buildSystemPrompt(): string {
  return `You are a professional writing assistant specialized in text rewriting and content improvement. Your task is to rewrite or improve the given text according to the specified parameters. Always maintain the core meaning and intent of the original text while applying the requested tone, style, and formatting changes. Provide only the rewritten text without explanations or meta-commentary.`;
}

/**
 * Build user message with all parameters
 */
export function buildUserPrompt(params: PromptParams): string {
  const { tone, style, language, length, customPrompt, targetText } = params;

  const languageNames: Record<LanguageOption, string> = {
    // Asian
    id: "Indonesian",
    en: "English",
    zh: "Chinese (Simplified)",
    "zh-tw": "Chinese (Traditional)",
    ja: "Japanese",
    ko: "Korean",
    vi: "Vietnamese",
    th: "Thai",
    ms: "Malay",
    // European
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    nl: "Dutch",
    pl: "Polish",
    tr: "Turkish",
    uk: "Ukrainian",
    sv: "Swedish",
    da: "Danish",
    no: "Norwegian",
    fi: "Finnish",
    cs: "Czech",
    ro: "Romanian",
    hu: "Hungarian",
    // Middle East & South Asia
    ar: "Arabic",
    he: "Hebrew",
    fa: "Persian (Farsi)",
    hi: "Hindi",
    bn: "Bengali",
  };

  const instructions = [
    getToneDescription(tone),
    getStyleDescription(style),
    getLengthInstruction(length),
    `Output language: ${languageNames[language] ?? language}`,
  ];

  if (customPrompt?.trim()) {
    instructions.push(`Additional context: ${customPrompt}`);
  }

  const prompt = `Please rewrite the following text with these requirements:

${instructions.map((inst) => `• ${inst}`).join("\n")}

---

TEXT TO REWRITE:
${targetText}

---

REWRITTEN TEXT:`;

  return prompt;
}

/**
 * Validate input text before sending to API
 */
export function validateInput(text: string): {
  valid: boolean;
  error?: string;
} {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Please enter some text to rewrite" };
  }

  if (text.trim().length < 10) {
    return {
      valid: false,
      error: "Text must be at least 10 characters long",
    };
  }

  if (text.length > 5000) {
    return {
      valid: false,
      error: "Text must not exceed 5000 characters",
    };
  }

  return { valid: true };
}
