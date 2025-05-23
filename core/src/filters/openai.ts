import { BaseFilter } from './base';

/**
 * Check if the request is from OpenAI
 */
class OpenAI extends BaseFilter {
  constructor() {
    super();

    this.userAgents = [
      'OAI-SearchBot/1.0',
      'ChatGPT-User/1.0',
      '+https://openai.com/bot',
      '+https://openai.com/searchbot',
      'GPTBot/1.1',
      '+https://openai.com/gptbot',
    ];

    this.ipLists = ['https://openai.com/searchbot.json', 'https://openai.com/chatgpt-user.json', 'https://openai.com/gptbot.json'];
    this.utm = ['chatgpt.com', 'openai.com'];
    this.name = 'openai';
  }

  /**
   * Get the intent from the user agent
   * @param userAgent - The user agent of the request
   * @returns The intent from the request
   */
  getIntent(userAgent: string): string {
    if (userAgent.includes('OAI-SearchBot/1.0') || userAgent.includes('+https://openai.com/searchbot')) {
      return 'search';
    } else if (userAgent.includes('ChatGPT-User/1.0') || userAgent.includes('+https://openai.com/chatgpt-user')) {
      return 'chat';
    } else if (userAgent.includes('GPTBot/1.1') || userAgent.includes('+https://openai.com/gptbot')) {
      return 'crawl';
    } else return 'browse';
  }
}

export { OpenAI };
