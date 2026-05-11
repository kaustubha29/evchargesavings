/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  async redirects() {
    return [
      { source: "/ev-cost", destination: "/", permanent: true },
      { source: "/guides/walmart-ev-charging-network-2026", destination: "/news/walmart-ev-charging-network-2026", permanent: true },
    ];
  },
};

module.exports = nextConfig;