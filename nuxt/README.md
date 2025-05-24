# @askdoppler/nuxt

Nuxt 3 module for Doppler AI SEO detection and logging.

## Usage

1. Install:

Use your favorite package manager:

```sh
bun add @askdoppler/nuxt
yarn add @askdoppler/nuxt
npm install @askdoppler/nuxt
pnpm add @askdoppler/nuxt
```

2. Add to your nuxt.config.ts:

```ts
export default defineNuxtConfig({
  modules: ['@askdoppler/nuxt'],
  doppler: {
    apiKey: 'your-api-key-here',
  },
});
```

That’s it the module will log eligible AI-originated traffic automatically, head to the dashboard on [Doppler](https://askdoppler.com) to see the results.
