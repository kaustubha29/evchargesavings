/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  experimental: {
    browsersListForSwc: true,
  },
  async redirects() {
    return [
      { source: "/ev-cost", destination: "/", permanent: true },
    ];
  },
};

module.exports = nextConfig;