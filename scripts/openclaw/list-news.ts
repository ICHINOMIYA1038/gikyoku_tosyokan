import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Keep scheduled jobs bounded; older research can be requested explicitly.
  const args = process.argv.slice(2);
  function option(name: string, fallback: number, max: number): number {
    const index = args.indexOf(name);
    if (index === -1) return fallback;
    const value = Number(args[index + 1]);
    if (!Number.isInteger(value) || value < 1 || value > max) throw new Error(`${name} must be 1..${max}`);
    return value;
  }
  const days = option('--days', 14, 3650);
  const limit = option('--limit', 40, 200);
  const since = new Date(Date.now() - days * 86400000);
  const where = { used: false, publishedAt: { gte: since, lte: new Date() } };
  const available = await prisma.theaterNewsItem.count({ where });
  const items = await prisma.theaterNewsItem.findMany({
    where,
    take: limit,
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

  console.log(`対象: 直近${days}日、候補${available}件、表示上限${limit}件`);
  console.log(`合計: ${items.length}件 (国内: ${domestic.length}件, 海外: ${overseas.length}件)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'ニュース取得に失敗');
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
