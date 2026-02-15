/**
 * 演劇ニュースRSS収集スクリプト
 *
 * 複数のRSSフィードから演劇ニュースを取得し、DBに蓄積する。
 * サイトには表示せず、記事執筆時のネタ帳として使用。
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/openclaw/fetch-theater-news.ts
 */

import RSSParser from 'rss-parser';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const parser = new RSSParser({
  timeout: 15000,
  headers: {
    'User-Agent': 'GikyokuTosyokan-NewsCollector/1.0 (+https://gikyokutosyokan.com)',
  },
});

// フィード間のウェイト（ミリ秒）
const FETCH_INTERVAL_MS = 3000;

// ETag/Last-Modified キャッシュファイル
const CACHE_FILE = path.join(__dirname, '../../data/rss-cache.json');

interface CacheEntry {
  etag?: string;
  lastModified?: string;
}
type CacheData = Record<string, CacheEntry>;

function loadCache(): CacheData {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function saveCache(cache: CacheData): void {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FeedConfig {
  name: string;
  url: string;
  language: string;
  category: string;
}

const FEEDS: FeedConfig[] = [
  {
    name: 'natalie',
    url: 'https://natalie.mu/stage/feed/news',
    language: 'ja',
    category: '国内演劇',
  },
  {
    name: 'guardian',
    url: 'https://www.theguardian.com/stage/rss',
    language: 'en',
    category: '海外演劇',
  },
  {
    name: 'deadline',
    url: 'https://deadline.com/tag/theater/feed/',
    language: 'en',
    category: 'ブロードウェイ',
  },
  {
    name: 'variety',
    url: 'https://variety.com/t/theater/feed/',
    language: 'en',
    category: 'エンタメ',
  },
];

async function fetchFeed(config: FeedConfig, cache: CacheData): Promise<number> {
  let newCount = 0;

  try {
    console.log(`\n--- ${config.name} (${config.url}) ---`);

    // 条件付きリクエスト（If-Modified-Since / If-None-Match）
    const cached = cache[config.url] || {};
    const headers: Record<string, string> = {};
    if (cached.etag) headers['If-None-Match'] = cached.etag;
    if (cached.lastModified) headers['If-Modified-Since'] = cached.lastModified;

    // まずHEADリクエストで更新確認
    if (cached.etag || cached.lastModified) {
      try {
        const headRes = await fetch(config.url, { method: 'HEAD', headers });
        if (headRes.status === 304) {
          console.log('  スキップ: 前回から更新なし (304)');
          return 0;
        }
        // 新しいキャッシュヘッダーを保存
        const newEtag = headRes.headers.get('etag');
        const newLastModified = headRes.headers.get('last-modified');
        if (newEtag) cache[config.url] = { ...cached, etag: newEtag };
        if (newLastModified) cache[config.url] = { ...cache[config.url], lastModified: newLastModified };
      } catch {
        // HEADリクエスト失敗時はフル取得にフォールバック
      }
    }

    const feed = await parser.parseURL(config.url);
    console.log(`  取得: ${feed.items.length}件`);

    // レスポンスヘッダーからキャッシュ情報を保存（rss-parserはヘッダーを直接返さないため、次回のHEADで取得）
    if (!cache[config.url]) cache[config.url] = {};

    for (const item of feed.items) {
      if (!item.link || !item.title) continue;

      const publishedAt = item.pubDate
        ? new Date(item.pubDate)
        : new Date();

      // summary/descriptionからHTMLタグを除去
      let summary = item.contentSnippet || item.content || item.summary || '';
      summary = summary.replace(/<[^>]*>/g, '').trim();
      if (summary.length > 500) {
        summary = summary.substring(0, 500) + '...';
      }

      try {
        await prisma.theaterNewsItem.upsert({
          where: { sourceUrl: item.link },
          create: {
            source: config.name,
            sourceUrl: item.link,
            title: item.title.trim(),
            summary: summary || null,
            language: config.language,
            category: config.category,
            publishedAt,
          },
          update: {
            // 既存の場合はtitleとsummaryだけ更新
            title: item.title.trim(),
            summary: summary || null,
          },
        });
        newCount++;
      } catch (e: any) {
        // unique constraint以外のエラーのみ表示
        if (!e.message?.includes('Unique constraint')) {
          console.error(`  エラー: ${item.title} - ${e.message}`);
        }
      }
    }

    console.log(`  保存/更新: ${newCount}件`);
  } catch (error: any) {
    console.error(`  フィード取得失敗: ${config.name} - ${error.message}`);
  }

  return newCount;
}

async function main() {
  console.log('=== 演劇ニュースRSS収集 ===');
  console.log(`実行日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`);

  const cache = loadCache();
  let totalNew = 0;

  for (let i = 0; i < FEEDS.length; i++) {
    // フィード間に3秒のウェイトを入れる（初回以外）
    if (i > 0) {
      console.log(`\n  ... ${FETCH_INTERVAL_MS / 1000}秒待機 ...`);
      await sleep(FETCH_INTERVAL_MS);
    }
    const count = await fetchFeed(FEEDS[i], cache);
    totalNew += count;
  }

  // キャッシュを保存
  saveCache(cache);

  // 統計
  const totalCount = await prisma.theaterNewsItem.count();
  const unusedCount = await prisma.theaterNewsItem.count({ where: { used: false } });
  const todayCount = await prisma.theaterNewsItem.count({
    where: {
      fetchedAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  console.log('\n=== 結果サマリー ===');
  console.log(`今回保存/更新: ${totalNew}件`);
  console.log(`本日取得: ${todayCount}件`);
  console.log(`DB総数: ${totalCount}件（未使用: ${unusedCount}件）`);

  // 直近のニュースを表示
  const recent = await prisma.theaterNewsItem.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 5,
    select: { source: true, title: true, publishedAt: true, language: true },
  });

  console.log('\n--- 直近5件 ---');
  for (const item of recent) {
    const date = item.publishedAt.toLocaleDateString('ja-JP');
    console.log(`  [${item.source}] ${item.title} (${date})`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
