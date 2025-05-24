# @askdoppler/core

Doppler Core is the heart of Doppler's AI SEO toolkit.  
It provides traffic source detection, intent inference, and logs relevant AI/LLM platform requests to Doppler for analytics and monitoring.

## Features

- Detects AI platform requests (OpenAI, Perplexity, etc) based on headers and user-agent
- Infers traffic intent (e.g., "browse" or "crawl")
- Framework-agnostic: plug into Nuxt, Next.js, Express, and more
- Sends logs to Doppler API for analysis (non-blocking)

## Usage

1. **Install:**

```sh
bun add @askdoppler/core
yarn add @askdoppler/core
npm install @askdoppler/core
```

2. **Detect and log a request:**

```ts
import { getSource, logCrawl, handleCrawl } from '@askdoppler/core';

// Simple usage in any Node.js/JS context:
const detection = getSource(request); // returns { source, intent, detected }

// If detected, log:
if (detection.detected) {
  await logCrawl({
    ...detection,
    userAgent: request.headers['user-agent'] || '',
    destinationURL: request.url,
    headers: request.headers,
  });
}
```

3. **Environment Variable:**

Set your Doppler API key in the environment:

```ini
DOPPLER_API_KEY=your-api-key-here
```

## API

- `getSource(req)` : Detects if request is from an AI platform and returns { source, intent, detected }
- `logCrawl(payload, apiKey?)` : Logs a crawl event to Doppler API
- `handleCrawl(req, apiKey?)` : Detects and logs in one step, for middleware

## License

MIT License
