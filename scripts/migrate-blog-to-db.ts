/**
 * 既存のMarkdownブログ記事をDBに投入するスクリプト
 *
 * 使い方:
 *   npx tsx scripts/migrate-blog-to-db.ts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const postsDirectory = path.join(process.cwd(), 'blog/posts');

async function main() {
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));

  console.log(`Found ${fileNames.length} markdown files`);

  for (const fileName of fileNames) {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    let publishedAt: Date;
    if (data.date) {
      publishedAt =
        data.date instanceof Date ? data.date : new Date(String(data.date));
    } else {
      publishedAt = new Date();
    }

    await prisma.blogPost.upsert({
      where: { slug },
      update: {
        title: data.title || slug,
        description: data.description || null,
        content,
        tags: data.tags || [],
        publishedAt,
      },
      create: {
        slug,
        title: data.title || slug,
        description: data.description || null,
        content,
        tags: data.tags || [],
        publishedAt,
        published: true,
      },
    });

    console.log(`  Upserted: ${slug}`);
  }

  console.log(`\nDone! ${fileNames.length} posts migrated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
