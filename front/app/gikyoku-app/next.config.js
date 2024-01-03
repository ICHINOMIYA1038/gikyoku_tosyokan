/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 5000,
      aggregateTimeout: 300,
    };
    return config;
  },
  images: {
    domains: [
      "www.hanmoto.com",
      "playwright.s3.ap-northeast-1.amazonaws.com",
      "shukou.org",
      "www.geigeki.jp",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/editor/",
        destination: process.env.PROJECT2_URL,
      },
      {
        source: "/editor/:match*",
        destination: process.env.PROJECT2_URL + ":match*",
      },
    ];
  },
};

module.exports = nextConfig;
