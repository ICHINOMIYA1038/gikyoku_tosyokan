/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
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
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      // wwwありからwwwなしへリダイレクト
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.gikyokutosyokan.com',
          },
        ],
        destination: 'https://gikyokutosyokan.com/:path*',
        permanent: true,
      },
      // 古いURLから新しいURLへのリダイレクト（例）
      {
        source: '/old-posts/:id',
        destination: '/posts/:id',
        permanent: true,
      },
      // トレイリングスラッシュの統一
      {
        source: '/posts/:id/',
        destination: '/posts/:id',
        permanent: true,
      },
      {
        source: '/authors/:id/',
        destination: '/authors/:id',
        permanent: true,
      },
      {
        source: '/categories/:id/',
        destination: '/categories/:id',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // feed.xmlへのアクセスをAPIルートにリライト
      {
        source: '/feed.xml',
        destination: '/api/feed.xml',
      },
      {
        source: '/rss.xml',
        destination: '/api/feed.xml',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
