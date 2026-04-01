/**
 * Type definitions for LinguAI Studio
 */

export type ToneOption = "formal" | "casual" | "professional" | "humorous";
export type StyleOption = "concise" | "descriptive" | "academic";
export type LanguageOption = "id" | "en";
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
