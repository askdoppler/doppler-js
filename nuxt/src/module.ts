import { defineNuxtModule, addPlugin, createResolver, addServerHandler } from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiKey: string;
  baseUrl: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@askdoppler/nuxt',
    configKey: 'doppler',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    apiKey: '',
    baseUrl: 'https://askdoppler.com',
  },
  setup(options, nuxt) {
    nuxt.options.runtimeConfig.doppler = options;

    const resolver = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));

    addServerHandler({
      middleware: true,
      handler: resolver.resolve('./runtime/server/middleware'),
    });
  },
});
