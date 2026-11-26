/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages bundles edge routes. The legacy persistence helpers use
  // Node built-ins only when running on a Node server; mark those imports as
  // optional so the edge bundle can compile cleanly.
  webpack(config, { nextRuntime }) {
    if (nextRuntime === "edge") {
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "node:fs": false,
        "node:fs/promises": false,
        "node:path": false,
        "node:crypto": false,
        fs: false,
        "fs/promises": false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  // The content directory is read from disk at build time and by the API routes.
  outputFileTracingIncludes: {
    "/**": ["./content/**"],
  },
  // Map the retired route families onto the current directory structure.
  async redirects() {
    return [
      { source: "/use-case", destination: "/use-cases", permanent: true },
      { source: "/use-case/:slug", destination: "/use-cases/:slug", permanent: true },
      // /new, /services, and the retired news paths intentionally return 410
      // from route handlers instead of redirecting dead URLs to the homepage.
    ];
  },
};

export default nextConfig;
