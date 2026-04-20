/// <reference types="node" />
import type { APIRoute } from "astro";
import { OpenAI } from "openai";
import {
  buildSystemPrompt,
  buildUserPrompt,
  validateInput,
} from "../../utils/prompts";
import type { GenerateRequest, APIResponse } from "../../utils/types";
import { OPENROUTER_MODEL, API_TIMEOUT } from "../../utils/constants";

export const prerender = false;

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

/**
 * Validate the request payload
 */
function validateRequest(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const { text, tone, style, language, length } = body;

  if (!text || typeof text !== "string") {
    return { valid: false, error: "Text is required" };
  }

  const textValidation = validateInput(text);
  if (!textValidation.valid) {
    return textValidation;
  }

  const validTones = ["formal", "casual", "professional", "humorous"];
  if (!validTones.includes(tone)) {
    return { valid: false, error: "Invalid tone" };
  }

  const validStyles = ["concise", "descriptive", "academic"];
  if (!validStyles.includes(style)) {
    return { valid: false, error: "Invalid style" };
  }

  const validLanguages = [
    // Asian
    "id",
    "en",
    "zh",
    "zh-tw",
    "ja",
    "ko",
    "vi",
    "th",
    "ms",
    // European
    "es",
    "fr",
    "de",
    "it",
    "pt",
    "ru",
    "nl",
    "pl",
    "tr",
    "uk",
    "sv",
    "da",
    "no",
    "fi",
    "cs",
    "ro",
    "hu",
    // Middle East & South Asia
    "ar",
    "he",
    "fa",
    "hi",
    "bn",
  ];
  if (!validLanguages.includes(language)) {
    return { valid: false, error: "Invalid language" };
  }

  const validLengths = ["shorter", "original", "longer"];
  if (!validLengths.includes(length)) {
    return { valid: false, error: "Invalid length" };
  }

  return { valid: true };
}

async function callAI(
  systemPrompt: string,
  userPrompt: string,
): Promise<{ result?: string; error?: string }> {
  const apiKey = (import.meta.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY)?.trim();

  if (!apiKey) {
    const errorMsg =
      "Server configuration error: Missing OpenRouter API key. Please contact support.";
    console.error("CRITICAL:", errorMsg);
    return { error: errorMsg };
  }

  try {
    console.log("[OpenRouter] Sending request, model:", OPENROUTER_MODEL);

    const client = new OpenAI({
      baseURL: OPENROUTER_BASE_URL,
      apiKey: apiKey,
      timeout: API_TIMEOUT,
    });

    const completion = await client.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = completion.choices?.[0]?.message?.content;

    if (!raw) {
      console.warn("[OpenRouter] Empty response from API");
      return { error: "No response from OpenRouter" };
    }

    // Strip <think>...</think> reasoning blocks from models like nemotron
    const result = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    console.log("[OpenRouter] Success! Response length:", result.length);
    return { result };
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const errorMsg = errorObj.message || "Unknown error";

    console.error("[OpenRouter] API Error:", errorMsg);

    const lowerMsg = errorMsg.toLowerCase();

    if (
      lowerMsg.includes("401") ||
      lowerMsg.includes("unauthorized") ||
      lowerMsg.includes("invalid")
    ) {
      return {
        error:
          "Authentication failed: Invalid OpenRouter API key. Please verify the key.",
      };
    }
    if (lowerMsg.includes("429") || lowerMsg.includes("rate limit")) {
      return { error: "Rate limited. Please try again in a few moments." };
    }
    if (
      lowerMsg.includes("timeout") ||
      lowerMsg.includes("econnrefused") ||
      lowerMsg.includes("socket")
    ) {
      return { error: "Request timeout. Please try again later." };
    }
    if (lowerMsg.includes("enotfound") || lowerMsg.includes("network")) {
      return { error: "Network error. Please check internet connection." };
    }

    return { error: `API Error: ${errorMsg}` };
  }
}

/**
 * POST handler for /api/generate
 */
export const POST: APIRoute = async ({ request }) => {
  // Only accept POST requests
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("[API] Received POST request to /api/generate");

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("[API] JSON parse error:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON in request body",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const {
      text,
      tone,
      style,
      language,
      length,
      customPrompt,
    }: GenerateRequest = body;

    console.log("[API] Request validated:", {
      textLength: text.length,
      tone,
      style,
      language,
      length,
    });

    // Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt({
      tone,
      style,
      language,
      length,
      customPrompt,
      targetText: text,
    });

    const apiResult = await callAI(systemPrompt, userPrompt);

    const { result, error } = apiResult;

    if (error) {
      console.error("[API] API call returned error:", error);
      return new Response(JSON.stringify({ success: false, error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("[API] Successfully generated response");

    return new Response(
      JSON.stringify({
        success: true,
        result,
        timestamp: Date.now(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const errorMessage = errorObj.message || "Unknown error";

    console.error("[API] Unhandled error:", {
      message: errorMessage,
      stack: errorObj.stack,
      type: errorObj.constructor.name,
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: `Internal server error: ${errorMessage}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
