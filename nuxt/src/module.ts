import { defineNuxtModule, addServerHandler, createResolver } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "@askdoppler/nuxt",
    configKey: "doppler",
  },
  defaults: {
    apiKey: "",
  },
  setup(options) {
    process.env.DOPPLER_API_KEY = options.apiKey;
    const { resolve } = createResolver(import.meta.url);

    addServerHandler({
      route: "",
      handler: resolve("./middleware"),
      options: {
        apiKey: options.apiKey,
      },
    });
  },
});
