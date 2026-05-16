/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/ev-cost", destination: "/", permanent: true },
      { source: "/guides/walmart-ev-charging-network-2026", destination: "/news/walmart-ev-charging-network-2026", permanent: true },
      { source: "/news/byd-5-minute-flash-charging-2026", destination: "/news", permanent: false },
      { source: "/news/used-ev-ownership-costs-vs-gas-2026", destination: "/news", permanent: false },
    ];
  },
};

module.exports = nextConfig;