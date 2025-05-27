import { BaseFilter } from './base.js';

/**
 * Check if the request is from Google
 */
class Google extends BaseFilter {
  constructor() {
    super();

    this.userAgents = ['Google-CloudVertexBot', 'Googlebot', 'Google-Extended'];

    this.ipLists = [
      'https://developers.google.com/static/search/apis/ipranges/googlebot.json',
      'https://developers.google.com/static/search/apis/ipranges/special-crawlers.json',
      'https://developers.google.com/static/search/apis/ipranges/user-triggered-fetchers.json',
      'https://developers.google.com/static/search/apis/ipranges/user-triggered-fetchers-google.json',
    ];
    this.utm = ['google.com'];
    this.name = 'google';
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

export { Google };
