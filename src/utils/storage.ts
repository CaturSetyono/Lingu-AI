/**
 * Local storage utilities for LinguAI Studio
 * Handles reading, writing, and initializing user settings
 */

import type { Settings } from "./types";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "./constants";

/**
 * Initialize localStorage with default settings if not already set
 */
export function initializeStorage(): Settings {
  if (typeof localStorage === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing) as Settings;
    }
    // Set default settings
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error initializing storage:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Get current settings from localStorage
 */
export function getSettings(): Settings {
  if (typeof localStorage === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Settings;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error reading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: Partial<Settings>): Settings {
  if (typeof localStorage === "undefined") {
    return { ...DEFAULT_SETTINGS, ...settings };
  }

  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error saving settings:", error);
    return { ...DEFAULT_SETTINGS, ...settings };
  }
}

/**
 * Update a single setting field
 */
export function updateSetting<K extends keyof Settings>(
  key: K,
  value: Settings[K],
): Settings {
  return saveSettings({ [key]: value } as Partial<Settings>);
}

/**
 * Clear all settings and reset to defaults
 */
export function resetSettings(): Settings {
  if (typeof localStorage === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error resetting settings:", error);
    return DEFAULT_SETTINGS;
  }
}
