export interface DopplerDetectionResult {
  source: string | null;
  intent: string | null;
  type: 'crawl' | 'click' | null;
  highlightedText: string | null;
  detected: boolean;
}

export interface DopplerCrawlPayload {
  source: string;
  intent: string;
  type: 'crawl' | 'click' | null;
  highlightedText: string | null;
  userAgent: string | null;
  destinationURL: string | null;
  headers: Record<string, string | string[] | undefined>;
}
