/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/test1',
        destination: '/test1a',
        permanent: true,
      },
      {
        source: '/test2',
        destination: '/test2a',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
