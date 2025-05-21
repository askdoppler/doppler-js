import { defineNuxtModule, createResolver, addServerPlugin } from '@nuxt/kit';

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
    const resolver = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.doppler = options;

    addServerPlugin(resolver.resolve('./runtime/plugin'));
  },
});
