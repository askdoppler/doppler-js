# @askdoppler/nuxt

Nuxt 3 module for Doppler AI SEO detection and logging.

## Usage

1. Install:

```sh
bun add @askdoppler/nuxt @askdoppler/core
yarn add @askdoppler/nuxt @askdoppler/core
npm install @askdoppler/nuxt @askdoppler/core
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

That’s it — the module will log eligible AI-originated traffic automatically, head to the dashboard on [Doppler](https://askdoppler.com) to see the results.
