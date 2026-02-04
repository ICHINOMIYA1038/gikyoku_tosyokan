/**
 * 記事生成スクリプト（ローカルテスト用）
 * OpenClawなしで記事生成をテストする場合に使用
 *
 * 使用方法:
 *   npx ts-node scripts/openclaw/generate-article.ts
 *
 * 環境変数:
 *   ANTHROPIC_API_KEY - Anthropic APIキー
 */

import fs from 'fs';
import path from 'path';
import { fetchAllPerformances } from './fetch-performances';
import type { Performance } from './fetch-performances';

interface WeekInfo {
  year: number;
  month: number;
  week: number;
}

function getWeekInfo(): WeekInfo {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const week = Math.ceil(day / 7);

  return { year, month, week };
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function generateArticleWithAI(
  performances: Performance[],
  weekInfo: WeekInfo
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.log('ANTHROPIC_API_KEY not set. Generating sample article...');
    return generateSampleArticle(performances, weekInfo);
  }

  const promptPath = path.join(__dirname, 'prompts', 'article-generator.md');
  const systemPrompt = fs.readFileSync(promptPath, 'utf-8');

  const userMessage = JSON.stringify({ performances, weekInfo }, null, 2);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `以下の公演情報から記事を生成してください:\n\n${userMessage}`,
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.content && data.content[0]) {
    return data.content[0].text;
  }

  throw new Error('Failed to generate article: ' + JSON.stringify(data));
}

function generateSampleArticle(
  performances: Performance[],
  weekInfo: WeekInfo
): string {
  const today = formatDate(new Date());

  let article = `---
title: "今週の注目公演情報【${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週】"
date: "${today}"
description: "${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週の注目演劇公演をまとめました"
tags: ["公演情報", "演劇", "舞台"]
---

## 今週の注目公演

`;

  performances.forEach((perf, index) => {
    if (!perf.officialUrl) return;

    article += `### ${index + 1}. ${perf.title}

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
  console.log('Fetching performances...');
  const performances = await fetchAllPerformances();

  console.log(`Found ${performances.length} performances with official URLs`);

  if (performances.length === 0) {
    console.log('No performances found. Using sample data...');
    // サンプルデータを使用
    performances.push({
      title: 'サンプル公演',
      company: 'サンプル劇団',
      dateRange: '2026年2月10日〜15日',
      venue: 'サンプル劇場',
      price: '一般 4,000円',
      officialUrl: 'https://example.com/sample',
      synopsis: 'これはサンプルの公演情報です。',
    });
  }

  const weekInfo = getWeekInfo();
  console.log(`Generating article for ${weekInfo.year}年${weekInfo.month}月第${weekInfo.week}週...`);

  const article = await generateArticleWithAI(performances, weekInfo);

  // ファイルに保存
  const today = formatDate(new Date());
  const outputPath = path.join(
    __dirname,
    '..',
    '..',
    'blog',
    'posts',
    `${today}-weekly-performances.md`
  );

  fs.writeFileSync(outputPath, article, 'utf-8');
  console.log(`Article saved to: ${outputPath}`);
  console.log('\n--- Generated Article ---\n');
  console.log(article);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
