/**
 * ブログ記事内の「### N. 作者『作品名』」パターンを検出し、
 * 対応する戯曲が戯曲図書館DBにあればAmazonリンクの直後に内部リンクを追加する。
 *
 * 実行: set -a && source .env.local && set +a && npx tsx scripts/add-internal-links-to-blog.ts [--write]
 *   --write を付けないとdry-run（変更を保存しない）
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const BLOG_DIR = path.join(process.cwd(), "blog/posts");

// 「### N. 作者『作品名』」または「### 作者『作品名』」を抽出
const HEADING_RE = /^###\s+(?:\d+\.\s+)?([^『\n]+?)\s*『([^』]+)』/gm;

async function findPost(author: string, title: string): Promise<{ id: number; title: string; author: string } | null> {
  const cleanAuthor = author.trim().replace(/[\s　]/g, "");
  const cleanTitle = title.trim();
  // 著者は部分一致、タイトルも部分一致（タイトルが長すぎる場合に対応）
  const candidates = await prisma.post.findMany({
    where: {
      title: { contains: cleanTitle.length > 12 ? cleanTitle.slice(0, 12) : cleanTitle, mode: "insensitive" },
    },
    include: { author: true },
    take: 10,
  });
  for (const c of candidates) {
    const authorName = (c.author?.name || "").replace(/[\s　]/g, "");
    if (authorName.includes(cleanAuthor) || cleanAuthor.includes(authorName)) {
      return { id: c.id, title: c.title!, author: c.author!.name };
    }
  }
  return null;
}

async function processFile(filePath: string, dryRun: boolean): Promise<{ added: number; skipped: number; notFound: number }> {
  const raw = fs.readFileSync(filePath, "utf-8");
  let added = 0;
  let skipped = 0;
  let notFound = 0;

  // セクションに分割（"---" で区切られたMarkdown）
  const sections = raw.split(/^---$/m);
  const newSections: string[] = [];

  for (const section of sections) {
    // ヘッダーから作者・タイトルを抽出
    const matches = Array.from(section.matchAll(HEADING_RE));
    if (matches.length === 0) {
      newSections.push(section);
      continue;
    }
    let modifiedSection = section;
    for (const m of matches) {
      const [, author, title] = m;
      // 既に内部リンクが入っているか
      if (modifiedSection.includes("/posts/") && modifiedSection.match(/戯曲図書館でこの作品の詳細を見る/)) {
        skipped++;
        continue;
      }
      const post = await findPost(author, title);
      if (!post) {
        notFound++;
        continue;
      }
      // 重複防止: 既にこの post.id へのリンクがあればスキップ
      if (modifiedSection.includes(`/posts/${post.id}`)) {
        skipped++;
        continue;
      }
      // Amazonリンク行を探して、その直後に内部リンクを追加
      const amazonRe = /(📕\s+\[Amazonで[^\]]*\]\([^)]+\))/;
      if (amazonRe.test(modifiedSection)) {
        modifiedSection = modifiedSection.replace(amazonRe, `$1\n📖 [戯曲図書館でこの作品の詳細を見る →](/posts/${post.id})`);
        added++;
        console.log(`  ✓ ${author.trim()}『${title}』→ /posts/${post.id}`);
      } else {
        // Amazonリンク無し: 見出し直後にリンクを追加
        // ヘッダー行を見つけてその直後の空行までに挿入
        const headingLine = m[0];
        const insertion = `\n\n📖 [戯曲図書館でこの作品の詳細を見る →](/posts/${post.id})`;
        modifiedSection = modifiedSection.replace(headingLine, `${headingLine}${insertion}`);
        added++;
        console.log(`  ✓ ${author.trim()}『${title}』→ /posts/${post.id} (no amazon link)`);
      }
    }
    newSections.push(modifiedSection);
  }

  const result = newSections.join("---");
  if (added > 0 && !dryRun) {
    fs.writeFileSync(filePath, result, "utf-8");
  }
  return { added, skipped, notFound };
}

async function main() {
  const dryRun = !process.argv.includes("--write");
  console.log(`Mode: ${dryRun ? "dry-run" : "WRITE"}`);

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  let totalAdded = 0;
  let totalSkipped = 0;
  let totalNotFound = 0;
  let filesChanged = 0;

  for (const f of files) {
    const filePath = path.join(BLOG_DIR, f);
    const before = totalAdded;
    process.stdout.write(`[${f}]`);
    const { added, skipped, notFound } = await processFile(filePath, dryRun);
    totalAdded += added;
    totalSkipped += skipped;
    totalNotFound += notFound;
    if (added > 0) filesChanged++;
    if (totalAdded > before) console.log(`  → ${added} added`);
    else process.stdout.write(`\n`);
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total links added: ${totalAdded}`);
  console.log(`Files modified: ${filesChanged}`);
  console.log(`Skipped (already linked): ${totalSkipped}`);
  console.log(`Not in DB: ${totalNotFound}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
