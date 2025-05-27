import { BaseFilter } from './base.js';

/**
 * Check if the request is from Google
 */
class Bing extends BaseFilter {
  constructor() {
    super();

    this.userAgents = ['bingbot/2.0', '+http://www.bing.com/bingbot'];

    this.ipLists = ['https://www.bing.com/toolbox/bingbot.json'];
    this.utm = ['bing.com'];
    this.name = 'bing';
  }

  /**
   * Get the intent from the user agent
   * @param userAgent - The user agent of the request
   * @returns The intent from the request
   */
  getIntent(userAgent: string): string {
    return 'browse';
  }
}

export { Bing };
