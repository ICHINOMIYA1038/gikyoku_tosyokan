/**
 * 記事生成スクリプト
 * 使用方法: node scripts/openclaw/generate-article.mjs
 */

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORICH_BASE_URL = 'https://stage.corich.jp';

async function fetchPerformanceList() {
  const response = await fetch(`${CORICH_BASE_URL}/stage`);
  const html = await response.text();
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const links = [];
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
  return links.slice(0, 10);
}

async function fetchPerformanceDetail(url) {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    let officialUrl = null;
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
    // CoRichの公演タイトルは h1.name の中のaタグに入っている
    const nameH1 = doc.querySelector('h1.name a');
    if (nameH1 && nameH1.textContent?.trim()) {
      title = nameH1.textContent.trim();
    }
    // h1.name直接
    if (!title) {
      const nameH1Direct = doc.querySelector('h1.name');
      if (nameH1Direct && nameH1Direct.textContent?.trim()) {
        title = nameH1Direct.textContent.trim();
      }
    }
    // titleタグから取得（ただしサイト名は除外）
    if (!title) {
      const pageTitle = doc.querySelector('title');
      if (pageTitle) {
        const titleText = pageTitle.textContent || '';
        const match = titleText.match(/^(.+?)\s*[|｜]/);
        if (match && !match[1].includes('CoRich')) {
          title = match[1].trim();
        }
      }
    }

    let company = '';
    const troupeLink = doc.querySelector('a[href*="/troupe/"]');
    if (troupeLink) {
      company = troupeLink.textContent?.trim() || '';
    }

    let venue = '';
    const theaterLink = doc.querySelector('a[href*="/theater/"]');
    if (theaterLink) {
      venue = theaterLink.textContent?.trim() || '';
    }

    const dateMatch = bodyText.match(/(\d{4}\/\d{2}\/\d{2})\s*[（(]?\s*[日月火水木金土]\s*[）)]?\s*[～〜～-]\s*(\d{4}\/\d{2}\/\d{2})/);
    const dateRange = dateMatch ? `${dateMatch[1]} 〜 ${dateMatch[2]}` : '';

    const priceMatch = bodyText.match(/(\d{1,2},?\d{3}円\s*[～〜～-]\s*\d{1,2},?\d{3}円|\d{1,2},?\d{3}円)/);
    const price = priceMatch ? priceMatch[0] : '';

    let synopsis = '';
    const descMatch = bodyText.match(/【あらすじ】([^【]*)/);
    if (descMatch) {
      synopsis = descMatch[1].trim().substring(0, 200);
    }

    console.log(`  Found: ${title} (${company})`);

    return { title, company, dateRange, venue, price, officialUrl, synopsis };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

async function fetchAllPerformances() {
  const urls = await fetchPerformanceList();
  const performances = [];

  for (const url of urls) {
    const performance = await fetchPerformanceDetail(url);
    if (performance && performance.title) {
      performances.push(performance);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return performances;
}

function getWeekInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const week = Math.ceil(day / 7);
  return { year, month, week };
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateArticle(performances, weekInfo) {
  const today = formatDate(new Date());

  let article = `---
title: "今週の注目公演情報【${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週】"
date: "${today}"
description: "${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週の注目演劇公演をまとめました"
tags: ["公演情報", "演劇", "舞台"]
---

## 今週の注目公演

`;

  let count = 0;
  performances.forEach((perf, index) => {
    if (!perf.officialUrl) return;
    count++;

    article += `### ${count}. ${perf.title}

- **劇団**: ${perf.company || '詳細は公式サイトをご確認ください'}
- **日程**: ${perf.dateRange || '詳細は公式サイトをご確認ください'}
- **会場**: ${perf.venue || '詳細は公式サイトをご確認ください'}
- **料金**: ${perf.price || '詳細は公式サイトをご確認ください'}
- **公式サイト**: ${perf.officialUrl}

**あらすじ**

${perf.synopsis || 'あらすじは公式サイトをご確認ください。'}

---

`;
  });

  article += `## 編集後記

今週も素敵な公演が目白押しです。気になる作品があれば、ぜひ劇場に足を運んでみてください。
`;

  return article;
}

async function main() {
  console.log('Fetching performances from CoRich...');
  let performances = await fetchAllPerformances();

  console.log(`Found ${performances.length} performances with official URLs`);

  if (performances.length === 0) {
    console.log('No performances found. Using sample data...');
    performances = [{
      title: 'サンプル公演',
      company: 'サンプル劇団',
      dateRange: '2026年2月10日〜15日',
      venue: 'サンプル劇場',
      price: '一般 4,000円',
      officialUrl: 'https://example.com/sample',
      synopsis: 'これはサンプルの公演情報です。',
    }];
  }

  const weekInfo = getWeekInfo();
  console.log(`Generating article for ${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週...`);

  const article = generateArticle(performances, weekInfo);

  const today = formatDate(new Date());
  const outputPath = path.join(__dirname, '..', '..', 'blog', 'posts', `${today}-weekly-performances.md`);

  fs.writeFileSync(outputPath, article, 'utf-8');
  console.log(`\nArticle saved to: ${outputPath}`);
  console.log(`Performances count: ${performances.length}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
