/**
 * API Route for text generation using OXLO
 * Endpoint: POST /api/generate
 */

import type { APIRoute } from "astro";
import { OpenAI } from "openai";
import {
  buildSystemPrompt,
  buildUserPrompt,
  validateInput,
} from "../../utils/prompts";
import type { GenerateRequest, APIResponse } from "../../utils/types";
import { OXLO_MODEL, API_TIMEOUT } from "../../utils/constants";

// Load environment variables in development
import "dotenv/config";

// Mark this page as NOT pre-renderable (requires server rendering)
export const prerender = false;

const OXLO_BASE_URL = "https://api.oxlo.ai/v1";

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

  const validLanguages = ["id", "en"];
  if (!validLanguages.includes(language)) {
    return { valid: false, error: "Invalid language" };
  }

  const validLengths = ["shorter", "original", "longer"];
  if (!validLengths.includes(length)) {
    return { valid: false, error: "Invalid length" };
  }

  return { valid: true };
}

/**
 * Call OXLO API using OpenAI SDK
 */
async function callAI(
  systemPrompt: string,
  userPrompt: string,
): Promise<{ result?: string; error?: string }> {
  const apiKey = process.env.OXLO_API_KEY;

  if (!apiKey) {
    return {
      error:
        "OXLO API key not configured. Please add OXLO_API_KEY to environment variables.",
    };
  }

  try {
    console.log("Calling OXLO API with model:", OXLO_MODEL);
    
    const client = new OpenAI({
      baseURL: OXLO_BASE_URL,
      apiKey: apiKey,
      timeout: 60000, // 60 seconds for OXLO (deepseek-r1 can be slower)
    });

    const completion = await client.chat.completions.create({
      model: OXLO_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = completion.choices?.[0]?.message?.content;

    if (!result) {
      return { error: "No response from OXLO" };
    }

    return { result: result.trim() };
  } catch (error) {
    console.error("OXLO API Error:", error);
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // Check for specific error types
      if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
        return {
          error: "Invalid OXLO API key. Please check your OXLO_API_KEY in environment variables.",
        };
      }
      if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
        return {
          error: "OXLO rate limited. Please try again in a few moments.",
        };
      }
      if (errorMessage.includes("timeout") || errorMessage.includes("econnrefused")) {
        return {
          error: "Request timeout. OXLO is taking too long to respond. Try again later.",
        };
      }
      if (errorMessage.includes("enotfound") || errorMessage.includes("network")) {
        return {
          error: "Network error connecting to OXLO. Please check your internet connection.",
        };
      }
      
      return { error: `OXLO request failed: ${error.message}` };
    }
    return { error: "Unknown error occurred with OXLO" };
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

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
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

    // Call OXLO AI
    const apiResult = await callAI(systemPrompt, userPrompt);

    const { result, error } = apiResult;

    if (error) {
      return new Response(JSON.stringify({ success: false, error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

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
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
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
