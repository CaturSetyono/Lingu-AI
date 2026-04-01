/**
 * Type definitions for LinguAI Studio
 */

export type ToneOption = "formal" | "casual" | "professional" | "humorous";
export type StyleOption = "concise" | "descriptive" | "academic";
export type LanguageOption =
  // Asian
  | "id"   // Indonesian
  | "en"   // English
  | "zh"   // Chinese (Simplified)
  | "zh-tw" // Chinese (Traditional)
  | "ja"   // Japanese
  | "ko"   // Korean
  | "vi"   // Vietnamese
  | "th"   // Thai
  | "ms"   // Malay
  // European
  | "es"   // Spanish
  | "fr"   // French
  | "de"   // German
  | "it"   // Italian
  | "pt"   // Portuguese
  | "ru"   // Russian
  | "nl"   // Dutch
  | "pl"   // Polish
  | "tr"   // Turkish
  | "uk"   // Ukrainian
  | "sv"   // Swedish
  | "da"   // Danish
  | "no"   // Norwegian
  | "fi"   // Finnish
  | "cs"   // Czech
  | "ro"   // Romanian
  | "hu"   // Hungarian
  // Middle East & South Asia
  | "ar"   // Arabic
  | "he"   // Hebrew
  | "fa"   // Persian (Farsi)
  | "hi"   // Hindi
  | "bn"   // Bengali;
export type LengthOption = "shorter" | "original" | "longer";

export interface Settings {
  tone: ToneOption;
  style: StyleOption;
  language: LanguageOption;
  length: LengthOption;
  customPrompt: string;
  lastInput: string;
}

export interface GenerateRequest {
  text: string;
  tone: ToneOption;
  style: StyleOption;
  language: LanguageOption;
  length: LengthOption;
  customPrompt?: string;
}

export interface GenerateResponse {
  success: boolean;
  result?: string;
  error?: string;
  timestamp?: number;
}

export interface APIResponse {
  success: boolean;
  result?: string;
  error?: string;
  details?: string;
}
