/**
 * Gemini APIを使ってAI紹介文を自動生成し、ai_descriptionカラムに保存するスクリプト
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/generate-ai-descriptions.ts
 *
 * オプション:
 *   --limit=50     処理件数を指定（デフォルト: 50）
 *   --dry-run      生成のみ、DB更新なし
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const args = process.argv.slice(2);
const limitArg = args.find(a => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1]) : 50;
const DRY_RUN = args.includes("--dry-run");

// レート制限: 1リクエストあたりの待機時間(ms)
const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateDescription(
  title: string,
  authorName: string,
  synopsis: string | null,
  man: number | null,
  woman: number | null,
  others: number | null,
  playtime: number | null,
  categories: string[]
): Promise<string | null> {
  const castInfo = [
    man != null ? `男${man}` : null,
    woman != null ? `女${woman}` : null,
    others != null ? `その他${others}` : null,
  ].filter(Boolean).join("・");

  const prompt = `あなたは演劇・戯曲の専門家です。以下の戯曲作品について、読者が「この作品を読んでみたい／上演してみたい」と思えるような魅力的な紹介文を書いてください。

【作品情報】
- タイトル: ${title}
- 作家: ${authorName}
${synopsis ? `- あらすじ: ${synopsis}` : ""}
${castInfo ? `- キャスト構成: ${castInfo}` : ""}
${playtime ? `- 上演時間: 約${playtime}分` : ""}
${categories.length > 0 ? `- ジャンル: ${categories.join("、")}` : ""}

【ルール】
- 100〜200文字程度で簡潔に
- ネタバレは絶対に避ける
- 作品の雰囲気・テーマ・魅力が伝わるように
- 「〜な作品。」のような体言止めや「〜だ。」で終わる文体
- 上演を検討している演劇関係者にも参考になる情報を含める
- あらすじが無い場合は、作家の作風や作品タイトルから推測できる範囲で書く
- 嘘の情報は書かない。確信が持てない場合は曖昧な表現にする

紹介文のみを出力してください（前置きや説明は不要）。`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`  API error ${res.status}: ${errText.slice(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text || null;
  } catch (err: any) {
    console.error(`  Fetch error: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`=== AI紹介文自動生成 ===`);
  console.log(`モデル: ${MODEL}`);
  console.log(`処理件数: ${LIMIT}`);
  console.log(`DRY RUN: ${DRY_RUN}\n`);

  // AI紹介文がない作品を取得
  const posts = await prisma.post.findMany({
    where: { aiDescription: null },
    select: {
      id: true,
      title: true,
      synopsis: true,
      man: true,
      woman: true,
      others: true,
      playtime: true,
      author: { select: { name: true } },
      categories: { select: { name: true } },
    },
    orderBy: { id: "asc" },
    take: LIMIT,
  });

  console.log(`対象作品: ${posts.length}件\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`[${i + 1}/${posts.length}] id=${post.id} ${post.author.name}『${post.title}』`);

    const desc = await generateDescription(
      post.title,
      post.author.name,
      post.synopsis,
      post.man,
      post.woman,
      post.others,
      post.playtime,
      post.categories.map(c => c.name)
    );

    if (!desc) {
      console.log(`  → FAILED`);
      failed++;
      await sleep(DELAY_MS);
      continue;
    }

    console.log(`  → ${desc.slice(0, 60)}...`);

    if (!DRY_RUN) {
      await prisma.post.update({
        where: { id: post.id },
        data: { aiDescription: desc },
      });
      console.log(`  → SAVED`);
    }

    success++;
    await sleep(DELAY_MS);
  }

  console.log(`\n=== 完了 ===`);
  console.log(`成功: ${success} / 失敗: ${failed} / スキップ: ${skipped}`);
  console.log(`残り: ${await prisma.post.count({ where: { aiDescription: null } })}件`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
