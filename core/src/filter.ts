import { DopplerDetectionResult } from './types';
import { normalizeHeaders } from './utils';
import { OpenAI, Perplexity, Google } from './filters/index';

const filters = [new OpenAI(), new Perplexity(), new Google()];

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
      console.warn('Failed to decode highlighted text:', error);
    }
  }

  if (url.includes('?') || url.includes('&')) {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      utmSource = urlParams.get('utm_source');
    } catch (error) {
      // If URL parsing fails, continue with other detection methods
      console.warn('Failed to parse URL parameters:', error);
    }
  }

  if (utmSource) {
    for (const filter of filters) {
      for (const utm of filter.utm) {
        if (utmSource.includes(utm)) {
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

    if (detected) {
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
  return { source: null, intent: null, type: null, highlightedText: null, detected: false };
}
