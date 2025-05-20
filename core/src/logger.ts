import { DopplerCrawlPayload } from "./types";

const API_URL =
  process.env.DOPPLER_API_URL || "https://askdoppler.com/api/crawls";

export function logCrawl(payload: DopplerCrawlPayload, apiKey?: string) {
  const key = apiKey || process.env.DOPPLER_API_KEY;
  if (!key) return;

  try {
    fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently ignore errors, do not throw
  }
}
