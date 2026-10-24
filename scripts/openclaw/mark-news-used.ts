import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const values = process.argv.slice(2);
  const ids = Array.from(new Set(values.map(Number)));
  const slug = process.env.USED_IN_SLUG?.trim();
  if (!slug || !ids.length || ids.some(id => !Number.isSafeInteger(id) || id <= 0)) {
    throw new Error('USED_IN_SLUG must be the exact published BlogPost slug; provide positive news IDs');
  }

  const count = await prisma.$transaction(async tx => {
    const article = await tx.blogPost.findUnique({ where: { slug }, select: { published: true } });
    if (!article?.published) throw new Error('Published BlogPost not found for USED_IN_SLUG; news remains unused');
    const result = await tx.theaterNewsItem.updateMany({
      where: { id: { in: ids }, OR: [{ used: false }, { usedInSlug: slug }] },
      data: { used: true, usedInSlug: slug },
    });
    if (result.count !== ids.length) throw new Error('Missing news IDs or already used by another article; rolled back');
    return result.count;
  });
  console.log(`${count}件を使用済みにマークしました (slug: ${slug})`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : '使用済み更新に失敗');
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
