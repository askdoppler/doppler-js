import { DopplerDetectionResult } from './types.js';
import { normalizeHeaders } from './utils.js';
import { OpenAI, Perplexity, Google, Bing } from './filters/index.js';

const filters = [new OpenAI(), new Perplexity(), new Google(), new Bing()];

filters.forEach(async (filter) => {
  await filter.init();
});

export function getSource(req: { headers: Record<string, string | string[] | undefined>; url?: string }): DopplerDetectionResult {
  const headers = normalizeHeaders(req.headers);
  const userAgent = headers['user-agent'] || '';
  const url = req.url || '';

  // Check for click detection first (utm_source)
  let utmSource: string | null = null;
  let highlightedText: string | null = null;

  // Extract highlighted text from URL fragment
  const textFragmentMatch = url.match(/#:~:text=([^&]+)/);

  if (textFragmentMatch) {
    try {
      highlightedText = decodeURIComponent(textFragmentMatch[1]);
    } catch (error) {
      if (process.env?.DOPPLER_DEBUG) {
        console.warn('[@askdoppler/core:filter] - Failed to decode highlighted text:', error);
      }
    }
  }

  if (url.includes('?') || url.includes('&')) {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      utmSource = urlParams.get('utm_source');
    } catch (error) {
      // If URL parsing fails, continue with other detection methods
      if (process.env?.DOPPLER_DEBUG) {
        console.warn('[@askdoppler/core:filter] - Failed to parse URL parameters:', error);
      }
    }
  }

  if (utmSource) {
    if (process.env?.DOPPLER_DEBUG) {
      console.log(`[@askdoppler/core:filter] - UTM source detected: ${utmSource}`);
    }

    for (const filter of filters) {
      for (const utm of filter.utm) {
        if (utmSource.includes(utm)) {
          if (process.env?.DOPPLER_DEBUG) {
            console.log(`[@askdoppler/core:filter] - UTM source ${utm} found for ${filter.name}`);
          }

          return {
            source: filter.name,
            intent: 'browse',
            type: 'click',
            highlightedText,
            detected: true,
          };
        }
      }
    }
  }

  for (const filter of filters) {
    const detected = filter.check(headers, url);

    if (process.env?.DOPPLER_DEBUG) {
      console.log(`[@askdoppler/core:filter] - ${filter.name} detected: ${detected}`);
    }

    if (detected) {
      if (process.env?.DOPPLER_DEBUG) {
        console.log(`[@askdoppler/core:filter] - ${filter.name} detected: ${detected}`);
      }

      return {
        source: filter.name,
        intent: filter.getIntent(userAgent),
        type: 'crawl',
        highlightedText: null,
        detected: true,
      };
    }
  }

  // Not detected
  if (process.env?.DOPPLER_DEBUG) {
    console.log(`[@askdoppler/core:filter] - No filter detected`);
  }

  return { source: null, intent: null, type: null, highlightedText: null, detected: false };
}
