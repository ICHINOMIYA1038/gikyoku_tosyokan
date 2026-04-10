/**
 * generate-og-image.ts
 *
 * ブログ記事のOGP/サムネイル画像を satori + resvg で生成し、S3にアップロードする。
 *
 * 使い方:
 *   set -a && source .env.local && set +a
 *
 *   # 特定の記事
 *   npx tsx scripts/generate-og-image.ts --slug 2026-03-22-daily-tokyo-performances
 *
 *   # 今日の記事すべて
 *   npx tsx scripts/generate-og-image.ts --today
 *
 *   # OGP画像がないブログ記事すべて
 *   npx tsx scripts/generate-og-image.ts --missing
 *
 *   # プレビューのみ（S3アップロードしない）
 *   npx tsx scripts/generate-og-image.ts --slug xxx --dry-run
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();

// ── 設定 ─────────────────────────────────
const FONT_DIR = join(__dirname, '..', 'assets', 'fonts');
const LOGO_PATH = join(__dirname, '..', 'public', 'logo.png');
const WIDTH = 1200;
const HEIGHT = 630;

// S3設定
const S3_BUCKET = process.env.AWS_S3_BUCKET || '';
const S3_REGION = process.env.AWS_REGION || 'ap-northeast-1';
const S3_PREFIX = 'og-images/blog/';
const CDN_BASE = process.env.CDN_BASE_URL || `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;

// ── カラーテーマ ──────────────────────────
// 記事タイプに応じてテーマを切り替え
interface Theme {
  bg1: string;
  bg2: string;
  accent: string;
  tagBg: string;
  label: string;
}

const THEMES: Record<string, Theme> = {
  performance: {
    bg1: '#1a1a2e',
    bg2: '#16213e',
    accent: '#e94560',
    tagBg: '#2d5f8a',
    label: '🎭',
  },
  'theater-news': {
    bg1: '#0f0f23',
    bg2: '#1a1a3e',
    accent: '#7c3aed',
    tagBg: '#4c1d95',
    label: '📰',
  },
  guide: {
    bg1: '#1a0f2e',
    bg2: '#2d1b4e',
    accent: '#f59e0b',
    tagBg: '#92400e',
    label: '📖',
  },
  'guide-en': {
    bg1: '#0f1a2e',
    bg2: '#1b2d4e',
    accent: '#06b6d4',
    tagBg: '#155e75',
    label: '🌏',
  },
  profile: {
    bg1: '#1a1a1a',
    bg2: '#2d2d2d',
    accent: '#10b981',
    tagBg: '#065f46',
    label: '👤',
  },
  default: {
    bg1: '#1a1a2e',
    bg2: '#16213e',
    accent: '#e94560',
    tagBg: '#2d5f8a',
    label: '🎭',
  },
};

function detectTheme(slug: string, language: string): Theme {
  if (slug.includes('daily-tokyo-performances')) return THEMES.performance;
  if (slug.includes('profile')) return THEMES.profile;
  if (language === 'en') return THEMES['guide-en'];
  if (slug.startsWith('guide-')) return THEMES.guide;
  return THEMES.default;
}

// ── 画像生成 ──────────────────────────────
function buildOgElement(
  title: string,
  date: string,
  tags: string[],
  theme: Theme,
  logoB64: string,
) {
  // タイトルのフォントサイズを動的に調整
  const titleLen = title.length;
  let fontSize = 52;
  if (titleLen > 50) fontSize = 32;
  else if (titleLen > 40) fontSize = 36;
  else if (titleLen > 30) fontSize = 42;

  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${theme.bg1} 0%, ${theme.bg2} 50%, ${theme.bg1} 100%)`,
        padding: '56px 64px',
        fontFamily: 'NotoSansJP',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // 背景デコレーション - アクセントライン
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}66, transparent)`,
            },
          },
        },
        // 背景デコレーション - 大きなラベル
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              right: '40px',
              bottom: '20px',
              fontSize: '200px',
              opacity: 0.06,
              lineHeight: 1,
            },
            children: theme.label,
          },
        },
        // ヘッダー: ロゴ + サイト名
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '32px',
            },
            children: [
              {
                type: 'img',
                props: {
                  src: logoB64,
                  width: 44,
                  height: 44,
                  style: { borderRadius: '8px', marginRight: '14px' },
                },
              },
              {
                type: 'span',
                props: {
                  style: {
                    color: '#c0c0c0',
                    fontSize: '22px',
                    fontWeight: 400,
                  },
                  children: '戯曲図書館ブログ',
                },
              },
            ],
          },
        },
        // タイトル
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: 1,
              alignItems: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          width: '48px',
                          height: '4px',
                          background: theme.accent,
                          borderRadius: '2px',
                          marginBottom: '20px',
                        },
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          color: '#ffffff',
                          fontSize: `${fontSize}px`,
                          fontWeight: 700,
                          lineHeight: 1.35,
                          maxWidth: '100%',
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        // フッター: 日付 + タグ
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: { color: '#909090', fontSize: '18px' },
                  children: date || '',
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: '8px' },
                  children: (tags || []).slice(0, 3).map((tag: string) => ({
                    type: 'span',
                    props: {
                      style: {
                        backgroundColor: theme.tagBg,
                        color: '#ffffff',
                        padding: '5px 14px',
                        borderRadius: '16px',
                        fontSize: '15px',
                        fontWeight: 400,
                      },
                      children: tag,
                    },
                  })),
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generatePng(
  title: string,
  date: string,
  tags: string[],
  theme: Theme,
  logoB64: string,
): Promise<Buffer> {
  const fontBold = readFileSync(join(FONT_DIR, 'NotoSansJP-Bold.ttf'));
  const fontRegular = readFileSync(join(FONT_DIR, 'NotoSansJP-Regular.ttf'));

  const element = buildOgElement(title, date, tags, theme, logoB64);

  const svg = await satori(element as any, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'NotoSansJP', data: fontBold, weight: 700, style: 'normal' as const },
      { name: 'NotoSansJP', data: fontRegular, weight: 400, style: 'normal' as const },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return Buffer.from(resvg.render().asPng());
}

// ── S3アップロード ────────────────────────
async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
  const s3 = new S3Client({ region: S3_REGION });
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  return `${CDN_BASE}/${key}`;
}

// ── メイン ────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const today = args.includes('--today');
  const missing = args.includes('--missing');
  const slugIdx = args.indexOf('--slug');
  const targetSlug = slugIdx !== -1 ? args[slugIdx + 1] : null;

  // ロゴを base64 で読み込み
  const logoB64 = `data:image/png;base64,${readFileSync(LOGO_PATH).toString('base64')}`;

  // 対象記事を取得
  let posts: { slug: string; title: string; publishedAt: Date | null; tags: string[]; language: string; ogImageUrl: string | null }[];

  if (targetSlug) {
    posts = await prisma.blogPost.findMany({
      where: { slug: targetSlug },
      select: { slug: true, title: true, publishedAt: true, tags: true, language: true, ogImageUrl: true },
    });
    if (posts.length === 0) {
      console.error(`記事が見つかりません: ${targetSlug}`);
      process.exit(1);
    }
  } else if (today) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    posts = await prisma.blogPost.findMany({
      where: { publishedAt: { gte: todayStart } },
      select: { slug: true, title: true, publishedAt: true, tags: true, language: true, ogImageUrl: true },
    });
  } else if (missing) {
    posts = await prisma.blogPost.findMany({
      where: { ogImageUrl: null },
      select: { slug: true, title: true, publishedAt: true, tags: true, language: true, ogImageUrl: true },
    });
  } else {
    console.error('使い方: --slug <slug> | --today | --missing [--dry-run]');
    process.exit(1);
  }

  console.log(`対象記事: ${posts.length}件`);

  let generated = 0;
  let errors = 0;

  for (const post of posts) {
    const theme = detectTheme(post.slug, post.language);
    const date = post.publishedAt
      ? post.publishedAt.toISOString().split('T')[0]
      : '';

    console.log(`\n[${generated + 1}/${posts.length}] ${post.slug}`);
    console.log(`  タイトル: ${post.title}`);
    console.log(`  テーマ: ${theme.label}`);

    try {
      const png = await generatePng(post.title, date, post.tags, theme, logoB64);
      console.log(`  生成: ${(png.length / 1024).toFixed(1)} KB`);

      if (dryRun) {
        // ローカルにプレビュー保存
        const previewPath = join(__dirname, '..', `tmp_og_${post.slug}.png`);
        writeFileSync(previewPath, png);
        console.log(`  プレビュー: ${previewPath}`);
      } else {
        const s3Key = `${S3_PREFIX}${post.slug}.png`;
        const url = await uploadToS3(png, s3Key);
        console.log(`  アップロード: ${url}`);

        // DB更新
        await prisma.blogPost.update({
          where: { slug: post.slug },
          data: { ogImageUrl: url },
        });
        console.log(`  DB更新: ogImageUrl 設定完了`);
      }

      generated++;
    } catch (err: any) {
      console.error(`  エラー: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n=== 完了 ===`);
  console.log(`生成: ${generated}件 / エラー: ${errors}件`);
}

main()
  .catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
