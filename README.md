# Doppler JS

Doppler JS is a collection of JavaScript/TypeScript packages for AI SEO monitoring and analytics. It helps you track and analyze traffic from AI platforms like ChatGPT and Perplexity, providing insights into how AI agents interact with your website.

## Packages

### [@askdoppler/core](./core/README.md)

The core package that provides AI traffic detection and logging capabilities. Framework-agnostic, it can be used with any Node.js application.

```sh
npm install @askdoppler/core
```

### [@askdoppler/nuxt](./nuxt/README.md)

A Nuxt 3 module that integrates Doppler's AI traffic detection into your Nuxt application with zero configuration.

```sh
npm install @askdoppler/nuxt
```

### [@askdoppler/next](./next/README.md)

A Next.js middleware that logs eligible AI traffic for you.

```sh
npm install @askdoppler/next
```

## Features

- 🔍 **AI Traffic Detection**: Automatically identifies requests from AI platforms
- 🎯 **Intent Inference**: Determines if traffic is from browsing or crawling
- 📊 **Analytics**: Logs and analyzes AI traffic patterns
- 🛠 **Framework Support**: Works with Nuxt, Next.js, Express, and more
- ⚡ **Performance**: Non-blocking operations for optimal performance

## Quick Start

1. Install the package for your framework:

   ```sh
   # For Nuxt
   npm install @askdoppler/nuxt

   # For Next.js
   npm install @askdoppler/next

   # For other frameworks
   npm install @askdoppler/core
   ```

2. Set up your API key:

   ```sh
   DOPPLER_API_KEY=your-api-key-here
   ```

3. View your analytics at [askdoppler.com](https://askdoppler.com)

## Development

This is a monorepo containing multiple packages. Each package has its own README with specific development instructions.

### Prerequisites

- Node.js >= 18
- npm or yarn

### Building

```sh
# Build all packages
npm run build

# Build specific package
cd packages/core && npm run build
cd packages/nuxt && npm run build
```

### Testing

```sh
# Run tests for all packages
npm test

# Run tests for specific package
cd packages/core && npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

For support, email hello@askdoppler.com or visit [askdoppler.com](https://askdoppler.com).
