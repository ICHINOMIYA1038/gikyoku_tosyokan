/**
 * Postに保存されたISBN_13が、実際にその作品のISBNなのか検証する。
 * 楽天ブックスの商品詳細ページ /rb/{ISBN}/ にアクセスし、
 * 取得したタイトル・著者がDBの値と一致するかチェック。
 *
 * 実行: set -a && source .env.local && set +a && npx tsx scripts/verify-isbn.ts [--limit=N] [--fix]
 *   --fix: ミスマッチをISBN_13=nullに更新
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const RATE_LIMIT_MS = 1200;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function normalize(s: string): string {
  return s.replace(/[\s『』「」（）\(\)・\-\,\、\.\。【】\[\]　]+/g, "").toLowerCase();
}

// HTMLエンティティのデコード（簡易版）
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

type Verification = {
  isbn: string;
  rakutenTitle: string | null;
  rakutenAuthor: string | null;
  exists: boolean;
};

async function fetchRakutenProduct(isbn: string, expectedAuthor: string, expectedTitle: string): Promise<Verification & { authorFoundInBlock: boolean; titleFoundInBlock: boolean; nearbyText: string }> {
  // 楽天ブックス検索結果から、ISBNの周辺テキストに対象作品の著者・タイトルが含まれるかで検証。
  const url = `https://books.rakuten.co.jp/search?sitem=${isbn}&g=000`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "ja" } });
    if (!res.ok) return { isbn, rakutenTitle: null, rakutenAuthor: null, exists: false, authorFoundInBlock: false, titleFoundInBlock: false, nearbyText: "" };
    const html = await res.text();
    const isbnIdx = html.indexOf(`ISBN：${isbn}`) >= 0 ? html.indexOf(`ISBN：${isbn}`) : html.indexOf(`ISBN:${isbn}`);
    if (isbnIdx < 0) {
      return { isbn, rakutenTitle: null, rakutenAuthor: null, exists: false, authorFoundInBlock: false, titleFoundInBlock: false, nearbyText: "" };
    }
    // ISBN前後1200文字を取得
    const start = Math.max(0, isbnIdx - 1200);
    const end = Math.min(html.length, isbnIdx + 400);
    const blockHtml = html.slice(start, end);
    // HTMLタグを除去してテキストにする
    const blockText = decodeEntities(blockHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
    const nBlock = normalize(blockText);
    const nAuthor = normalize(expectedAuthor);
    const nTitle = normalize(expectedTitle);
    const authorFound = nAuthor.length >= 2 && nBlock.includes(nAuthor);
    const titleFound = nTitle.length >= 3 && nBlock.includes(nTitle);
    return {
      isbn,
      rakutenTitle: null,
      rakutenAuthor: null,
      exists: true,
      authorFoundInBlock: authorFound,
      titleFoundInBlock: titleFound,
      nearbyText: blockText.slice(0, 200),
    };
  } catch (e) {
    return { isbn, rakutenTitle: null, rakutenAuthor: null, exists: false, authorFoundInBlock: false, titleFoundInBlock: false, nearbyText: "" };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : undefined;
  const fix = args.includes("--fix");

  const posts = await prisma.post.findMany({
    where: { ISBN_13: { not: null } },
    include: { author: true },
    take: limit,
  });

  console.log(`Verifying ${posts.length} posts with ISBN_13 (fix=${fix})\n`);

  let ok = 0;
  let notFound = 0;
  let mismatch = 0;
  const mismatches: { id: number; title: string; author: string; isbn: string; nearbyText: string }[] = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const v = await fetchRakutenProduct(post.ISBN_13!, post.author?.name || "", post.title || "");
    const tag = `[${i + 1}/${posts.length}]`;
    if (!v.exists) {
      notFound++;
      console.log(`${tag} ⚠ ${post.author?.name}『${post.title}』(ISBN=${post.ISBN_13}) - 楽天検索でヒットせず`);
      mismatches.push({ id: post.id, title: post.title!, author: post.author?.name || "", isbn: post.ISBN_13!, nearbyText: "" });
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
      continue;
    }
    if (v.authorFoundInBlock || v.titleFoundInBlock) {
      ok++;
      // OKは詳細表示しない（ログを簡潔に）
    } else {
      mismatch++;
      console.log(`${tag} ✗ ${post.author?.name}『${post.title}』(ISBN=${post.ISBN_13})`);
      console.log(`     ↳ 楽天周辺: "${v.nearbyText}"`);
      mismatches.push({ id: post.id, title: post.title!, author: post.author?.name || "", isbn: post.ISBN_13!, nearbyText: v.nearbyText });
    }
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }

  console.log(`\n=== Result ===`);
  console.log(`OK: ${ok}/${posts.length}`);
  console.log(`Not found on rakuten: ${notFound}`);
  console.log(`Mismatch: ${mismatch}`);

  if (fix && mismatches.length > 0) {
    console.log(`\nFixing ${mismatches.length} mismatches (set ISBN_13=null)...`);
    for (const m of mismatches) {
      await prisma.post.update({ where: { id: m.id }, data: { ISBN_13: null } });
    }
    console.log("Done.");
  } else if (mismatches.length > 0) {
    console.log(`\nRun with --fix to clear ISBN_13 for the ${mismatches.length} mismatches above.`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
