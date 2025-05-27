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
   * @param headers - The headers of the request
   * @returns The user agent from the headers
   */
  getUserAgent(headers: Record<string, string | string[] | undefined>): string | undefined {
    return typeof headers['user-agent'] === 'string' ? headers['user-agent'] : headers['user-agent']?.join(' ');
  }

  /**
   * Get the IP from the headers
   * @param headers - The headers of the request
   * @returns The IP from the headers
   */
  getIp(headers: Record<string, string | string[] | undefined>): string | undefined {
    const forwardedFor = headers['x-forwarded-for'];
    if (!forwardedFor) return undefined;

    // If it's a string, get the first IP in the chain
    if (typeof forwardedFor === 'string') {
      const ip = forwardedFor.split(',')[0].trim();
      // Remove port for IPv4 (e.g., "192.168.1.1:8080" -> "192.168.1.1")
      // For IPv6, we need to be more careful as they contain colons
      if (ip.includes('.') && ip.includes(':')) {
        // IPv4 with port
        return ip.split(':')[0];
      }
      // IPv6 addresses or IPv4 without port
      return ip;
    }

    // If it's an array, get the first IP from the first entry
    const ip = forwardedFor?.[0]?.split(',')[0].trim();
    if (!ip) return undefined;

    // Same logic for array case
    if (ip.includes('.') && ip.includes(':')) {
      // IPv4 with port
      return ip.split(':')[0];
    }
    // IPv6 addresses or IPv4 without port
    return ip;
  }

  /**
   * Check if the user agent is in the list of user agents
   * @param userAgent - The user agent to check
   * @returns True if the user agent is in the list, false otherwise
   */
  checkUserAgent(userAgent: string): boolean {
    return this.userAgents.some((ua) => userAgent.includes(ua));
  }

  /**
   * Check if the IP is in the list of IPs
   * @param ip - The IP to check
   * @returns True if the IP is in the list, false otherwise
   */
  checkIp(ip: string): boolean {
    // Check for development localhost (IPv4)
    if (ip === '127.0.0.1' && process.env.NODE_ENV === 'development') {
      return true;
    }

    // Check for development localhost (IPv6)
    if ((ip === '::1' || ip === '::ffff:127.0.0.1') && process.env.NODE_ENV === 'development') {
      return true;
    }

    // Check if the IP matches any stored IP prefixes (both IPv4 and IPv6)
    return this.ips.some((storedIp) => {
      // For exact matches
      if (storedIp === ip) return true;

      // For prefix matches (useful for CIDR ranges that were stripped of their /xx notation)
      // This handles cases where the stored IP is a network prefix
      return ip.startsWith(storedIp);
    });
  }

  /**
   * Check if the request is from the AI platform
   * @param headers - The headers of the request
   * @param url - The URL of the request
   * @returns True if the request is from the AI platform, false otherwise
   */
  check(headers: Record<string, string | string[] | undefined>, url?: string): boolean {
    const userAgent = this.getUserAgent(headers);
    const ip = this.getIp(headers);

    if (!userAgent || !ip) return false;

    const ipMatch = this.checkIp(ip);
    const userAgentMatch = this.checkUserAgent(userAgent || '');

    if (process.env?.DOPPLER_DEBUG) {
      console.log(
        `[@askdoppler/core:filters:base] - Checking ${this.name} - User Agent: ${userAgent}, IP: ${ip}, IP Match: ${ipMatch}, User Agent Match: ${userAgentMatch}`,
      );
    }

    return ipMatch && userAgentMatch;
  }

  /**
   * Initialize the filter
   * @returns True if the filter is initialized, false otherwise
   */
  async init(): Promise<void> {
    if (process.env?.DOPPLER_DEBUG) {
      console.log(`[@askdoppler/core:filters:base] - Initializing filter ${this.name}`);
    }

    await this.getIps();
  }

  /**
   * Get the IPs from the IP lists
   * @returns The IPs from the IP lists
   */
  async getIps(): Promise<void> {
    const range: string[] = [];

    for (const list of this.ipLists) {
      try {
        const response = await fetch(list);
        const data = await response.json();

        if (!data) continue;

        const { prefixes } = data;
        if (!prefixes) continue;

        // Handle both IPv4 and IPv6 prefixes
        range.push(
          ...prefixes
            .map((prefix: { ipv4Prefix?: string; ipv6Prefix?: string }) => {
              if (prefix?.ipv4Prefix) {
                return prefix.ipv4Prefix.split('/')[0];
              }
              if (prefix?.ipv6Prefix) {
                return prefix.ipv6Prefix.split('::/')[0];
              }
              return null;
            })
            .filter(Boolean),
        );
      } catch {
        continue;
      }
    }

    this.ips = range;
    if (process.env?.DOPPLER_DEBUG) {
      console.log(`[@askdoppler/core:filters:base] - Retrieved crawler IPs from ${this.name}, found ${this.ips.length} IPs`);
    }
  }

  /**
   * Get the intent from the request
   * @param userAgent - The user agent of the request
   * @returns The intent from the request
   */
  protected abstract getIntent(userAgent: string): string;
}
