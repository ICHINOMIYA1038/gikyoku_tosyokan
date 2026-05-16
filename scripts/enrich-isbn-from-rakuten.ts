/**
 * 楽天ブックスの検索結果ページを直接たたいて、戯曲が販売されているかチェックする。
 * 販売されている場合はISBN_13を抽出してPostに保存。
 *
 * 実行: set -a && source .env.local && set +a && npx tsx scripts/enrich-isbn-from-rakuten.ts [--limit=N] [--dry]
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const RATE_LIMIT_MS = 1500;

async function searchRakutenBooks(title: string, creator: string): Promise<string | null> {
  const query = `${title} ${creator}`;
  const url = `https://books.rakuten.co.jp/search?sitem=${encodeURIComponent(query)}&g=000`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "ja",
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    // 商品が0件の場合は早期リターン
    if (/該当する商品はありませんでした|該当する商品が見つかりません|0件/.test(html) && !/ISBN[：:]/.test(html)) {
      return null;
    }
    // 最初のISBN-13を抽出（楽天ブックスは "ISBN：9784..." 形式）
    const isbnMatch = html.match(/ISBN[：:]\s*(\d{13})/);
    if (isbnMatch) return isbnMatch[1];
    // フォールバック: 商品URLパス内のISBN
    const urlMatch = html.match(/\/rb\/(\d{13})/);
    if (urlMatch) return urlMatch[1];
    return null;
  } catch (e) {
    console.error("  fetch error:", e);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : undefined;
  const dry = args.includes("--dry");

  const posts = await prisma.post.findMany({
    where: { ISBN_13: null },
    include: { author: true },
    take: limit,
  });

  console.log(`Processing ${posts.length} posts (dry=${dry})`);
  let found = 0;
  let notFound = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post.title || !post.author?.name) {
      notFound++;
      continue;
    }
    const isbn = await searchRakutenBooks(post.title, post.author.name);
    const tag = `[${i + 1}/${posts.length}]`;
    if (isbn) {
      if (!dry) {
        await prisma.post.update({ where: { id: post.id }, data: { ISBN_13: isbn } });
      }
      found++;
      console.log(`${tag} ✓ ${post.author.name}『${post.title}』→ ${isbn}`);
    } else {
      notFound++;
      console.log(`${tag} ✗ ${post.author.name}『${post.title}』`);
    }
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }

  console.log(`\nDone. Found: ${found}/${posts.length} (${((found / posts.length) * 100).toFixed(1)}%)`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
