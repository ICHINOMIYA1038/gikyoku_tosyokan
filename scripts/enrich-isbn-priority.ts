/**
 * 優先度の高い作品（PV上位＋著名劇作家）に絞って楽天ブックスで販売有無を確認し、
 * ISBN_13を埋める。判定は「著者名と検索結果ページのISBN周辺テキストの一致」で行う。
 *
 * 実行: set -a && source .env.local && set +a && npx tsx scripts/enrich-isbn-priority.ts [--limit=N] [--dry] [--pv-only|--author-only]
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const RATE_LIMIT_MS = 1500;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// 著名劇作家リスト（戯曲集として書籍化されている可能性が高い）
const NOTABLE_AUTHORS = [
  "別役実", "平田オリザ", "野田秀樹", "井上ひさし", "つかこうへい",
  "岸田國士", "寺山修司", "唐十郎", "坂手洋二", "永井愛",
  "ケラリーノ・サンドロヴィッチ", "宮藤官九郎", "清水邦夫", "安部公房", "三島由紀夫",
  "シェイクスピア", "チェーホフ", "イプセン", "サミュエル・ベケット",
  "テネシー・ウィリアムズ", "アーサー・ミラー", "ハロルド・ピンター",
  "鴻上尚史", "宮本研", "木下順二", "佐藤信", "別役 実",
  "成井豊", "鄭義信", "土田英生", "本谷有希子", "前川知大",
  "岩松了", "蓬莱竜太", "三谷幸喜", "ケラリーノ サンドロヴィッチ",
  "横内謙介", "中屋敷法仁", "倉持裕", "ハロルド ピンター",
];

function normalize(s: string): string {
  return s.replace(/[\s『』「」（）\(\)・\-]+/g, "").toLowerCase();
}

/**
 * 楽天ブックスの検索結果から、対象作品（タイトル+著者）が販売されているかチェック。
 * ISBN周辺のテキストに著者名が含まれていれば、そのISBNを採用。
 */
async function findIsbnOnRakuten(title: string, creator: string): Promise<string | null> {
  const query = `${title} ${creator}`;
  const url = `https://books.rakuten.co.jp/search?sitem=${encodeURIComponent(query)}&g=000`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "ja" },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const nCreator = normalize(creator);
    const nTitle = normalize(title);

    // 全てのISBN-13候補を抽出
    const isbnPattern = /ISBN[：:]\s*(\d{13})/g;
    let match: RegExpExecArray | null;
    while ((match = isbnPattern.exec(html)) !== null) {
      const isbn = match[1];
      // 洋書(979/9781以外で978)を除外: 日本の書籍は978-4-始まり
      if (!isbn.startsWith("9784")) continue;
      // 該当ISBN周辺500文字を取得して、著者名 or タイトルが含まれるか
      const start = Math.max(0, match.index - 500);
      const end = Math.min(html.length, match.index + 500);
      const surround = normalize(html.slice(start, end));
      if (surround.includes(nCreator)) {
        // 著者名が周辺にあればOK
        return isbn;
      }
      if (surround.includes(nTitle) && nTitle.length >= 6) {
        // タイトルが十分長く周辺一致したらOK（保険）
        return isbn;
      }
    }
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
  const pvOnly = args.includes("--pv-only");
  const authorOnly = args.includes("--author-only");

  // PV TOP100
  const topPVs = await prisma.access.groupBy({
    by: ["postId"],
    _count: { postId: true },
    orderBy: { _count: { postId: "desc" } },
    take: 100,
  });
  const pvPostIds = topPVs.map((a) => a.postId);

  // 著名劇作家のpostId
  const authorPosts = await prisma.author.findMany({
    where: { name: { in: NOTABLE_AUTHORS } },
    include: { posts: { select: { id: true } } },
  });
  const authorPostIds = authorPosts.flatMap((a) => a.posts.map((p) => p.id));

  let targetIds: number[];
  if (pvOnly) targetIds = pvPostIds;
  else if (authorOnly) targetIds = authorPostIds;
  else targetIds = [...new Set([...pvPostIds, ...authorPostIds])];

  // ISBN_13 が未設定のもののみ抽出
  const posts = await prisma.post.findMany({
    where: { id: { in: targetIds }, ISBN_13: null },
    include: { author: true },
    take: limit,
  });

  console.log(`Target: ${posts.length} posts (PV top: ${pvPostIds.length}, author: ${authorPostIds.length}, merged unique: ${targetIds.length})`);
  console.log(`Mode: dry=${dry}\n`);

  let found = 0;
  let notFound = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (!post.title || !post.author?.name) {
      notFound++;
      continue;
    }
    const tag = `[${i + 1}/${posts.length}]`;
    const isbn = await findIsbnOnRakuten(post.title, post.author.name);
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

  console.log(`\nDone. Found: ${found}/${posts.length} (${posts.length ? ((found / posts.length) * 100).toFixed(1) : 0}%)`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
