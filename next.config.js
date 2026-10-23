// 静的ページをビルドする環境のタイムゾーンを、ISR で再生成する Workers（UTC）にそろえる。
// 手元（日本時間）でビルドすると、静的ページと再生成されたページで日付が 1 日ずれる
process.env.TZ = "UTC";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // ビルド時にクライアントへ埋め込む公開値。どこでビルド・デプロイしても同じ結果になるよう既定値を持たせる
  // （未設定だと機能フラグが false になり、劇団員募集・メッセージが「準備中」になる）
  env: {
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID || "G-3187PW4BZL",
    NEXT_PUBLIC_FEATURE_RECRUIT: process.env.NEXT_PUBLIC_FEATURE_RECRUIT || "true",
    NEXT_PUBLIC_FEATURE_MESSAGES: process.env.NEXT_PUBLIC_FEATURE_MESSAGES || "true",
  },
  outputFileTracingRoot: __dirname,
  // Cloudflare Workers（OpenNext）向け。workerd 用の export 条件を持つパッケージは、
  // 丸ごと含めないと workerd 向けのファイルが追跡されない
  serverExternalPackages: ["@prisma/client", ".prisma/client", "stripe", "jose", "@panva/hkdf"],
  webpack: (config) => {
    // CSV を文字列として import する（Workers には fs が無いため、ビルド時に取り込む）
    config.module.rules.push({ test: /\.csv$/, type: "asset/source" });
    return config;
  },
  images: {
    domains: [
      "www.hanmoto.com",
      "playwright.s3.ap-northeast-1.amazonaws.com",
      "gikyokutosyokan-public.s3.ap-northeast-1.amazonaws.com",
      "shukou.org",
      "www.geigeki.jp",
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30日
  },
  experimental: {
    optimizeCss: true,
  },
  
  // Vercelのタイムアウト対策
  staticPageGenerationTimeout: 120, // 静的生成のタイムアウトを120秒に延長
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
      // ブログ旧URL → 新サブディレクトリへリダイレクト
      {
        source: '/blog/:slug(kishida-.*)',
        destination: '/blog/en/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug(guide-.*)',
        destination: '/blog/en/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug((?!ja|en|index)\\w.*)',
        destination: '/blog/ja/:slug',
        permanent: true,
      },
      // 劇団データベース統合リダイレクト
      {
        source: '/university-theater',
        destination: '/theater-groups',
        permanent: true,
      },
      {
        source: '/shogekijo',
        destination: '/theater-groups',
        permanent: true,
      },
      {
        source: '/shogekijo/:slug',
        destination: '/theater-groups/:slug',
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
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
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
