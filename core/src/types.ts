export interface DopplerDetectionResult {
  source: string | null;
  intent: string | null;
  detected: boolean;
}

export interface DopplerCrawlPayload {
  source: string;
  intent: string;
  userAgent: string | null;
  destinationURL: string | null;
  headers: Record<string, string | string[] | undefined>;
}
