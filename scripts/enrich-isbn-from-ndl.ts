/**
 * 国立国会図書館サーチAPI (NDL Search OpenSearch) を使って、
 * ISBN_13が未設定のPostにタイトル+著者名で検索したISBNを埋める。
 *
 * 実行: set -a && source .env.local && set +a && npx tsx scripts/enrich-isbn-from-ndl.ts [--limit=N] [--dry]
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NDL_ENDPOINT = "https://iss.ndl.go.jp/api/opensearch";
const RATE_LIMIT_MS = 1000;

function convertISBN10to13(isbn10: string): string {
  const core = isbn10.replace(/-/g, "").slice(0, 9);
  const body = "978" + core;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(body[i], 10) * (i % 2 === 0 ? 1 : 3);
  const check = (10 - (sum % 10)) % 10;
  return body + check;
}

async function searchOnce(params: URLSearchParams): Promise<string | null> {
  const url = `${NDL_ENDPOINT}?${params.toString()}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "gikyoku-tosyokan/1.0" } });
    if (!res.ok) return null;
    const xml = await res.text();
    const isbn13 = xml.match(/<dc:identifier[^>]*ISBN13[^>]*>(\d{13})<\/dc:identifier>/);
    if (isbn13) return isbn13[1];
    const isbn10 = xml.match(/<dc:identifier[^>]*ISBN[^>]*>([\dX]{10})<\/dc:identifier>/i);
    if (isbn10) return convertISBN10to13(isbn10[1]);
    return null;
  } catch (e) {
    console.error("  NDL fetch error:", e);
    return null;
  }
}

async function searchNDL(title: string, creator: string): Promise<string | null> {
  // 1) タイトル+著者で厳格に検索
  let isbn = await searchOnce(new URLSearchParams({ title, creator, cnt: "5" }));
  if (isbn) return isbn;
  // 2) anywhere (全文検索) で広く検索
  await new Promise((r) => setTimeout(r, 500));
  isbn = await searchOnce(new URLSearchParams({ any: `${title} ${creator}`, cnt: "5" }));
  if (isbn) return isbn;
  return null;
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

  console.log(`Processing ${posts.length} posts without ISBN_13 (dry=${dry})`);
  let found = 0;
  let notFound = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post.title || !post.author?.name) {
      notFound++;
      continue;
    }

    const isbn = await searchNDL(post.title, post.author.name);
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
