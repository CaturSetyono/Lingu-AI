/// <reference types="node" />
/**
 * Health Check Endpoint - Ultra Simple
 * Diagnoses configuration without complex imports
 * GET /api/health
 */

import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const apiKey = import.meta.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

    const response = {
      timestamp: new Date().toISOString(),
      environment: {
        hasOpenRouterKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        nodeEnv: process.env.NODE_ENV || "not set",
      },
      deployment: {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        baseUrl: "https://openrouter.ai/api/v1",
      },
      status: apiKey ? "healthy" : "unhealthy",
      issues: apiKey ? [] : ["OPENROUTER_API_KEY not set in environment"],
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: apiKey ? 200 : 503,
      headers: {
        "Content-Type": "application/json",
        "X-Health-Status": response.status,
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        status: "error",
        message: errorMsg,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
