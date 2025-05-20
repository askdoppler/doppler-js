import { defineEventHandler, type H3Event } from "h3";
import { getSource, logCrawl } from "@askdoppler/core";

export default defineEventHandler((e: H3Event) => {
  const req = e.node.req;
  const apiKey = process.env.DOPPLER_API_KEY || "";

  try {
    const detection = getSource(req);

    if (!detection.detected || !detection.source || !detection.intent) {
      return; // Continue with the request if no detection
    }

    console.log("detection", detection);

    const payload = {
      source: detection.source,
      intent: detection.intent,
      userAgent: req.headers["user-agent"] || "",
      destinationURL:
        `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}${
          req.url
        }` || null,
      headers: Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [
          k,
          Array.isArray(v) ? v.join(";") : v,
        ])
      ),
    };

    // Log the crawl (non-blocking by design)
    logCrawl(payload, apiKey);
    return;
  } catch (error) {
    console.error("Error in Doppler middleware:", error);
    // Continue with the request even if there's an error
    return;
  }
});
