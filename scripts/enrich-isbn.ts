/**
 * 2段階で戯曲の販売有無を厳密にチェックしてISBN_13を保存する。
 *
 * 1. Google Books APIで「タイトル+著者」検索 → ISBN候補取得（タイトル・著者を照合）
 * 2. 楽天ブックスで /rb/{ISBN}/ にアクセス → 実際に販売されているか確認
 * 両方OKの場合のみPost.ISBN_13に保存
 *
 * 実行: set -a && source .env.local && set +a && npx tsx scripts/enrich-isbn.ts [--limit=N] [--dry]
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const RATE_LIMIT_MS = 1500;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// タイトル正規化: 空白・記号を除去、ひらがな/カタカナ統一などはせず、緩めの含有判定
function normalize(s: string): string {
  return s.replace(/[\s『』「」（）\(\)・]+/g, "").toLowerCase();
}

type GoogleBookHit = { isbn: string; title: string; authors: string[] };

async function searchGoogleBooks(title: string, creator: string): Promise<GoogleBookHit[]> {
  const q = `${title} ${creator}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10&printType=books`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json: any = await res.json();
    if (!json.items) return [];
    const hits: GoogleBookHit[] = [];
    for (const item of json.items) {
      const info = item.volumeInfo || {};
      const idents = (info.industryIdentifiers || []) as { type: string; identifier: string }[];
      const isbn13 = idents.find((x) => x.type === "ISBN_13")?.identifier;
      if (!isbn13) continue;
      hits.push({ isbn: isbn13, title: info.title || "", authors: info.authors || [] });
    }
    return hits;
  } catch (e) {
    console.error("  google books error:", e);
    return [];
  }
}

function matchesTitleAuthor(hit: GoogleBookHit, title: string, creator: string): boolean {
  const nTitle = normalize(title);
  const nHitTitle = normalize(hit.title);
  // タイトルが完全一致 or 結果タイトルが対象タイトルを含む or 対象タイトルが結果タイトルを含む
  const titleOK = nHitTitle.includes(nTitle) || nTitle.includes(nHitTitle);
  if (!titleOK) return false;
  const nCreator = normalize(creator);
  const authorOK = hit.authors.some((a) => normalize(a).includes(nCreator) || nCreator.includes(normalize(a)));
  return authorOK;
}

async function checkRakutenAvailable(isbn: string): Promise<boolean> {
  const url = `https://books.rakuten.co.jp/rb/${isbn}/`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "ja" }, redirect: "follow" });
    if (!res.ok) return false;
    const html = await res.text();
    // 404やエラーページではISBNが表示されない・「お探しの商品」が含まれる
    if (/お探しの商品が見つかりません|該当する商品はありませんでした/.test(html)) return false;
    // 商品ページならISBN表記が含まれる
    return /ISBN[：:]\s*\d{13}/.test(html);
  } catch (e) {
    return false;
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
  let notSold = 0;
  let noMatch = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post.title || !post.author?.name) {
      noMatch++;
      continue;
    }
    const tag = `[${i + 1}/${posts.length}]`;
    const hits = await searchGoogleBooks(post.title, post.author.name);
    const validHits = hits.filter((h) => matchesTitleAuthor(h, post.title, post.author.name));

    if (validHits.length === 0) {
      noMatch++;
      console.log(`${tag} ✗ ${post.author.name}『${post.title}』(google books に該当なし)`);
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
      continue;
    }

    let savedIsbn: string | null = null;
    for (const hit of validHits) {
      await new Promise((r) => setTimeout(r, 500));
      const sold = await checkRakutenAvailable(hit.isbn);
      if (sold) {
        savedIsbn = hit.isbn;
        break;
      }
    }

    if (savedIsbn) {
      if (!dry) {
        await prisma.post.update({ where: { id: post.id }, data: { ISBN_13: savedIsbn } });
      }
      found++;
      console.log(`${tag} ✓ ${post.author.name}『${post.title}』→ ${savedIsbn}`);
    } else {
      notSold++;
      console.log(`${tag} ✗ ${post.author.name}『${post.title}』(楽天で販売なし)`);
    }
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
  }

  console.log(
    `\nDone. Found: ${found}/${posts.length} (${((found / posts.length) * 100).toFixed(1)}%)`,
  );
  console.log(`  no google books match: ${noMatch}`);
  console.log(`  google hit but not on rakuten: ${notSold}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
