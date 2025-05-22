import { DopplerDetectionResult } from './types';

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

  if (utmSource === 'chatgpt.com') {
    return {
      source: 'openai',
      intent: 'browse',
      type: 'click',
      highlightedText,
      detected: true,
    };
  }

  if (utmSource === 'perplexity.com') {
    return {
      source: 'perplexity',
      intent: 'browse',
      type: 'click',
      highlightedText,
      detected: true,
    };
  }

  // Then check for crawl detection (user agents)
  if (userAgent.includes('ChatGPT-User/1.0') || userAgent.includes('+https://openai.com/') || Object.keys(headers).some((h) => h.startsWith('x-openai'))) {
    return {
      source: 'openai',
      intent: headers['x-openai-internal-caller'] || 'browse',
      type: 'crawl',
      highlightedText,
      detected: true,
    };
  }

  if (userAgent.includes('Perplexity-User/1.0') || userAgent.includes('+https://perplexity.ai/perplexity-user')) {
    return {
      source: 'perplexity',
      intent: 'browse',
      type: 'crawl',
      highlightedText,
      detected: true,
    };
  }

  // Not detected
  return { source: null, intent: null, type: null, highlightedText: null, detected: false };
}

function normalizeHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const k in headers) {
    const v = headers[k];
    // Only add defined values, skip undefined
    if (typeof v !== 'undefined') {
      normalized[k.toLowerCase()] = Array.isArray(v) ? v.join(';') : v;
    }
  }
  return normalized;
}
