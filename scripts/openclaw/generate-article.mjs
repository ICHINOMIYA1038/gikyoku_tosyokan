/**
 * 記事生成スクリプト（強化版）
 *
 * 使用方法:
 *   node scripts/openclaw/generate-article.mjs                       # 週次まとめ
 *   node scripts/openclaw/generate-article.mjs --today --area=tokyo  # 今日の東京公演
 *
 * 主な機能:
 *   - CoRichから公演情報取得
 *   - あらすじ取得の多段フォールバック（【あらすじ】、公式サイトのOGP）
 *   - 戯曲図書館DBとの自動リンク（Post.title / Author.name 部分一致）
 *   - 「本日のピックアップ」自動選定（価格・千秋楽・初日から）
 *   - 価格帯別グルーピング
 *   - 千秋楽・初日バッジ
 *   - FAQセクション
 *   - Event / FAQPage 構造化データを埋め込み（HTMLコメント形式）
 *   - 前日・先週の関連記事リンク
 */

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORICH_BASE_URL = 'https://stage.corich.jp';
const SITE_URL = 'https://gikyokutosyokan.com';

const AREA_CODES = {
  tokyo: 13,
  kanagawa: 14,
  osaka: 27,
  kyoto: 26,
  aichi: 23,
};

// ----- Prismaクライアントの遅延読み込み（env未設定時はDB連携スキップ） -----
let prismaClient = null;
async function getPrisma() {
  if (prismaClient === null) {
    if (!process.env.POSTGRES_PRISMA_URL && !process.env.DATABASE_URL) {
      console.log('No database URL found. Skipping DB lookup.');
      prismaClient = false;
      return null;
    }
    try {
      const { PrismaClient } = await import('@prisma/client');
      prismaClient = new PrismaClient();
    } catch (e) {
      console.log(`Failed to init Prisma: ${e.message}. Skipping DB lookup.`);
      prismaClient = false;
      return null;
    }
  }
  return prismaClient === false ? null : prismaClient;
}

// ----- ユーティリティ -----
function parseArgs() {
  const args = process.argv.slice(2);
  const options = { today: false, area: null };
  for (const arg of args) {
    if (arg === '--today') options.today = true;
    else if (arg.startsWith('--area=')) options.area = arg.split('=')[1];
  }
  return options;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateJapanese(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return `${y}年${m}月${d}日（${weekdays[date.getDay()]}）`;
}

function parseYMD(str) {
  if (!str) return null;
  const m = str.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function parsePriceRange(str) {
  if (!str) return { min: null, max: null };
  const nums = [];
  const matches = str.matchAll(/(\d{1,2}),?(\d{3})円/g);
  for (const m of matches) {
    nums.push(Number(m[1] + m[2]));
  }
  if (nums.length === 0) return { min: null, max: null };
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

function isoDate(date) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

// ----- CoRich取得 -----
async function fetchPerformanceList(options = {}) {
  let url = `${CORICH_BASE_URL}/stage/search?`;
  const params = new URLSearchParams();

  if (options.area && AREA_CODES[options.area]) {
    params.append('pref_id', AREA_CODES[options.area]);
  }

  if (options.today) {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    params.append('stage[start_date(1i)]', y);
    params.append('stage[start_date(2i)]', m);
    params.append('stage[start_date(3i)]', d);
    params.append('stage[end_date(1i)]', y);
    params.append('stage[end_date(2i)]', m);
    params.append('stage[end_date(3i)]', d);
  }

  url += params.toString();
  console.log(`Fetching: ${url}`);

  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;

  const links = [];
  const performanceLinks = doc.querySelectorAll('a[href^="/stage/"], a[href^="/stage_main/"]');
  performanceLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.includes('/stage_list') &&
      !href.includes('/hope') &&
      !href.includes('/done') &&
      !href.includes('/now') &&
      !href.includes('/search')
    ) {
      const fullUrl = href.startsWith('http') ? href : `${CORICH_BASE_URL}${href}`;
      if (!links.includes(fullUrl)) links.push(fullUrl);
    }
  });

  console.log(`Found ${links.length} performance links`);
  return links.slice(0, 20);
}

/**
 * 取得したテキストが「あらすじ」として使える品質かを判定。
 * 低品質（広告文、運営情報、文字化け、短すぎる等）の場合は false。
 */
function isLowQualitySynopsis(text) {
  if (!text || text.length < 20) return true;

  // 文字化け検出: 置換文字(U+FFFD)や私用領域の文字が多い
  if (/\uFFFD/.test(text)) return true;
  const garbledMatch = text.match(/[\u{E000}-\u{F8FF}]/gu);
  if (garbledMatch && garbledMatch.length > 3) return true;
  // ASCII化不能な壊れ文字検出（ラテン拡張領域の意味不明な連続）
  const latinJunkMatch = text.match(/[\u00C0-\u00FF\u0100-\u017F]/g);
  if (latinJunkMatch && latinJunkMatch.length > 5) return true;

  // 低品質キーワード（サイト運営情報・宣伝文・無関係コンテンツ）
  const lowQualityPatterns = [
    /次回公演のご案内/,
    /公演のご案内/,
    /ラインナップページ/,
    /ライン[ナア]ップ$/,
    /デザイン事務所/,
    /参加者募集/,
    /限定演劇ワークショップ/,
    /宣伝美術/,
    /グラフィックデザイナー/,
    /アートディレクター/,
    /ホームページです/,
    /オフィシャル(?:サイト|ウェブサイト|ウェブ)?$/,
    /ホーム(?:ページ)?$/,
    /お問い合わせ/,
    /のご紹介$/,
    /公演情報$/,
    /スケジュール/,
    /ご案内(?:です)?$/,
    /次回公演情報/,
    /劇団員が指導/,
    // 追加: 劇場・運営サイト紹介
    /(?:作った|による)?\s*貸(?:し)?劇場/,
    /が作った劇場/,
    /愛川欽也/,
    // 追加: ツアー情報のみ
    /(?:東京|大阪|名古屋|福岡|京都|札幌)[・、].*(?:上演|公演)$/,
    // 追加: 施設・団体紹介
    /のご紹介[。.]?(?:.*(?:意欲的|豊か|多様|ライン[ナア]ップ).*)?/,
    /(?:劇場|ホール|シアター)の.*(?:公演|ラインナップ|案内|情報)/,
    // 追加: 日付＋場所のみ
    /^\d{4}年\d{1,2}月.*(?:上演|公演|開幕|劇場|ホール|ハウス|シアター|館)[\s　。、!]*$/,
    /^\d{4}年\d{1,2}月\d{1,2}日[（(]?.*[)）].*[〜～-]/,
    // 新国立劇場パターン
    /新国立劇場の(?:演劇|オペラ|バレエ)公演/,
    // 劇団・企画の発足紹介（作品紹介ではない）
    /(?:立ち上げた|結成した|発足|旗揚げ|始動した)(?:プロ[デジ]|企画|劇団|ユニット)/,
    /\d{4}年.*?(?:立ち上げた|結成した|旗揚げ|始動した)/,
    /プロデュース企画[\s　｜|。]/,
  ];
  for (const pattern of lowQualityPatterns) {
    if (pattern.test(text)) return true;
  }

  // 文面が短く、物語要素を含まない場合は低品質と判定
  const hasNarrativeMarkers =
    /(?:物語|主人公|登場人物|舞台は|舞台を|描[くきかい]|物[語りかたっ]|だった|した|ている|あった|する話|する物語)/.test(text);
  if (text.length < 50 && !hasNarrativeMarkers) return true;

  return false;
}

async function fetchOfficialSiteSynopsis(officialUrl) {
  try {
    const response = await fetch(officialUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 GikyokuTosyokanBot/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return '';

    // charsetを検出: HTTPヘッダー → HTMLのmetaタグ
    const contentType = response.headers.get('content-type') || '';
    let charset = 'utf-8';
    const headerMatch = contentType.match(/charset=([^;]+)/i);
    if (headerMatch) charset = headerMatch[1].toLowerCase().trim();

    const buffer = await response.arrayBuffer();

    // まず仮決定したcharsetでデコード試行
    let html;
    try {
      html = new TextDecoder(charset).decode(buffer);
    } catch {
      html = new TextDecoder('utf-8').decode(buffer);
    }

    // metaタグから実際のcharsetを再確認（HTTPヘッダーにない場合や誤っている場合）
    const metaCharsetMatch = html.substring(0, 2000).match(
      /<meta[^>]+charset=["']?([^"'>\s]+)/i
    );
    if (metaCharsetMatch) {
      const metaCharset = metaCharsetMatch[1].toLowerCase();
      if (metaCharset !== charset && metaCharset !== 'utf-8') {
        try {
          html = new TextDecoder(metaCharset).decode(buffer);
        } catch {
          // fallback: そのまま
        }
      }
    }

    const dom = new JSDOM(html, { url: officialUrl });
    const doc = dom.window.document;

    let synopsis = '';
    const ogDesc = doc.querySelector('meta[property="og:description"]');
    if (ogDesc?.getAttribute('content')) {
      synopsis = ogDesc.getAttribute('content').trim();
    }
    if (!synopsis) {
      const metaDesc = doc.querySelector('meta[name="description"]');
      if (metaDesc?.getAttribute('content')) {
        synopsis = metaDesc.getAttribute('content').trim();
      }
    }

    synopsis = synopsis.replace(/\s+/g, ' ').substring(0, 200);

    if (isLowQualitySynopsis(synopsis)) return '';

    return synopsis;
  } catch {
    return '';
  }
}

async function fetchPerformanceDetail(url) {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    let officialUrl = null;
    const links = doc.querySelectorAll('a[href^="http"]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (
        href &&
        !href.includes('corich.jp') &&
        !href.includes('corich.co') &&
        !href.includes('twitter.com') &&
        !href.includes('x.com') &&
        !href.includes('facebook.com') &&
        !href.includes('instagram.com') &&
        !href.includes('youtube.com') &&
        !href.includes('shibai-engine.net') &&
        !href.includes('confetti-web.com') &&
        !officialUrl
      ) {
        officialUrl = href;
      }
    });

    if (!officialUrl) {
      console.log(`  Skipping: No official URL found`);
      return null;
    }

    const bodyText = doc.body?.textContent || '';

    let title = '';
    const nameH1 = doc.querySelector('h1.name a');
    if (nameH1?.textContent?.trim()) title = nameH1.textContent.trim();
    if (!title) {
      const nameH1Direct = doc.querySelector('h1.name');
      if (nameH1Direct?.textContent?.trim()) title = nameH1Direct.textContent.trim();
    }
    if (!title) {
      const pageTitle = doc.querySelector('title');
      if (pageTitle) {
        const titleText = pageTitle.textContent || '';
        const m = titleText.match(/^(.+?)\s*[|｜]/);
        if (m && !m[1].includes('CoRich')) title = m[1].trim();
      }
    }

    let company = '';
    const troupeLink = doc.querySelector('a[href*="/troupe/"]');
    if (troupeLink) company = troupeLink.textContent?.trim() || '';

    let venue = '';
    const theaterLink = doc.querySelector('a[href*="/theater/"]');
    if (theaterLink) venue = theaterLink.textContent?.trim() || '';

    const dateMatch = bodyText.match(
      /(\d{4}\/\d{2}\/\d{2})\s*[（(]?\s*[日月火水木金土]\s*[）)]?\s*[～〜～-]\s*(\d{4}\/\d{2}\/\d{2})/
    );
    const dateRange = dateMatch ? `${dateMatch[1]} 〜 ${dateMatch[2]}` : '';
    const startDate = dateMatch ? parseYMD(dateMatch[1]) : null;
    const endDate = dateMatch ? parseYMD(dateMatch[2]) : null;

    const priceMatch = bodyText.match(
      /(\d{1,2},?\d{3}円\s*[～〜～-]\s*\d{1,2},?\d{3}円|\d{1,2},?\d{3}円)/
    );
    const price = priceMatch ? priceMatch[0] : '';
    const priceRange = parsePriceRange(price);

    // あらすじ取得（多段フォールバック）
    let synopsis = '';
    const descMatch = bodyText.match(/【あらすじ】([^【]*)/);
    if (descMatch) {
      synopsis = descMatch[1].trim().replace(/\s+/g, ' ').substring(0, 200);
    }
    if (!synopsis) {
      const storyMatch = bodyText.match(/(?:ストーリー|あらすじ|STORY)\s*[:：]?\s*([^。]{20,200}。)/);
      if (storyMatch) synopsis = storyMatch[1].trim();
    }
    if (synopsis && isLowQualitySynopsis(synopsis)) {
      synopsis = '';
    }
    if (!synopsis) {
      synopsis = await fetchOfficialSiteSynopsis(officialUrl);
      if (synopsis) console.log(`  Synopsis from official site`);
    }

    console.log(`  Found: ${title} (${company})`);

    return {
      title,
      company,
      venue,
      price,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      dateRange,
      startDate,
      endDate,
      officialUrl,
      synopsis,
    };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function fetchAllPerformances(options = {}) {
  const urls = await fetchPerformanceList(options);
  const performances = [];
  for (const url of urls) {
    const performance = await fetchPerformanceDetail(url);
    if (performance && performance.title) performances.push(performance);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return performances;
}

// ----- 戯曲図書館DBとのマッチング -----
/**
 * タイトル正規化ユーティリティ
 * 例:
 *   "楽屋　～流れ去るものはやがて懐かしき～" → core="楽屋"
 *   "ミュージカル『ブラッド・ブラザーズ』" → core="ミュージカル"（誤検出防止に除外）
 */
function normalizeTitle(s) {
  return s
    .replace(/[\s　「」『』（）()[\]【】]/g, '')
    .replace(/[〜～\-−ー]/g, '')
    .trim();
}

// 誤マッチを避けるための一般的プレフィックス
const GENERIC_TITLE_PREFIXES = new Set([
  'ミュージカル', '劇団', '公演', '企画', 'リーディング', '朗読', 'プロジェクト',
  '第1回', '第2回', '第3回', '本公演', '次回公演', '特別公演',
]);

function extractCoreTitle(rawTitle) {
  // 先頭部分を記号・空白で分割し、最初のトークンを取得
  // 「 」「　」「〜」「～」「-」「:」「：」「『」「「」「（」「(」等で分割
  const match = rawTitle.match(/^([^\s　「」『』【】（）()〜～\-:：]+)/);
  return match ? match[1] : rawTitle;
}

async function enrichWithDatabase(performances) {
  const prisma = await getPrisma();
  if (!prisma) return performances;

  // DB側の全作品を一括取得
  let candidates = [];
  try {
    candidates = await prisma.post.findMany({
      where: { title: { not: '' } },
      select: { id: true, title: true, author: { select: { id: true, name: true } } },
    });
  } catch (e) {
    console.log(`  DB candidates fetch error: ${e.message}`);
    return performances;
  }

  // 候補に対して正規化済みタイトルを前計算
  const candidatesWithNormalized = candidates
    .filter((c) => c.title && c.title.length >= 2)
    .map((c) => ({
      ...c,
      normalized: normalizeTitle(c.title),
      core: extractCoreTitle(c.title),
    }))
    // 一般的すぎるコアタイトル(ミュージカル, 劇団 等)は誤検出防止で除外
    .filter((c) => !GENERIC_TITLE_PREFIXES.has(c.core));

  for (const perf of performances) {
    const perfNormalized = normalizeTitle(perf.title);
    const perfCore = extractCoreTitle(perf.title);

    // マッチング戦略:
    // 1. 正規化タイトル同士で完全一致または片方向inclusion
    // 2. コアタイトル（主題部分）が一致（最低2文字、一般接頭辞は除外済み）
    const matches = candidatesWithNormalized.filter((c) => {
      if (c.normalized.length < 3) return false;
      if (c.normalized === perfNormalized) return true;
      if (perfNormalized.includes(c.normalized)) return true;
      if (c.normalized.includes(perfNormalized)) return true;
      if (c.core.length >= 2 && perfCore.length >= 2 && c.core === perfCore) return true;
      return false;
    });

    // 最も長い（情報量の多い）マッチを選ぶ
    if (matches.length > 0) {
      matches.sort((a, b) => b.normalized.length - a.normalized.length);
      const matchedPost = matches[0];
      perf.dbPost = {
        id: matchedPost.id,
        title: matchedPost.title,
        authorName: matchedPost.author?.name,
        authorId: matchedPost.author?.id,
      };
      console.log(`  DB match: "${perf.title}" → Post "${matchedPost.title}"`);
    }
  }
  return performances;
}

// ----- 公演分析ユーティリティ -----
function computeBadges(perf, today) {
  const badges = [];
  if (perf.startDate && daysBetween(perf.startDate, today) === 0) {
    badges.push('初日');
  }
  if (perf.endDate && daysBetween(today, perf.endDate) === 0) {
    badges.push('千秋楽');
  }
  if (perf.startDate && perf.endDate) {
    const runDays = daysBetween(perf.startDate, perf.endDate);
    if (runDays >= 30) badges.push('ロングラン');
  }
  return badges;
}

function selectPickups(performances, today, max = 3) {
  // スコアリング: 千秋楽=+10, 初日=+8, 価格帯低い=+3, DB連携あり=+5
  const scored = performances.map((perf) => {
    let score = 0;
    const badges = computeBadges(perf, today);
    if (badges.includes('千秋楽')) score += 10;
    if (badges.includes('初日')) score += 8;
    if (perf.priceMin && perf.priceMin <= 3000) score += 3;
    if (perf.dbPost) score += 5;
    if (perf.synopsis) score += 2;
    return { perf, score, badges };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, max);
}

function groupByPriceRange(performances) {
  const groups = {
    under3000: { label: '3,000円以下でお手軽観劇', items: [] },
    mid: { label: '3,000〜8,000円の定番プライス', items: [] },
    premium: { label: '8,000円以上の本格派', items: [] },
    unknown: { label: '料金情報は公式サイトをチェック', items: [] },
  };
  for (const perf of performances) {
    if (!perf.priceMin) {
      groups.unknown.items.push(perf);
    } else if (perf.priceMin < 3000) {
      groups.under3000.items.push(perf);
    } else if (perf.priceMin < 8000) {
      groups.mid.items.push(perf);
    } else {
      groups.premium.items.push(perf);
    }
  }
  return groups;
}

// ----- Markdown生成 -----
function renderPerformanceCard(perf, count, badges) {
  let md = `#### ${count}. ${perf.title}`;
  if (badges.length > 0) {
    md += ' ' + badges.map((b) => `**\`${b}\`**`).join(' ');
  }
  md += '\n\n';

  const hasDetails = perf.company && perf.venue;
  if (hasDetails) {
    md += `| 項目 | 詳細 |
|---|---|
| **劇団** | ${perf.company} |
| **日程** | ${perf.dateRange || '公式サイトをご確認ください'} |
| **会場** | ${perf.venue} |
| **料金** | ${perf.price || '公式サイトをご確認ください'} |

`;
  } else {
    md += `- **劇団**: ${perf.company || '公式サイトをご確認ください'}
- **日程**: ${perf.dateRange || '公式サイトをご確認ください'}
- **会場**: ${perf.venue || '公式サイトをご確認ください'}
- **料金**: ${perf.price || '公式サイトをご確認ください'}

`;
  }

  if (perf.synopsis) {
    md += `> ${perf.synopsis}\n\n`;
  }

  md += `[公式サイトで詳細を見る](${perf.officialUrl})\n`;

  if (perf.dbPost) {
    md += `\n📖 **戯曲図書館にこの作品の情報があります**: [${perf.dbPost.title}`;
    if (perf.dbPost.authorName) md += `（${perf.dbPost.authorName}）`;
    md += `の詳細を見る](/posts/${perf.dbPost.id})\n`;
  }

  md += '\n---\n\n';
  return md;
}

function buildStructuredData(performances, today) {
  const events = performances
    .filter((p) => p.startDate)
    .map((p) => {
      const ev = {
        name: p.title,
        startDate: isoDate(p.startDate),
      };
      if (p.endDate) ev.endDate = isoDate(p.endDate);
      if (p.venue) ev.location = { name: p.venue };
      if (p.officialUrl) ev.url = p.officialUrl;
      if (p.priceMin !== null || p.priceMax !== null) {
        ev.offers = {
          priceMin: p.priceMin,
          priceMax: p.priceMax,
          priceCurrency: 'JPY',
        };
      }
      if (p.company) ev.performer = { name: p.company };
      if (p.synopsis) ev.description = p.synopsis;
      return ev;
    });

  const faq = [
    {
      question: '紹介されている公演の当日券は購入できますか？',
      answer:
        '当日券の有無は公演によって異なります。各公演の公式サイトや劇場窓口、劇団SNSで最新情報をご確認ください。',
    },
    {
      question: '観劇の予算はどれくらい見ておけばよいですか？',
      answer:
        '小劇場は1,500〜4,000円、中劇場は4,000〜8,000円、大劇場や話題作は8,000〜13,000円が目安です。本記事では価格帯別にグルーピングしています。',
    },
    {
      question: '観劇に適した服装はありますか？',
      answer:
        '基本的には自由ですが、大劇場やミュージカル等では少しきれいめの服装が好まれる傾向にあります。小劇場は普段着で問題ありません。',
    },
    {
      question: '戯曲図書館ではどんな情報が得られますか？',
      answer:
        '戯曲図書館では、公演されている作品の戯曲データベース検索、劇作家のプロフィール、上演時間や人数からの脚本検索などができます。',
    },
  ];

  return { events, faq };
}

function renderPickupSection(pickups) {
  if (pickups.length === 0) return '';
  let md = '## 編集部イチオシ：本日のピックアップ\n\n';
  md += '数ある公演の中から、編集部が特に注目している作品をピックアップしました。\n\n';
  pickups.forEach((p, i) => {
    md += `### ${i + 1}. ${p.perf.title}`;
    if (p.badges.length > 0) {
      md += ' ' + p.badges.map((b) => `\`${b}\``).join(' ');
    }
    md += '\n\n';
    if (p.perf.company && p.perf.venue) {
      md += `**${p.perf.company}** による、${p.perf.venue}での公演です。`;
    } else if (p.perf.company) {
      md += `**${p.perf.company}** による公演です。`;
    } else if (p.perf.venue) {
      md += `${p.perf.venue}での公演です。`;
    }
    if (p.badges.includes('千秋楽')) {
      md += '**本日が千秋楽**なので、観るなら今日がラストチャンス！';
    } else if (p.badges.includes('初日')) {
      md += '**本日が初日**です。誰よりも早く作品を体験できます。';
    }
    if (p.perf.priceMin && p.perf.priceMin <= 3000) {
      md += ` お手頃な${p.perf.priceMin.toLocaleString()}円〜で観られるのも魅力。`;
    }
    md += `\n\n[→ 詳細を見る](${p.perf.officialUrl})\n\n`;
  });
  md += '---\n\n';
  return md;
}

function renderFaqSection(faq) {
  let md = '## よくある質問（FAQ）\n\n';
  for (const item of faq) {
    md += `### ${item.question}\n\n${item.answer}\n\n`;
  }
  return md;
}

function renderNavSection(today, mode) {
  // 前日・先週同曜日の記事リンク
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const suffix = mode === 'daily-tokyo' ? 'daily-tokyo-performances' : 'weekly-performances';
  let md = '## 過去の記事\n\n';
  md += `- [昨日（${formatDateJapanese(yesterday)}）の記事を見る](/blog/ja/${formatDate(yesterday)}-${suffix})\n`;
  md += `- [先週の同じ曜日（${formatDateJapanese(lastWeek)}）の記事を見る](/blog/ja/${formatDate(lastWeek)}-${suffix})\n\n`;
  return md;
}

function renderMetadataComment(structured) {
  return `<!-- structured-data\n${JSON.stringify(structured)}\n-->\n\n`;
}

function renderRelatedBlogLinks() {
  return `### あわせて読みたい

- [演劇・劇の台本を無料で探せるサイトまとめ](/blog/ja/2026-02-15-free-script-sites)
- [脚本・台本の書き方入門ガイド【初心者向け】](/blog/ja/2026-02-15-how-to-write-script)
- [読んで面白い！初心者におすすめの戯曲・脚本10選](/blog/ja/2026-02-15-recommended-plays-for-beginners)
`;
}

// ----- 記事生成（日次東京版） -----
function generateDailyTokyoArticle(performances) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);
  const todayJapanese = formatDateJapanese(today);

  const validPerformances = performances.filter((p) => p.officialUrl);
  const perfCount = validPerformances.length;

  const pickups = selectPickups(validPerformances, today, 3);
  const groups = groupByPriceRange(validPerformances);
  const structured = buildStructuredData(validPerformances, today);

  let introText = '';
  if (perfCount === 0) introText = '本日、東京で上演される公演情報は見つかりませんでした。';
  else if (perfCount <= 3) introText = `本日は${perfCount}件の公演をご紹介します。少数精鋭の注目作品をチェックしてみてください。`;
  else if (perfCount <= 7) introText = `本日は${perfCount}件の公演が上演されます。気になる作品を見つけて、劇場へ足を運んでみませんか？`;
  else introText = `本日は${perfCount}件もの公演が上演されます！東京の演劇シーンは今日も盛り上がっています。`;

  let article = `---
title: "本日の東京公演情報【${todayJapanese}】"
date: "${todayStr}"
description: "${todayJapanese}に東京で上演される演劇・舞台公演${perfCount}選。料金・会場・千秋楽情報まで完全まとめ"
tags: ["公演情報", "演劇", "舞台", "東京", "観劇", "${todayJapanese.replace(/（.*/, '')}"]
---

`;

  article += renderMetadataComment(structured);

  article += `${todayJapanese}に東京で上演される演劇・舞台公演をまとめました。${introText}

戯曲図書館編集部が**価格帯別・ピックアップ形式**で見やすく整理し、作品の原作戯曲がデータベースにある場合は脚本情報へのリンクも掲載しています。

`;

  if (perfCount === 0) {
    article += `最新の公演情報は[戯曲図書館トップページ](/)からもご確認いただけます。\n\n`;
  } else {
    article += renderPickupSection(pickups);

    article += '## 価格帯別 公演リスト\n\n';
    let globalCount = 0;
    for (const groupKey of ['under3000', 'mid', 'premium', 'unknown']) {
      const group = groups[groupKey];
      if (group.items.length === 0) continue;
      article += `### ${group.label}（${group.items.length}件）\n\n`;
      for (const perf of group.items) {
        globalCount++;
        const badges = computeBadges(perf, today);
        article += renderPerformanceCard(perf, globalCount, badges);
      }
    }

    article += renderFaqSection(structured.faq);
  }

  article += renderNavSection(today, 'daily-tokyo');
  article += '## 観劇のお供に\n\n';
  article += '東京の劇場で素敵な時間をお過ごしください。当日券の有無は各公式サイトでご確認ください。\n\n';
  article += renderRelatedBlogLinks();

  return article;
}

// ----- 記事生成（週次版） -----
function generateWeeklyArticle(performances, weekInfo) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);
  const validPerformances = performances.filter((p) => p.officialUrl);
  const perfCount = validPerformances.length;

  const pickups = selectPickups(validPerformances, today, 3);
  const groups = groupByPriceRange(validPerformances);
  const structured = buildStructuredData(validPerformances, today);

  let article = `---
title: "今週の注目公演情報【${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週】"
date: "${todayStr}"
description: "${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週の注目演劇公演${perfCount}選。日程・会場・料金・編集部ピックアップまとめ"
tags: ["公演情報", "演劇", "舞台", "週間まとめ", "観劇"]
---

`;

  article += renderMetadataComment(structured);

  article += `${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週に上演される注目の演劇・舞台公演をまとめました。今週は${perfCount}件の公演をご紹介します。

戯曲図書館編集部が**価格帯別・ピックアップ形式**で見やすく整理し、作品の原作戯曲がデータベースにある場合は脚本情報へのリンクも掲載しています。

`;

  article += renderPickupSection(pickups);

  article += '## 価格帯別 公演リスト\n\n';
  let globalCount = 0;
  for (const groupKey of ['under3000', 'mid', 'premium', 'unknown']) {
    const group = groups[groupKey];
    if (group.items.length === 0) continue;
    article += `### ${group.label}（${group.items.length}件）\n\n`;
    for (const perf of group.items) {
      globalCount++;
      const badges = computeBadges(perf, today);
      article += renderPerformanceCard(perf, globalCount, badges);
    }
  }

  article += renderFaqSection(structured.faq);
  article += renderNavSection(today, 'weekly');
  article += '## 今週の観劇のヒント\n\n';
  article += '気になる作品があれば、ぜひ劇場に足を運んでみてください。当日券の有無は各公式サイトでご確認ください。\n\n';
  article += renderRelatedBlogLinks();

  return article;
}

function getWeekInfo() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    week: Math.ceil(now.getDate() / 7),
  };
}

// ----- メイン -----
async function main() {
  const options = parseArgs();
  console.log('Options:', options);

  console.log('Fetching performances from CoRich...');
  let performances = await fetchAllPerformances(options);
  console.log(`Found ${performances.length} performances with official URLs`);

  // DB連携で原作戯曲情報を付与
  performances = await enrichWithDatabase(performances);

  if (options.today && options.area === 'tokyo') {
    console.log('Generating daily Tokyo article...');
    const article = generateDailyTokyoArticle(performances);
    const today = formatDate(new Date());
    const outputPath = path.join(
      __dirname, '..', '..', 'blog', 'posts',
      `${today}-daily-tokyo-performances.md`
    );
    fs.writeFileSync(outputPath, article, 'utf-8');
    console.log(`\nArticle saved to: ${outputPath}`);
    console.log(`Performances count: ${performances.length}`);
  } else {
    if (performances.length === 0) {
      console.log('No performances found. Using sample data...');
      performances = [{
        title: 'サンプル公演',
        company: 'サンプル劇団',
        dateRange: '2026年2月10日〜15日',
        venue: 'サンプル劇場',
        price: '一般 4,000円',
        priceMin: 4000,
        priceMax: 4000,
        startDate: new Date(),
        endDate: new Date(),
        officialUrl: 'https://example.com/sample',
        synopsis: 'これはサンプルの公演情報です。',
      }];
    }
    const weekInfo = getWeekInfo();
    console.log(`Generating article for ${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週...`);
    const article = generateWeeklyArticle(performances, weekInfo);
    const today = formatDate(new Date());
    const outputPath = path.join(
      __dirname, '..', '..', 'blog', 'posts',
      `${today}-weekly-performances.md`
    );
    fs.writeFileSync(outputPath, article, 'utf-8');
    console.log(`\nArticle saved to: ${outputPath}`);
    console.log(`Performances count: ${performances.length}`);
  }

  // Prisma切断
  const prisma = await getPrisma();
  if (prisma) await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
