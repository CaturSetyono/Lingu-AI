/// <reference types="node" />
/**
 * Health Check Endpoint
 * GET /api/health
 *
 * Protected by a secret header to prevent public information disclosure.
 * Set HEALTH_SECRET env var and pass it as X-Health-Secret header.
 * If HEALTH_SECRET is not set, the endpoint returns only a minimal status.
 */

import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const healthSecret = process.env.HEALTH_SECRET;
    const providedSecret = request.headers.get("x-health-secret");

    // If a health secret is configured, require it to be provided correctly
    if (healthSecret && providedSecret !== healthSecret) {
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.OXLO_API_KEY;
    const isHealthy = !!apiKey;

    const response = {
      timestamp: new Date().toISOString(),
      status: isHealthy ? "healthy" : "unhealthy",
      issues: isHealthy ? [] : ["OXLO_API_KEY not configured"],
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: isHealthy ? 200 : 503,
      headers: {
        "Content-Type": "application/json",
        "X-Health-Status": response.status,
      },
    });
  } catch (error) {
    console.error("[health] Unhandled error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
