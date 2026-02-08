import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function detectLanguage(slug: string, title: string): string {
  // English articles have these slug prefixes
  if (slug.startsWith('kishida-') || slug.startsWith('guide-')) {
    return 'en';
  }
  // Everything else is Japanese
  return 'ja';
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, title: true, language: true },
  });

  let jaCount = 0;
  let enCount = 0;

  for (const post of posts) {
    const lang = detectLanguage(post.slug, post.title);
    if (post.language !== lang) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { language: lang },
      });
    }
    if (lang === 'ja') jaCount++;
    else enCount++;
  }

  console.log(`Done: ${jaCount} ja, ${enCount} en (total ${posts.length})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
