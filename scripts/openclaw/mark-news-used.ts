import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ids = process.argv.slice(2).map(Number).filter(Boolean);
  const slug = process.env.USED_IN_SLUG || null;

  if (ids.length === 0) {
    console.log('Usage: npx tsx scripts/openclaw/mark-news-used.ts <id1> <id2> ...');
    console.log('  USED_IN_SLUG=slug npx tsx scripts/openclaw/mark-news-used.ts <id1> <id2> ...');
    process.exit(1);
  }

  const result = await prisma.theaterNewsItem.updateMany({
    where: { id: { in: ids } },
    data: { used: true, usedInSlug: slug },
  });

  console.log(`${result.count}件を使用済みにマークしました (slug: ${slug || 'なし'})`);
  await prisma.$disconnect();
}

main();
