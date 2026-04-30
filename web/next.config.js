/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  async redirects() {
    return [
      { source: "/ev-cost", destination: "/", permanent: false },
    ];
  },
};

module.exports = nextConfig;