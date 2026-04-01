import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getSettings,
  saveSettings,
  updateSetting,
  resetSettings,
  initializeStorage,
} from "../utils/storage";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "../utils/constants";

describe("Storage Utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  describe("initializeStorage", () => {
    it("should initialize with default settings if localStorage is empty", () => {
      const result = initializeStorage();
      expect(result).toEqual(DEFAULT_SETTINGS);
    });

    it("should return existing settings if already initialized", () => {
      const customSettings = {
        ...DEFAULT_SETTINGS,
        tone: "casual" as const,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customSettings));
      const result = initializeStorage();
      expect(result.tone).toBe("casual");
    });
  });

  describe("getSettings", () => {
    it("should return default settings when empty", () => {
      const result = getSettings();
      expect(result).toEqual(DEFAULT_SETTINGS);
    });

    it("should return stored settings", () => {
      const custom = {
        ...DEFAULT_SETTINGS,
        language: "id" as const,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
      const result = getSettings();
      expect(result.language).toBe("id");
    });
  });

  describe("saveSettings", () => {
    it("should save partial settings", () => {
      const result = saveSettings({ tone: "humorous" });
      expect(result.tone).toBe("humorous");
      expect(result.style).toBe(DEFAULT_SETTINGS.style);
    });

    it("should persist to localStorage", () => {
      saveSettings({ length: "longer" });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      expect(stored.length).toBe("longer");
    });

    it("should merge with existing settings", () => {
      saveSettings({ tone: "formal" });
      const result = saveSettings({ style: "academic" });
      expect(result.tone).toBe("formal");
      expect(result.style).toBe("academic");
    });
  });

  describe("updateSetting", () => {
    it("should update a single setting", () => {
      const result = updateSetting("language", "id");
      expect(result.language).toBe("id");
    });

    it("should preserve other settings", () => {
      saveSettings({ tone: "casual" });
      const result = updateSetting("language", "id");
      expect(result.tone).toBe("casual");
      expect(result.language).toBe("id");
    });
  });

  describe("resetSettings", () => {
    it("should reset to default settings", () => {
      saveSettings({ tone: "humorous", language: "id" });
      const result = resetSettings();
      expect(result).toEqual(DEFAULT_SETTINGS);
    });

    it("should clear and reinitialize localStorage", () => {
      saveSettings({ customPrompt: "Test prompt" });
      resetSettings();
      const stored = getSettings();
      expect(stored.customPrompt).toBe("");
    });
  });
});
