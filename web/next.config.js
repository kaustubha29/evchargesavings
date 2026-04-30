/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  async redirects() {
    return [
      { source: "/ev-cost", destination: "/", permanent: false },
    ];
  },
};

module.exports = nextConfig;