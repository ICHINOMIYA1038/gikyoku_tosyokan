import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Merge plan: [source_id, target_id] - move all posts from source to target, then delete source
const MERGES: [number, number][] = [
  // Near-duplicates
  [75, 28],   // ミステリー → ミステリ
  [95, 4],    // 無料で読める! → 無料で読める！
  [33, 53],   // 社会 → 社会問題
  [78, 109],  // 現代 → 現代劇

  // Location/setting categories: 残す（舞台設定で探すニーズに対応）
  // 病院, ドライブ, 葬儀場, 古民家, ガソリンスタンド, ホテル, 団地,
  // シェアハウス, 図書館, 工場, 港, 灯台, 村, 田舎, 東京, 離島,
  // ホストクラブ → すべて維持

  // Theme merges
  [91, 10],   // 結婚 → 恋愛
  [76, 11],   // 思い出 → ヒューマンドラマ
  [26, 11],   // 追憶 → ヒューマンドラマ
  [67, 11],   // 手紙 → ヒューマンドラマ
  [71, 11],   // 病気 → ヒューマンドラマ
  [51, 11],   // 医療 → ヒューマンドラマ

  // Genre merges
  [30, 28],   // サスペンス → ミステリ
  [47, 9],    // バイオレンス → アクション
  [108, 18],  // ナンセンス → 不条理劇
  [56, 63],   // 幻想 → ファンタジー
  [36, 63],   // 伝奇 → ファンタジー
  [86, 63],   // 夢遊病 → ファンタジー
  [89, 109],  // オマージュ → 現代劇
  [40, 18],   // カオス → 不条理劇
  [43, 53],   // 災害 → 社会問題
  [104, 28],  // 事件 → ミステリ

  // People/group merges
  [73, 27],   // 学生 → 学校
  [97, 27],   // 大学生 → 学校
  [55, 27],   // 大学 → 学校
  [54, 53],   // 学生運動 → 社会問題
  [111, 53],  // 女性運動 → 社会問題
  [114, 53],  // 差別 → 社会問題
  [52, 53],   // ジャーナリズム → 社会問題
  [45, 53],   // 論争 → 社会問題

  // Work/career → 現代劇
  [32, 109],  // ビジネス → 現代劇
  [34, 109],  // 会社 → 現代劇
  [96, 13],   // 小説家 → 評伝

  // Sport/competition
  [94, 109],  // スポーツ → 現代劇
  [113, 109], // 野球 → 現代劇
  [77, 109],  // 競技 → 現代劇

  // Entertainment
  [59, 109],  // アイドル → 現代劇
  [87, 21],   // 童謡 → 音楽劇

  // Misc
  [58, 16],   // 宇宙 → SF
  [44, 16],   // 科学 → SF
  [99, 109],  // 研究 → 現代劇
  [100, 13],  // 宮沢賢治 → 評伝
  [65, 63],   // 星 → ファンタジー
  [82, 109],  // 夏 → 現代劇
  [83, 109],  // 満月 → 現代劇
  [68, 109],  // 読書 → 現代劇
  [103, 109], // 猫 → 現代劇
  [66, 11],   // 旅人 → ヒューマンドラマ
  // [38, 109],  // 離島 → 残す（場所系）
  [35, 11],   // サクセスストーリー → ヒューマンドラマ
  [31, 27],   // 教育 → 学校
  [39, 109],  // エロティック → 現代劇
];

// Categories to simply delete (0 posts)
const DELETE_EMPTY: number[] = [98, 5, 62, 117, 61];

// Categories that stay as-is but are small (kept for valid reasons):
// 20: LGBT (1 post - valid identity category)
// 116: 高校演劇 (1 post - valid, can grow)
// 115: 一人芝居 (1 post - valid performance style)
// 48: アウトロー (1 post - keep for now)
// 85: 演劇部 (1 post - keep)
// 70: 地方 (will have 3 posts after merge)
// 119: 朗読劇 (2 posts - valid form)
// 74: 歌 (2 posts - valid)
// 3: 新人戯曲賞 (2 posts - valid award)
// 15: ミュージカル (3 posts - valid genre)
// 41: 芸術 (3 posts - valid)
// 88: 古典 (3 posts - valid genre)
// 120: 群像劇 (1 post - valid dramatic form)

async function main() {
  console.log('=== Category Consolidation ===\n');

  let mergeCount = 0;
  let deleteCount = 0;
  let postsMoved = 0;

  // Process merges
  for (const [sourceId, targetId] of MERGES) {
    const source = await prisma.category.findUnique({
      where: { id: sourceId },
      select: { name: true },
    });
    const target = await prisma.category.findUnique({
      where: { id: targetId },
      select: { name: true },
    });

    if (!source) {
      console.log(`Skip: source ${sourceId} not found`);
      continue;
    }
    if (!target) {
      console.log(`Skip: target ${targetId} not found (for source ${source.name})`);
      continue;
    }

    // Get posts currently in source category
    const sourceWithPosts = await prisma.category.findUnique({
      where: { id: sourceId },
      select: { posts: { select: { id: true } } },
    });

    const postIds = sourceWithPosts?.posts.map((p) => p.id) || [];

    if (postIds.length > 0) {
      // Move each post: connect to target, disconnect from source
      for (const postId of postIds) {
        await prisma.post.update({
          where: { id: postId },
          data: {
            categories: {
              connect: { id: targetId },
              disconnect: { id: sourceId },
            },
          },
        });
      }
      console.log(
        `Merged: ${source.name}(${sourceId}) → ${target.name}(${targetId}) [${postIds.length} posts]`
      );
      postsMoved += postIds.length;
    } else {
      console.log(
        `Merged: ${source.name}(${sourceId}) → ${target.name}(${targetId}) [0 posts, delete only]`
      );
    }

    // Delete source category
    await prisma.category.delete({ where: { id: sourceId } });
    mergeCount++;
  }

  // Delete empty categories (0 posts)
  for (const id of DELETE_EMPTY) {
    const cat = await prisma.category.findUnique({
      where: { id },
      select: { name: true, _count: { select: { posts: true } } },
    });
    if (!cat) {
      console.log(`Skip: empty category ${id} not found`);
      continue;
    }
    if (cat._count.posts > 0) {
      console.log(
        `WARNING: Skipping ${cat.name}(${id}) - expected 0 posts but has ${cat._count.posts}`
      );
      continue;
    }
    await prisma.category.delete({ where: { id } });
    console.log(`Deleted empty: ${cat.name}(${id})`);
    deleteCount++;
  }

  console.log(`\nDone: ${mergeCount} merged, ${deleteCount} deleted, ${postsMoved} posts moved`);

  // Show remaining categories
  const remaining = await prisma.category.findMany({
    select: { id: true, name: true, _count: { select: { posts: true } } },
    orderBy: { posts: { _count: 'desc' } },
  });
  console.log(`\n=== Remaining Categories (${remaining.length}) ===`);
  remaining.forEach((c) => console.log(`${c.id}\t${c._count.posts}\t${c.name}`));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
