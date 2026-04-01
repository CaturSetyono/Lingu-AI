import { describe, it, expect } from "vitest";
import {
  buildSystemPrompt,
  buildUserPrompt,
  validateInput,
} from "../utils/prompts";

describe("Prompts Utilities", () => {
  describe("buildSystemPrompt", () => {
    it("should return a system prompt string", () => {
      const prompt = buildSystemPrompt();
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(0);
    });

    it("should contain key instructions", () => {
      const prompt = buildSystemPrompt();
      expect(prompt.toLowerCase()).toContain("writing assistant");
      expect(prompt.toLowerCase()).toContain("rewrite");
    });
  });

  describe("buildUserPrompt", () => {
    it("should build a complete user prompt", () => {
      const prompt = buildUserPrompt({
        tone: "professional",
        style: "concise",
        language: "en",
        length: "original",
        targetText: "Hello, this is a test text.",
      });

      expect(typeof prompt).toBe("string");
      expect(prompt).toContain("professional");
      expect(prompt).toContain("concise");
      expect(prompt).toContain("Hello, this is a test text.");
    });

    it("should include custom prompt if provided", () => {
      const customPrompt = "Make it more engaging";
      const prompt = buildUserPrompt({
        tone: "casual",
        style: "descriptive",
        language: "en",
        length: "longer",
        customPrompt,
        targetText: "Sample text",
      });

      expect(prompt).toContain(customPrompt);
    });

    it("should handle Indonesian language", () => {
      const prompt = buildUserPrompt({
        tone: "formal",
        style: "academic",
        language: "id",
        length: "shorter",
        targetText: "Teks contoh",
      });

      expect(prompt).toContain("Indonesian");
    });

    it("should handle different tones", () => {
      const toneKeywords: Record<string, string> = {
        formal: "formal",
        casual: "casual",
        professional: "professional",
        humorous: "humor",
      };

      Object.entries(toneKeywords).forEach(([tone, keyword]) => {
        const prompt = buildUserPrompt({
          tone: tone as any,
          style: "concise",
          language: "en",
          length: "original",
          targetText: "Test text",
        });
        expect(prompt.toLowerCase()).toContain(keyword.toLowerCase());
      });
    });
  });

  describe("validateInput", () => {
    it("should reject empty text", () => {
      const result = validateInput("");
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should reject text shorter than 10 characters", () => {
      const result = validateInput("Hello");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("10 characters");
    });

    it("should accept valid text", () => {
      const result = validateInput("This is a valid test text.");
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject text exceeding max length", () => {
      const longText = "a".repeat(5001);
      const result = validateInput(longText);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("5000 characters");
    });

    it("should accept text at boundaries", () => {
      const minText = "a".repeat(10);
      const maxText = "a".repeat(5000);

      expect(validateInput(minText).valid).toBe(true);
      expect(validateInput(maxText).valid).toBe(true);
    });

    it("should handle whitespace-only text", () => {
      const result = validateInput("     ");
      expect(result.valid).toBe(false);
    });
  });
});
