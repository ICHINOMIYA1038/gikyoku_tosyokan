/**
 * 早稲田戯曲アーカイブ → 戯曲図書館DB インポートスクリプト
 * 
 * 安全ポリシー:
 * - INSERT ONLY（既存レコードのUPDATE/DELETEは一切しない）
 * - タイトル完全一致で重複スキップ
 * - ドライラン対応（--dry-run フラグ）
 */

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  // Prisma import（gikyoku_tosyokanディレクトリのnode_modulesを使用）
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const wasedaAll = require('/tmp/gikyoku-waseda-full.json');

    // 1. 既存データ取得
    const existingPosts = await prisma.post.findMany({
      select: { id: true, title: true, author: { select: { id: true, name: true } } }
    });
    const existingAuthors = await prisma.author.findMany({
      select: { id: true, name: true }
    });

    const existingTitles = new Set(existingPosts.map(p => p.title.trim()));
    const authorMap = new Map(existingAuthors.map(a => [a.name.trim(), a.id]));

    console.log(`=== 戯曲インポート${DRY_RUN ? '（ドライラン）' : ''} ===`);
    console.log(`既存Posts: ${existingPosts.length}`);
    console.log(`既存Authors: ${existingAuthors.length}`);
    console.log(`早稲田データ: ${wasedaAll.length}`);
    console.log('');

    // 2. 不足分を抽出
    const missing = wasedaAll.filter(w => !existingTitles.has(w.title?.trim()));
    console.log(`追加候補: ${missing.length} 件`);
    console.log('');

    // 3. 新規作者を特定
    const newAuthorNames = new Set();
    for (const m of missing) {
      const name = m.author?.trim();
      if (name && !authorMap.has(name)) {
        newAuthorNames.add(name);
      }
    }
    console.log(`新規作者: ${newAuthorNames.size} 名`);
    if (newAuthorNames.size > 0) {
      for (const name of [...newAuthorNames].slice(0, 20)) {
        console.log(`  + ${name}`);
      }
      if (newAuthorNames.size > 20) console.log(`  ...(他 ${newAuthorNames.size - 20} 名)`);
    }
    console.log('');

    if (DRY_RUN) {
      console.log('--- ドライラン: 追加されるPost一覧 ---');
      missing.forEach((m, i) => {
        const authorExists = authorMap.has(m.author?.trim()) ? '既存' : '新規';
        console.log(`  ${i+1}. ${m.title} — ${m.author} [作者:${authorExists}] 男${m.man ?? '?'}/女${m.woman ?? '?'}/他${m.others ?? '0'}/計${m.totalNumber ?? '?'} 上演時間${m.playtime ?? '?'}分`);
      });
      console.log(`\n✅ ドライラン完了。実行するには --dry-run を外してください。`);
      await prisma.$disconnect();
      return;
    }

    // 4. 新規作者をINSERT
    let newAuthorCount = 0;
    for (const name of newAuthorNames) {
      const created = await prisma.author.create({
        data: { name }
      });
      authorMap.set(name, created.id);
      newAuthorCount++;
    }
    console.log(`作者INSERT完了: ${newAuthorCount} 名`);

    // 5. 新規PostをINSERT
    let insertedCount = 0;
    let skippedCount = 0;
    for (const m of missing) {
      const authorName = m.author?.trim();
      const authorId = authorMap.get(authorName);
      if (!authorId) {
        console.error(`  ⚠ 作者IDが見つからない: ${authorName} (${m.title}) → スキップ`);
        skippedCount++;
        continue;
      }

      await prisma.post.create({
        data: {
          title: m.title,
          author_id: authorId,
          man: m.man ?? null,
          woman: m.woman ?? null,
          others: m.others ?? null,
          totalNumber: m.totalNumber ?? null,
          playtime: m.playtime ?? null,
        }
      });
      insertedCount++;
    }

    console.log(`\n=== 結果 ===`);
    console.log(`Post INSERT: ${insertedCount} 件`);
    console.log(`スキップ: ${skippedCount} 件`);
    console.log(`Author INSERT: ${newAuthorCount} 名`);

    // 6. 最終確認
    const finalPostCount = await prisma.post.count();
    const finalAuthorCount = await prisma.author.count();
    console.log(`\n最終DB状態: Posts=${finalPostCount}, Authors=${finalAuthorCount}`);

    await prisma.$disconnect();
  } catch (e) {
    console.error('エラー:', e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
