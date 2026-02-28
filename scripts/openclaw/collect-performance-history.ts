/**
 * 劇団公式サイトからテキストを取得し、DB内の作品タイトルとマッチングするスクリプト
 * OpenClawのcronから定期実行されることを想定
 *
 * 使用方法:
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/openclaw/collect-performance-history.ts [--limit N] [--apply]
 *
 * オプション:
 *   --limit N   対象劇団数を制限（テスト用）
 *   --apply     high confidence のマッチを直接DBに投入（upsertで重複安全）
 *
 * 法的配慮:
 *   - robots.txt を確認し、Disallow対象はスキップ
 *   - User-Agent にボット名と連絡先URLを明記
 *   - 3秒以上のディレイでサイトに負荷をかけない
 *   - ページ全文は保存せず、マッチ周辺の短い文脈のみ記録
 *   - 日本著作権法30条の4（情報解析）の範囲内で利用
 */

import { PrismaClient } from '@prisma/client';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const USER_AGENT = 'GikyokuTosyokan-Bot/1.0 (+https://gikyokutosyokan.com)';
const FETCH_TIMEOUT_MS = 10_000;
const DELAY_MS = 3_000;
const MIN_TITLE_LENGTH = 4; // 4文字未満のタイトルは誤検出が多いのでスキップ

// 一般的すぎて誤検出の原因になるタイトルを除外
const EXCLUDED_TITLES = new Set([
  'ホーム', 'トップ', 'メニュー', 'ニュース', 'お知らせ',
  'アクセス', 'リンク', 'ブログ', 'プロフィール', 'コンタクト',
  'ルーツ', 'ドア', 'ゲーム', 'メモ', 'ノート',
]);

interface PerformanceMatch {
  postId: number;
  postTitle: string;
  theaterGroupId: number;
  theaterGroupName: string;
  sourceUrl: string;
  sourceType: 'official';
  confidence: 'high' | 'medium';
  matchedText: string;
}

// robots.txt のキャッシュ（ドメイン単位）
const robotsCache = new Map<string, string[]>();

function parseArgs(): { limit: number | null; apply: boolean } {
  const args = process.argv.slice(2);
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex !== -1 && args[limitIndex + 1]
    ? parseInt(args[limitIndex + 1], 10)
    : null;
  const apply = args.includes('--apply');
  return { limit, apply };
}

/**
 * robots.txt を取得してDisallowパスを返す
 */
async function getDisallowedPaths(origin: string): Promise<string[]> {
  if (robotsCache.has(origin)) {
    return robotsCache.get(origin)!;
  }

  try {
    const response = await fetch(`${origin}/robots.txt`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      // robots.txt がない場合は制限なし
      robotsCache.set(origin, []);
      return [];
    }

    const text = await response.text();
    const disallowed: string[] = [];
    let appliesToUs = false;

    for (const line of text.split('\n')) {
      const trimmed = line.trim().toLowerCase();
      if (trimmed.startsWith('user-agent:')) {
        const agent = trimmed.replace('user-agent:', '').trim();
        appliesToUs = agent === '*' || agent.includes('gikyoku');
      } else if (appliesToUs && trimmed.startsWith('disallow:')) {
        const path = trimmed.replace('disallow:', '').trim();
        if (path) disallowed.push(path);
      }
    }

    robotsCache.set(origin, disallowed);
    return disallowed;
  } catch {
    // robots.txt 取得失敗は制限なしとして扱う
    robotsCache.set(origin, []);
    return [];
  }
}

/**
 * URLがrobots.txtで許可されているか確認
 */
async function isAllowedByRobots(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    const disallowed = await getDisallowedPaths(parsed.origin);

    // Disallow: / は全ページ拒否
    for (const path of disallowed) {
      if (parsed.pathname.startsWith(path)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

async function fetchPageText(url: string): Promise<string | null> {
  // robots.txt チェック
  const allowed = await isAllowedByRobots(url);
  if (!allowed) {
    console.log(`  [SKIP] robots.txt で拒否: ${url}`);
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
      redirect: 'follow',
    });

    if (!response.ok) {
      console.log(`  [SKIP] HTTP ${response.status}: ${url}`);
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      console.log(`  [SKIP] Non-HTML content: ${contentType}`);
      return null;
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // script, style, nav, header, footer を削除（ナビゲーション由来の誤検出防止）
    doc.querySelectorAll('script, style, noscript, nav, header, footer').forEach((el) => el.remove());
    const text = doc.body?.textContent || '';

    // 連続空白を圧縮
    return text.replace(/\s+/g, ' ').trim();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log(`  [SKIP] Timeout: ${url}`);
    } else {
      console.log(`  [SKIP] Fetch error: ${error.message}`);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function findMatches(
  pageText: string,
  posts: { id: number; title: string }[],
  theaterGroup: { id: number; name: string; website: string },
): PerformanceMatch[] {
  const matches: PerformanceMatch[] = [];

  for (const post of posts) {
    // 短すぎるタイトルはスキップ（誤検出防止）
    if (post.title.length < MIN_TITLE_LENGTH) continue;

    // 汎用的すぎるタイトルはスキップ
    if (EXCLUDED_TITLES.has(post.title)) continue;

    const index = pageText.indexOf(post.title);
    if (index === -1) continue;

    // マッチ前後の文脈を抽出（前後40文字 — 著作権配慮で最小限に）
    const start = Math.max(0, index - 40);
    const end = Math.min(pageText.length, index + post.title.length + 40);
    const matchedText = pageText.substring(start, end);

    // 信頼度判定:
    //   - 「公演」「上演」「演目」等のキーワードが文脈に含まれる → high
    //   - タイトルが6文字以上 → high
    //   - それ以外 → medium
    const contextKeywords = ['公演', '上演', '演目', '脚本', '作・', '作：', '原作'];
    const hasContextHint = contextKeywords.some((kw) => matchedText.includes(kw));
    const confidence = (hasContextHint || post.title.length >= 6) ? 'high' : 'medium';

    matches.push({
      postId: post.id,
      postTitle: post.title,
      theaterGroupId: theaterGroup.id,
      theaterGroupName: theaterGroup.name,
      sourceUrl: theaterGroup.website,
      sourceType: 'official',
      confidence,
      matchedText,
    });
  }

  return matches;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function applyMatches(matches: PerformanceMatch[]): Promise<{ created: number; skipped: number; errors: number }> {
  const highMatches = matches.filter((m) => m.confidence === 'high');
  let created = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`\n=== DB投入 (high confidence: ${highMatches.length}件) ===`);

  for (const match of highMatches) {
    try {
      await prisma.postTheaterGroup.upsert({
        where: {
          postId_theaterGroupId: {
            postId: match.postId,
            theaterGroupId: match.theaterGroupId,
          },
        },
        update: {
          sourceUrl: match.sourceUrl,
          sourceType: match.sourceType,
        },
        create: {
          postId: match.postId,
          theaterGroupId: match.theaterGroupId,
          sourceUrl: match.sourceUrl,
          sourceType: match.sourceType,
        },
      });
      created++;
      console.log(`  [OK] "${match.postTitle}" × ${match.theaterGroupName}`);
    } catch (err: any) {
      if (err.code === 'P2002') {
        skipped++;
        console.log(`  [SKIP] 重複: "${match.postTitle}" × ${match.theaterGroupName}`);
      } else {
        errors++;
        console.error(`  [ERR] "${match.postTitle}" × ${match.theaterGroupName}: ${err.message}`);
      }
    }
  }

  return { created, skipped, errors };
}

async function main() {
  const { limit, apply } = parseArgs();

  console.log('=== 上演実績データ収集 ===');
  console.log(`開始: ${new Date().toISOString()}`);
  if (limit) console.log(`対象劇団数上限: ${limit}`);
  if (apply) console.log(`モード: --apply (high confidenceを自動DB投入)`);

  // 1. DBからwebsiteを持つTheaterGroup一覧を取得
  let theaterGroups = await prisma.theaterGroup.findMany({
    where: {
      website: { not: null },
      isActive: true,
    },
    select: { id: true, name: true, website: true },
  });

  // 既存のPostTheaterGroupの組合せを取得（既にマッチ済みのものをスキップ）
  const existingLinks = await prisma.postTheaterGroup.findMany({
    select: { postId: true, theaterGroupId: true },
  });
  const existingSet = new Set(
    existingLinks.map((l) => `${l.postId}-${l.theaterGroupId}`),
  );

  if (limit) {
    theaterGroups = theaterGroups.slice(0, limit);
  }

  console.log(`対象劇団数: ${theaterGroups.length}`);

  // 2. DBからPost一覧を取得
  const posts = await prisma.post.findMany({
    select: { id: true, title: true },
  });
  const eligiblePosts = posts.filter(
    (p) => p.title.length >= MIN_TITLE_LENGTH && !EXCLUDED_TITLES.has(p.title),
  );
  console.log(`DB内作品数: ${posts.length}（検索対象: ${eligiblePosts.length}）`);

  // 3. 各劇団websiteをクロール
  const allMatches: PerformanceMatch[] = [];
  let processed = 0;
  let fetchErrors = 0;
  let robotsBlocked = 0;

  for (const group of theaterGroups) {
    if (!group.website) continue;

    processed++;
    console.log(`\n[${processed}/${theaterGroups.length}] ${group.name}`);
    console.log(`  URL: ${group.website}`);

    const pageText = await fetchPageText(group.website);

    if (!pageText) {
      fetchErrors++;
      if (processed < theaterGroups.length) await sleep(DELAY_MS);
      continue;
    }

    console.log(`  テキスト取得: ${pageText.length}文字`);

    // 4. マッチング
    const matches = findMatches(pageText, eligiblePosts, {
      id: group.id,
      name: group.name,
      website: group.website,
    });

    // 既にDB登録済みのマッチを除外
    const newMatches = matches.filter(
      (m) => !existingSet.has(`${m.postId}-${m.theaterGroupId}`),
    );

    if (newMatches.length > 0) {
      console.log(`  新規マッチ: ${newMatches.length}件`);
      for (const m of newMatches) {
        console.log(`    - "${m.postTitle}" (confidence: ${m.confidence})`);
      }
      allMatches.push(...newMatches);
    } else if (matches.length > 0) {
      console.log(`  マッチ: ${matches.length}件（全て登録済み）`);
    } else {
      console.log(`  マッチなし`);
    }

    // ディレイ
    if (processed < theaterGroups.length) await sleep(DELAY_MS);
  }

  // 5. 結果をJSONに出力
  const today = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, `performance-matches-${today}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(allMatches, null, 2), 'utf8');

  // --apply: high confidence マッチをDBに投入
  let applyResult = { created: 0, skipped: 0, errors: 0 };
  if (apply && allMatches.length > 0) {
    applyResult = await applyMatches(allMatches);
  }

  // サマリー
  const highCount = allMatches.filter((m) => m.confidence === 'high').length;
  const mediumCount = allMatches.filter((m) => m.confidence === 'medium').length;
  console.log('\n=== サマリー ===');
  console.log(`処理劇団数: ${processed}`);
  console.log(`取得エラー: ${fetchErrors}`);
  console.log(`robots.txt拒否: ${robotsBlocked}`);
  console.log(`新規マッチ総数: ${allMatches.length}`);
  console.log(`  high confidence: ${highCount}`);
  console.log(`  medium confidence: ${mediumCount}`);
  if (apply) {
    console.log(`DB投入: ${applyResult.created}件 / 重複スキップ: ${applyResult.skipped}件 / エラー: ${applyResult.errors}件`);
  }
  console.log(`出力: ${outputPath}`);
  console.log(`完了: ${new Date().toISOString()}`);
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
