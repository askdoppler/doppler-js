import type { NextRequest, NextFetchEvent, NextMiddleware } from 'next/server';
import { NextResponse } from 'next/server';
import { getSource, logCrawl, type DopplerCrawlPayload } from '@askdoppler/core';

export interface DopplerConfig {
  apiKey?: string;
}

export async function handleRequest(req: NextRequest, config: DopplerConfig = {}): Promise<void> {
  try {
    const detection = getSource({
      headers: Object.fromEntries(req.headers.entries()),
      url: req.url,
    });

    if (!detection.detected || !detection.source || !detection.intent) {
      return;
    }

    const payload: DopplerCrawlPayload = {
      ...detection,
      source: detection.source,
      intent: detection.intent,
      userAgent: req.headers.get('user-agent'),
      destinationURL: req.url,
      headers: Object.fromEntries(req.headers.entries()),
    };

    if (payload.type === 'click') {
      payload.userAgent = null;
      payload.headers = {};
    }

    logCrawl(payload, config.apiKey);
  } catch {
    // ignore errors
  }
}

export function withDoppler(handler: NextMiddleware, config: DopplerConfig = {}): NextMiddleware {
  return async (req: NextRequest, ev: NextFetchEvent) => {
    await handleRequest(req, config);
    return handler(req, ev);
  };
}

export function dopplerMiddleware(config: DopplerConfig = {}): NextMiddleware {
  return withDoppler(() => NextResponse.next(), config);
}

export default dopplerMiddleware;
