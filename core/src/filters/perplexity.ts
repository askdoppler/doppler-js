import { BaseFilter } from './base';

/**
 * Check if the request is from Perplexity
 */
class Perplexity extends BaseFilter {
  constructor() {
    super();

    this.userAgents = ['PerplexityBot/1.0', '+https://perplexity.ai/perplexitybot', 'Perplexity-User/1.0', '+https://perplexity.ai/perplexity-user'];
    this.ipLists = ['https://www.perplexity.com/perplexitybot.json', 'https://www.perplexity.com/perplexity-user.json'];
    this.utm = ['perplexity.ai', 'perplexity.com'];
    this.name = 'perplexity';
  }

  /**
   * Get the intent from the user agent
   * @param userAgent - The user agent of the request
   * @returns The intent from the request
   */
  getIntent(userAgent: string): string {
    if (userAgent.includes('PerplexityBot/1.0') || userAgent.includes('+https://perplexity.ai/perplexitybot')) {
      return 'search';
    } else if (userAgent.includes('Perplexity-User/1.0') || userAgent.includes('+https://perplexity.ai/perplexity-user')) {
      return 'chat';
    } else return 'browse';
  }
}

export { Perplexity };
