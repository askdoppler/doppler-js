import { defineEventHandler, useRuntimeConfig, getRequestURL, getRequestHost } from '#imports';
import { getSource, logCrawl } from '@askdoppler/core';
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event).doppler;

  try {
    const req = event.node.req;
    const detection = getSource(req);

    if (!detection.detected || !detection.source || !detection.intent) {
      return; // Continue with the request if no detection
    }

    const payload = {
      source: detection.source,
      intent: detection.intent,
      userAgent: req.headers['user-agent'] || '',
      destinationURL: `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}${req.url}` || null,
      headers: Object.fromEntries(Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(';') : v])),
    };

    // Log the crawl (non-blocking by design)
    logCrawl(payload, config.apiKey);
    return;
  } catch (error) {
    //console.error('[Doppler] Middleware error:', error);
    return;
  }
});
