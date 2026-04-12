/**
 * CI用の最小シードデータ作成
 * テスト実行に必要な最小限のレコードを投入する。
 *
 * 使い方: npx tsx scripts/ci-seed.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // テストに必要な最小限: Author 1件 + Post 1件
  const author = await prisma.author.upsert({
    where: { name: 'テスト作者' },
    update: {},
    create: {
      name: 'テスト作者',
      profile: 'CI用テスト作者',
    },
  });

  await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'テスト戯曲',
      content: 'CI用テスト戯曲の本文です。',
      synopsis: 'テスト用のあらすじ',
      author_id: author.id,
    },
  });

  console.log('CI seed completed: 1 author, 1 post');
}

main()
  .catch((e) => {
    console.error('CI seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
