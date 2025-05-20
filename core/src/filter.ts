import { DopplerDetectionResult } from "./types";

export function getSource(req: {
  headers: Record<string, string | string[] | undefined>;
}): DopplerDetectionResult {
  const headers = normalizeHeaders(req.headers);
  const userAgent = headers["user-agent"] || "";

  // 1. OpenAI
  if (
    userAgent.includes("ChatGPT-User/1.0") ||
    userAgent.includes("+https://openai.com/bot") ||
    Object.keys(headers).some((h) => h.startsWith("x-openai"))
  ) {
    return {
      source: "openai",
      intent: headers["x-openai-internal-caller"] || "browse",
      detected: true,
    };
  }

  // 2. Perplexity
  if (
    userAgent.includes("Perplexity-User/1.0") ||
    userAgent.includes("+https://perplexity.ai/perplexity-user")
  ) {
    return {
      source: "perplexity",
      intent: "browse",
      detected: true,
    };
  }

  // Not detected
  return { source: null, intent: null, detected: false };
}

function normalizeHeaders(
  headers: Record<string, string | string[] | undefined>
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const k in headers) {
    const v = headers[k];
    // Only add defined values, skip undefined
    if (typeof v !== "undefined") {
      normalized[k.toLowerCase()] = Array.isArray(v) ? v.join(";") : v;
    }
  }
  return normalized;
}
