import { OpenAI } from 'openai';
import 'dotenv/config';

function getToneDescription(tone) {
  const tones = {
    formal: "Maintain a formal, professional, and eloquent tone",
    casual: "Use a casual, conversational, and friendly tone",
    professional: "Use a professional and business-appropriate tone",
    humorous: "Add humor and wit while maintaining clarity"
  };
  return tones[tone];
}
function getStyleDescription(style) {
  const styles = {
    concise: "Keep the rewrite concise and to the point",
    descriptive: "Provide a more detailed and descriptive rewrite",
    academic: "Use academic language and structure"
  };
  return styles[style];
}
function getLengthInstruction(length) {
  const lengths = {
    shorter: "Make the text significantly shorter (reduce by 30-50%)",
    original: "Keep approximately the same length",
    longer: "Expand the text with more detail and explanation (add 30-50%)"
  };
  return lengths[length];
}
function buildSystemPrompt() {
  return `You are a professional writing assistant specialized in text rewriting and content improvement. Your task is to rewrite or improve the given text according to the specified parameters. Always maintain the core meaning and intent of the original text while applying the requested tone, style, and formatting changes. Provide only the rewritten text without explanations or meta-commentary.`;
}
function buildUserPrompt(params) {
  const { tone, style, language, length, customPrompt, targetText } = params;
  const instructions = [
    getToneDescription(tone),
    getStyleDescription(style),
    getLengthInstruction(length),
    `Output language: ${language === "id" ? "Indonesian" : "English"}`
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
function validateInput(text) {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: "Please enter some text to rewrite" };
  }
  if (text.trim().length < 10) {
    return {
      valid: false,
      error: "Text must be at least 10 characters long"
    };
  }
  if (text.length > 5e3) {
    return {
      valid: false,
      error: "Text must not exceed 5000 characters"
    };
  }
  return { valid: true };
}

const OXLO_MODEL = "deepseek-r1-8b";

const prerender = false;
const OXLO_BASE_URL = "https://api.oxlo.ai/v1";
function validateRequest(body) {
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
async function callAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OXLO_API_KEY;
  if (!apiKey) {
    return {
      error: "OXLO API key not configured. Please add OXLO_API_KEY to environment variables."
    };
  }
  try {
    console.log("Calling OXLO API with model:", OXLO_MODEL);
    const client = new OpenAI({
      baseURL: OXLO_BASE_URL,
      apiKey,
      timeout: 6e4
      // 60 seconds for OXLO (deepseek-r1 can be slower)
    });
    const completion = await client.chat.completions.create({
      model: OXLO_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2e3
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
      if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
        return {
          error: "Invalid OXLO API key. Please check your OXLO_API_KEY in environment variables."
        };
      }
      if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
        return {
          error: "OXLO rate limited. Please try again in a few moments."
        };
      }
      if (errorMessage.includes("timeout") || errorMessage.includes("econnrefused")) {
        return {
          error: "Request timeout. OXLO is taking too long to respond. Try again later."
        };
      }
      if (errorMessage.includes("enotfound") || errorMessage.includes("network")) {
        return {
          error: "Network error connecting to OXLO. Please check your internet connection."
        };
      }
      return { error: `OXLO request failed: ${error.message}` };
    }
    return { error: "Unknown error occurred with OXLO" };
  }
}
const POST = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
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
          error: "Invalid JSON in request body"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const validation = validateRequest(body);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const {
      text,
      tone,
      style,
      language,
      length,
      customPrompt
    } = body;
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt({
      tone,
      style,
      language,
      length,
      customPrompt,
      targetText: text
    });
    const apiResult = await callAI(systemPrompt, userPrompt);
    const { result, error } = apiResult;
    if (error) {
      return new Response(JSON.stringify({ success: false, error }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(
      JSON.stringify({
        success: true,
        result,
        timestamp: Date.now()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        success: false,
        error: `Internal server error: ${errorMessage}`
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
