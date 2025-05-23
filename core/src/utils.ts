export function normalizeHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string> {
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
