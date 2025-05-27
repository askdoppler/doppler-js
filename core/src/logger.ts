import { DopplerCrawlPayload } from './types.js';

const API_URL = process.env.DOPPLER_API_URL || 'https://askdoppler.com/api/traffic';

export function logCrawl(payload: DopplerCrawlPayload, apiKey?: string) {
  const key = apiKey || process.env.DOPPLER_API_KEY;
  if (!key) return;

  try {
    if (process.env?.DOPPLER_DEBUG) {
      console.log(`[@askdoppler/core:logger] - Sending payload ${JSON.stringify(payload, null, 4)}`);
    }

    fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (process.env?.DOPPLER_DEBUG) {
      console.error(`[@askdoppler/core:logger] - Error sending payload`, error);
    }
    // Silently ignore errors, do not throw
  }
}
