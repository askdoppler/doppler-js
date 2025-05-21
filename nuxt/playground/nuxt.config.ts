export default defineNuxtConfig({
  modules: ['../src/module'],
  doppler: {
    apiKey: 'your-api-key',
  },
  devtools: { enabled: true },
});
