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
  { label: "Indonesian", value: "id" },
  { label: "English", value: "en" },
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
