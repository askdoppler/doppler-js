import * as ipaddr from 'ipaddr.js'; // IPv4 / IPv6 + CIDR utilities

/**
 * Base class for AI platform detection
 */
export abstract class BaseFilter {
  protected ips: string[];
  protected userAgents: string[];
  protected ipLists: string[];
  public utm: string[];
  public name: string;

  constructor() {
    this.ips = [];
    this.userAgents = [];
    this.ipLists = [];
    this.utm = [];
    this.name = '';
  }

  /**
   * Get the user agent from the headers
   * @param headers - The request headers
   * @returns The user-agent string, if present
   */
  getUserAgent(headers: Record<string, string | string[] | undefined>): string | undefined {
    return typeof headers['user-agent'] === 'string' ? headers['user-agent'] : headers['user-agent']?.join(' ');
  }

  /**
   * Extract the client IP from `x-forwarded-for`
   * @param headers - The request headers
   * @returns The remote IP (best effort) or `undefined`
   */
  getIp(headers: Record<string, string | string[] | undefined>): string | undefined {
    const forwardedFor = headers['x-forwarded-for'];
    if (!forwardedFor) return undefined;

    const first = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;

    if (!first) return undefined;

    const raw = first.split(',')[0].trim();

    // IPv4 with port (e.g. "192.0.2.1:8080")
    if (raw.includes('.') && raw.includes(':')) return raw.split(':')[0];

    // Pure IPv6 or port-less IPv4
    return raw;
  }

  /**
   * Check whether the UA contains any of the known platform strings
   */
  checkUserAgent(userAgent: string): boolean {
    return this.userAgents.some((ua) => userAgent.includes(ua));
  }

  /**
   * Determine if an IP address lies inside a given CIDR block
   * @param ip      Parsed address (ipaddr.js)
   * @param cidrStr CIDR notation (IPv4 or IPv6)
   */
  private isInCidr(ip: ipaddr.IPv4 | ipaddr.IPv6, cidrStr: string): boolean {
    try {
      const cidr = ipaddr.parseCIDR(cidrStr); // [network, prefixLen]
      return ip.match(cidr);
    } catch {
      return false; // invalid CIDR string
    }
  }

  /**
   * Verify whether an IP matches any allow-listed entry
   * (exact, prefix-only, or full CIDR — IPv4 & IPv6)
   */
  checkIp(ip: string): boolean {
    // Developer localhost shortcuts
    if (process.env.NODE_ENV === 'development' && (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1')) return true;

    let addr: ipaddr.IPv4 | ipaddr.IPv6;
    try {
      addr = ipaddr.parse(ip);

      // Collapse IPv4-mapped IPv6 (::ffff:a.b.c.d) to IPv4
      if (addr.kind() === 'ipv6' && (addr as ipaddr.IPv6).isIPv4MappedAddress()) {
        addr = (addr as ipaddr.IPv6).toIPv4Address();
      }
    } catch {
      return false; // malformed client IP
    }

    return this.ips.some((stored) => {
      // CIDR entry (contains '/')
      if (stored.includes('/')) return this.isInCidr(addr, stored);

      // Exact match
      try {
        if (addr.toNormalizedString() === ipaddr.parse(stored).toNormalizedString()) return true;
      } catch {
        /* ignore bad stored entry */
      }

      // Legacy prefix (no '/')
      return ip.startsWith(stored);
    });
  }

  /**
   * Main check combining IP and UA heuristics
   */
  check(headers: Record<string, string | string[] | undefined>, url?: string): boolean {
    const ua = this.getUserAgent(headers);
    const ip = this.getIp(headers);

    if (!ua || !ip) return false;

    const ipMatch = this.checkIp(ip);
    const uaMatch = this.checkUserAgent(ua);

    if (process.env?.DOPPLER_DEBUG) {
      console.log(`[@askdoppler/core:filters:base] (${this.name}) UA="${ua}" IP="${ip}" → ipMatch=${ipMatch} uaMatch=${uaMatch}`);
    }
    return ipMatch && uaMatch;
  }

  /**
   * Initialise the filter (fetch IP ranges, etc.)
   */
  async init(): Promise<void> {
    if (process.env?.DOPPLER_DEBUG) {
      console.log(`[@askdoppler/core:filters:base] - Initialising filter "${this.name}"`);
    }
    await this.getIps();
  }

  /**
   * Fetch prefix lists and populate `this.ips`
   * Keeps the full CIDR so subnet checks work.
   */
  async getIps(): Promise<void> {
    const ranges: string[] = [];

    for (const list of this.ipLists) {
      try {
        const resp = await fetch(list);
        const data = await resp.json();
        if (!data?.prefixes) continue;

        ranges.push(...data.prefixes.map((p: { ipv4Prefix?: string; ipv6Prefix?: string }) => p.ipv4Prefix ?? p.ipv6Prefix ?? null).filter(Boolean));
      } catch {
        /* ignore network / parse errors and continue */
        continue;
      }
    }

    this.ips = ranges;
    if (process.env?.DOPPLER_DEBUG) {
      console.log(`[@askdoppler/core:filters:base] - Retrieved ${this.ips.length} ranges for ${this.name}`);
    }
  }

  /**
   * Return the platform-specific intent for analytics
   */
  protected abstract getIntent(userAgent: string): string;
}
