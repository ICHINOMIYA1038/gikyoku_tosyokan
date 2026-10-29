/**
 * 既存のMarkdownブログ記事をDBに投入するスクリプト
 *
 * 使い方:
 *   npx tsx scripts/migrate-blog-to-db.ts
 *   npx tsx scripts/migrate-blog-to-db.ts --slug 2026-02-15-theater-books-for-actors
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const postsDirectory = path.join(process.cwd(), 'blog/posts');

async function main() {
  const slugIndex = process.argv.indexOf('--slug');
  const requestedSlug = slugIndex >= 0 ? process.argv[slugIndex + 1] : null;
  if (slugIndex >= 0 && (!requestedSlug || !/^[a-z0-9][a-z0-9-]*$/.test(requestedSlug))) {
    throw new Error('Invalid or missing --slug value');
  }

  const fileNames = fs.readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => !requestedSlug || f === `${requestedSlug}.md`);
  if (requestedSlug && fileNames.length !== 1) {
    throw new Error(`Blog source not found for slug: ${requestedSlug}`);
  }

  const dryRun = process.argv.includes('--dry-run');
  let changed = 0;
  let skipped = 0;
  console.log(`Found ${fileNames.length} markdown files${requestedSlug ? ` for ${requestedSlug}` : ''}${dryRun ? ' (dry run)' : ''}`);

  for (const fileName of fileNames) {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { title: true, description: true, content: true, tags: true, publishedAt: true },
    });
    let publishedAt: Date;
    if (data.date) {
      publishedAt =
        data.date instanceof Date ? data.date : new Date(String(data.date));
    } else {
      publishedAt = existing?.publishedAt || new Date();
    }

    if (!Number.isFinite(publishedAt.getTime())) throw new Error(`Invalid date: ${slug}`);
    const values = {
      title: data.title || slug,
      description: data.description || null,
      content,
      tags: data.tags || [],
      publishedAt,
    };
    if (existing &&
        existing.title === values.title &&
        existing.description === values.description &&
        existing.content === values.content &&
        JSON.stringify(existing.tags) === JSON.stringify(values.tags) &&
        existing.publishedAt.getTime() === publishedAt.getTime()) {
      skipped++;
      continue;
    }
    changed++;
    if (dryRun) {
      console.log(`  Would upsert: ${slug}`);
      continue;
    }
    await prisma.blogPost.upsert({
      where: { slug },
      update: values,
      create: { slug, ...values, published: true },
    });

    console.log(`  Upserted: ${slug}`);
  }

  console.log(`\nDone! ${changed} posts ${dryRun ? 'would be migrated' : 'migrated'}, ${skipped} unchanged.`);
}

main()
  .catch((e) => {
    console.error('Blog sync failed');
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
