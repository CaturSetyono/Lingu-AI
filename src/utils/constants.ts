/**
 * Constants for LinguAI Studio settings and options
 */

import type {
  ToneOption,
  StyleOption,
  LanguageOption,
  LengthOption,
} from "./types";

export const TONE_OPTIONS: { label: string; value: ToneOption }[] = [
  { label: "Formal", value: "formal" },
  { label: "Casual", value: "casual" },
  { label: "Professional", value: "professional" },
  { label: "Humorous", value: "humorous" },
];

export const STYLE_OPTIONS: { label: string; value: StyleOption }[] = [
  { label: "Concise", value: "concise" },
  { label: "Descriptive", value: "descriptive" },
  { label: "Academic", value: "academic" },
];

export const LANGUAGE_OPTIONS: { label: string; value: LanguageOption }[] = [
  // ── Asian ──────────────────────────────
  { label: "Indonesian", value: "id" },
  { label: "English", value: "en" },
  { label: "Chinese (Simplified)", value: "zh" },
  { label: "Chinese (Traditional)", value: "zh-tw" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Vietnamese", value: "vi" },
  { label: "Thai", value: "th" },
  { label: "Malay", value: "ms" },
  // ── European ───────────────────────────
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Dutch", value: "nl" },
  { label: "Polish", value: "pl" },
  { label: "Turkish", value: "tr" },
  { label: "Ukrainian", value: "uk" },
  { label: "Swedish", value: "sv" },
  { label: "Danish", value: "da" },
  { label: "Norwegian", value: "no" },
  { label: "Finnish", value: "fi" },
  { label: "Czech", value: "cs" },
  { label: "Romanian", value: "ro" },
  { label: "Hungarian", value: "hu" },
  // ── Middle East & South Asia ───────────
  { label: "Arabic", value: "ar" },
  { label: "Hebrew", value: "he" },
  { label: "Persian (Farsi)", value: "fa" },
  { label: "Hindi", value: "hi" },
  { label: "Bengali", value: "bn" },
];

export const LENGTH_OPTIONS: { label: string; value: LengthOption }[] = [
  { label: "Shorter", value: "shorter" },
  { label: "Original", value: "original" },
  { label: "Longer", value: "longer" },
];

export const DEFAULT_SETTINGS = {
  tone: "professional" as ToneOption,
  style: "concise" as StyleOption,
  language: "en" as LanguageOption,
  length: "original" as LengthOption,
  customPrompt: "",
  lastInput: "",
};

export const MAX_INPUT_LENGTH = 5000;
export const MIN_INPUT_LENGTH = 10;

export const STORAGE_KEY = "linguai-settings";
export const OXLO_MODEL = "deepseek-r1-8b";
export const API_TIMEOUT = 60000; // 60 seconds for OXLO processing
