/**
 * Health Check Endpoint
 * Diagnoses configuration and connectivity issues
 * GET /api/health
 */

import type { APIRoute } from "astro";
import { OXLO_MODEL } from "../../utils/constants";

export const prerender = false;

export const GET: APIRoute = async () => {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: {
      hasOxloKey: !!process.env.OXLO_API_KEY,
      keyLength: process.env.OXLO_API_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV || "not set",
    },
    deployment: {
      model: OXLO_MODEL,
      baseUrl: "https://api.oxlo.ai/v1",
    },
    status: "healthy" as string,
    issues: [] as string[],
  };

  // Check for critical issues
  if (!process.env.OXLO_API_KEY) {
    checks.status = "unhealthy";
    checks.issues.push(
      "CRITICAL: OXLO_API_KEY environment variable is not set",
    );
  }

  if (!process.env.OXLO_API_KEY?.trim()) {
    checks.status = "unhealthy";
    checks.issues.push("WARNING: OXLO_API_KEY is empty or whitespace only");
  }

  return new Response(JSON.stringify(checks, null, 2), {
    status: checks.status === "healthy" ? 200 : 503,
    headers: {
      "Content-Type": "application/json",
      "X-Health-Status": checks.status,
    },
  });
};
