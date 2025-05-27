import { useRuntimeConfig } from '#imports';
import { getSource, logCrawl, type DopplerCrawlPayload } from '@askdoppler/core';
import { defineNitroPlugin } from 'nitropack/runtime/internal/plugin';

export default defineNitroPlugin((nitroApp) => {
  const config: any = useRuntimeConfig()?.doppler;

  nitroApp.hooks.hook('request', (event) => {
    try {
      const req = event.node.req;

      if (process.env?.DOPPLER_DEBUG) {
        console.log(`[@askdoppler/nuxt:plugin] - Request detected: ${req.url}, getting source`);
      }

      const detection = getSource(req);

      if (!detection.detected || !detection.source || !detection.intent) {
        return; // Continue with the request if no detection
      }

      const payload: any = {
        ...detection,
        userAgent: req.headers['user-agent'] || '',
        destinationURL: `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}${req.url}` || null,
        headers: Object.fromEntries(Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(';') : v])),
      };

      // GDPR-Compliance, 0 user-identifying information
      if (payload.type === 'click') {
        payload.userAgent = null;
        payload.headers = null;
      }

      if (process.env?.DOPPLER_DEBUG) {
        console.log(`[@askdoppler/nuxt:plugin] - Sending payload ${JSON.stringify(payload, null, 4)}`);
      }

      // Log the crawl (non-blocking by design)
      logCrawl(payload, config.apiKey);
    } catch (error) {
      //console.error('[Doppler] Middleware error:', error);
    }
  });
});
