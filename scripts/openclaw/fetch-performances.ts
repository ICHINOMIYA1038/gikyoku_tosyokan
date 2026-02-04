/**
 * CoRichから公演情報を取得するスクリプト
 * OpenClawから呼び出されることを想定
 *
 * 使用方法:
 *   npx ts-node scripts/openclaw/fetch-performances.ts
 */

import { JSDOM } from 'jsdom';

interface Performance {
  title: string;
  company: string;
  dateRange: string;
  venue: string;
  price: string;
  officialUrl: string | null;
  synopsis: string;
}

const CORICH_BASE_URL = 'https://stage.corich.jp';

async function fetchPerformanceList(): Promise<string[]> {
  // CoRichの公演一覧ページから公演URLリストを取得
  const response = await fetch(`${CORICH_BASE_URL}/stage`);
  const html = await response.text();
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const links: string[] = [];
  // /stage/XXXXX と /stage_main/XXXXX の両方のパターンを取得
  const performanceLinks = doc.querySelectorAll('a[href^="/stage/"], a[href^="/stage_main/"]');

  performanceLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !links.includes(href) && !href.includes('/stage_list')) {
      const fullUrl = href.startsWith('http') ? href : `${CORICH_BASE_URL}${href}`;
      if (!links.includes(fullUrl)) {
        links.push(fullUrl);
      }
    }
  });

  console.log(`Found ${links.length} performance links`);
  return links.slice(0, 10); // 最新10件を取得
}

async function fetchPerformanceDetail(url: string): Promise<Performance | null> {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // 公式サイトURLを探す - 外部リンクで corich/twitter/facebook 以外
    let officialUrl: string | null = null;
    const links = doc.querySelectorAll('a[href^="http"]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (
        href &&
        !href.includes('corich.jp') &&
        !href.includes('twitter.com') &&
        !href.includes('x.com') &&
        !href.includes('facebook.com') &&
        !href.includes('instagram.com') &&
        !href.includes('youtube.com') &&
        !officialUrl // 最初に見つかったものを使用
      ) {
        officialUrl = href;
      }
    });

    // 公式サイトがない場合はスキップ
    if (!officialUrl) {
      console.log(`  Skipping: No official URL found`);
      return null;
    }

    // ページ全体のテキストから情報を抽出
    const bodyText = doc.body?.textContent || '';
    
    // タイトル - ページタイトルから（"公演名 | CoRich..." の形式）
    let title = '';
    const pageTitle = doc.querySelector('title');
    if (pageTitle) {
      const titleText = pageTitle.textContent || '';
      // " | " で分割して最初の部分を取得
      const parts = titleText.split('|');
      if (parts.length > 1) {
        title = parts[0].trim();
      }
    }
    // タイトルが空かCoRichの汎用タイトルの場合はスキップ
    if (!title || title.includes('演劇') || title.includes('ミュージカル') || title.includes('CoRich')) {
      console.log(`  Skipping: No valid title found`);
      return null;
    }

    // 劇団名 - /troupe/ リンクから
    let company = '';
    const troupeLink = doc.querySelector('a[href*="/troupe/"]');
    if (troupeLink) {
      company = troupeLink.textContent?.trim() || '';
    }

    // 会場 - /theater/ リンクから
    let venue = '';
    const theaterLink = doc.querySelector('a[href*="/theater/"]');
    if (theaterLink) {
      venue = theaterLink.textContent?.trim() || '';
    }

    // 日程 - テキストから抽出（年/月/日パターン）
    const dateMatch = bodyText.match(/(\d{4}\/\d{2}\/\d{2})\s*[（(]?\s*[日月火水木金土]\s*[）)]?\s*[～〜～-]\s*(\d{4}\/\d{2}\/\d{2})/);
    const dateRange = dateMatch ? `${dateMatch[1]} 〜 ${dateMatch[2]}` : '';

    // 料金 - テキストから抽出
    const priceMatch = bodyText.match(/(\d{1,2},?\d{3}円\s*[～〜～-]\s*\d{1,2},?\d{3}円|\d{1,2},?\d{3}円)/);
    const price = priceMatch ? priceMatch[0] : '';

    // あらすじ - 「説明」セクションから
    let synopsis = '';
    const descMatch = bodyText.match(/【あらすじ】([^【]*)/);
    if (descMatch) {
      synopsis = descMatch[1].trim().substring(0, 200);
    }

    console.log(`  Found: ${title} (${company})`);

    return {
      title,
      company,
      dateRange,
      venue,
      price,
      officialUrl,
      synopsis,
    };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function fetchAllPerformances(): Promise<Performance[]> {
  const urls = await fetchPerformanceList();
  const performances: Performance[] = [];

  for (const url of urls) {
    const performance = await fetchPerformanceDetail(url);
    if (performance && performance.title) {
      performances.push(performance);
    }
    // レート制限を避けるため少し待機
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return performances;
}

// メイン実行
if (require.main === module) {
  fetchAllPerformances()
    .then((performances) => {
      console.log(JSON.stringify(performances, null, 2));
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export { fetchAllPerformances };
export type { Performance };
