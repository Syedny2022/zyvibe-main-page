/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
