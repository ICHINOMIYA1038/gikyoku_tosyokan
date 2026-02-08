/**
 * 無料公開URL → 戯曲図書館DB link_to_plot インポート
 *
 * 安全ポリシー:
 * - link_to_plot が null の場合のみ UPDATE（既存URLは上書きしない）
 * - ドライラン対応（--dry-run フラグ）
 */

const fs = require('fs');
const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const freeUrls = JSON.parse(fs.readFileSync('/tmp/gikyoku-free-urls.json', 'utf8'));
    console.log(`=== 無料URL インポート${DRY_RUN ? '（ドライラン）' : ''} ===`);
    console.log(`対象URL: ${freeUrls.length} 件`);

    const existingPosts = await prisma.post.findMany({
      select: { id: true, title: true, link_to_plot: true }
    });
    const postByTitle = new Map(existingPosts.map(p => [p.title.trim(), p]));

    let updatedCount = 0;
    let skippedExisting = 0;
    let noMatch = 0;

    for (const item of freeUrls) {
      const post = postByTitle.get(item.title?.trim());
      if (!post) {
        noMatch++;
        continue;
      }

      if (post.link_to_plot) {
        skippedExisting++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  ${item.title} → ${item.url}`);
      } else {
        await prisma.post.update({
          where: { id: post.id },
          data: { link_to_plot: item.url }
        });
      }
      updatedCount++;
    }

    console.log('');
    console.log(`=== 結果 ===`);
    console.log(`URL追加: ${updatedCount} 件`);
    console.log(`スキップ（既存URL保持）: ${skippedExisting} 件`);
    console.log(`タイトル不一致: ${noMatch} 件`);

    if (!DRY_RUN) {
      const withLink = await prisma.post.count({ where: { NOT: { link_to_plot: null } } });
      console.log(`\n最終状態: link_to_plot あり = ${withLink} / ${existingPosts.length}`);
    }

    await prisma.$disconnect();

    if (DRY_RUN) {
      console.log(`\n✅ ドライラン完了。実行するには --dry-run を外してください。`);
    }
  } catch (e) {
    console.error('エラー:', e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
