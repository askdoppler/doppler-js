# @askdoppler/next

Next.js middleware for Doppler AI traffic detection and logging.

## Usage

1. Install using your favourite package manager:

```sh
npm install @askdoppler/next
```

2. Create a `middleware.ts` file at the root of your Next.js project:

```ts
import { dopplerMiddleware } from '@askdoppler/next'

export const middleware = dopplerMiddleware({ apiKey: 'your-api-key-here' })
```

That's it! Eligible AI traffic will be logged automatically. Visit [Doppler](https://askdoppler.com) to view your analytics.
