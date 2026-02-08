import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, content: true, language: true },
  });

  let updated = 0;

  for (const post of posts) {
    let newContent = post.content;

    // /blog/kishida-* → /blog/en/kishida-*
    newContent = newContent.replace(/\/blog\/(kishida-)/g, '/blog/en/$1');
    // /blog/guide-* → /blog/en/guide-*
    newContent = newContent.replace(/\/blog\/(guide-)/g, '/blog/en/$1');
    // /blog/2026-* → /blog/ja/2026-*
    newContent = newContent.replace(/\/blog\/(2026-)/g, '/blog/ja/$1');

    if (newContent !== post.content) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { content: newContent },
      });
      updated++;
    }
  }

  console.log(`Updated internal links in ${updated} / ${posts.length} posts`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
