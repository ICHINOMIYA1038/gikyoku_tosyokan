/**
 * 既存の大学紐づき劇団に対し、最初の所属大学の prefecture / region をコピーする
 *
 * 実行:
 *   set -a && source .env.local && set +a && npx tsx scripts/backfill-theater-group-location.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const groups = await prisma.theaterGroup.findMany({
    where: {
      prefecture: null,
      universities: { some: {} },
    },
    include: {
      universities: {
        include: { university: true },
        orderBy: { id: 'asc' },
        take: 1,
      },
    },
  });

  console.log(`対象劇団数: ${groups.length}`);

  let updated = 0;
  for (const group of groups) {
    const uni = group.universities[0]?.university;
    if (!uni) continue;

    await prisma.theaterGroup.update({
      where: { id: group.id },
      data: {
        prefecture: uni.prefecture,
        region: uni.region,
      },
    });
    updated++;
    console.log(`  ✓ ${group.name} → ${uni.prefecture} (${uni.region})`);
  }

  console.log(`\n完了: ${updated}件を更新しました`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
