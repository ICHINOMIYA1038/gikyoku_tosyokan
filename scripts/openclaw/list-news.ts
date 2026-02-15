import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.theaterNewsItem.findMany({
    where: { used: false },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      source: true,
      title: true,
      summary: true,
      language: true,
      category: true,
      publishedAt: true,
      sourceUrl: true,
    },
  });

  console.log('=== 国内ニュース (natalie) ===\n');
  const domestic = items.filter((i) => i.source === 'natalie');
  for (const item of domestic) {
    console.log(`[${item.id}] ${item.title}`);
    console.log(`  ${(item.summary || '').substring(0, 100)}`);
    console.log(`  ${item.publishedAt.toISOString().split('T')[0]}`);
    console.log(`  ${item.sourceUrl}`);
    console.log();
  }

  console.log('=== 海外ニュース ===\n');
  const overseas = items.filter((i) => i.source !== 'natalie');
  for (const item of overseas) {
    console.log(`[${item.id}] [${item.source}] ${item.title}`);
    console.log(`  ${(item.summary || '').substring(0, 120)}`);
    console.log(`  ${item.publishedAt.toISOString().split('T')[0]}`);
    console.log(`  ${item.sourceUrl}`);
    console.log();
  }

  console.log(`合計: ${items.length}件 (国内: ${domestic.length}件, 海外: ${overseas.length}件)`);
  await prisma.$disconnect();
}

main();
