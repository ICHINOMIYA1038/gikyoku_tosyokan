/**
 * 早稲田メタデータ → 戯曲図書館DB カテゴリインポートスクリプト
 *
 * 安全ポリシー:
 * - INSERT ONLY（既存のPost-Category関係は一切削除しない）
 * - 同じPost-Categoryの組み合わせが既にあればスキップ
 * - ドライラン対応（--dry-run フラグ）
 */

const fs = require('fs');
const DRY_RUN = process.argv.includes('--dry-run');

// ジャンルマッピング: 早稲田ジャンル → 既存カテゴリID
const GENRE_MAP = {
  // 既存カテゴリへのマッピング
  '喜劇': 14,             // コメディ
  'ハートフル・コメディ': 14,
  'コント': 14,
  '家族もの': 12,          // 家族
  '学園モノ': 27,          // 学校
  '音楽劇': 21,            // 音楽劇
  '歌入り芝居': 21,
  '歌物語': 21,
  '泣ける': 46,            // 泣ける
  '第二次世界大戦': 24,     // 戦争
  '戦記': 24,
  '反戦劇': 24,
  '評伝劇': 13,            // 評伝
  '現代劇': 109,           // 現代劇
  '時代劇': 19,            // 時代劇
  '歴史劇': 29,            // 歴史
  '不条理劇': 18,          // 不条理劇
  'ホラー': 17,            // ホラー
  '悲劇': 90,              // 悲劇
  'ドラマ': 11,            // ヒューマンドラマ
  '人情劇': 22,            // 人情物（ID 22 ではなく確認必要）
  'SF・近未来': 16,        // SF
  '政治・社会問題': 53,    // 社会問題
  '社会風刺': 53,
  '原発闘争': 53,
  '少年犯罪': 53,
  'ポストドラマ演劇': 57,  // アングラ（近い概念）
  'アヴァンギャルド・前衛': 57,
  '女性の一人芝居': null,  // 新規作成
  '一人芝居': null,
  '高校演劇': null,
  '短編集': null,
  '翻案戯曲': null,
  '朗読劇': null,
  'お茶の間': null,
  '伝奇ロマン': 36,        // 伝奇
  'ギリシア劇': 88,        // 古典
  '歌舞伎': 88,
  '幻想劇': 56,            // 幻想
  '児童青少年演劇': null,
  '群像劇': null,
  '市民劇': null,
  'ナンセンス': 108,        // ナンセンス
  '殺陣あり': 9,            // アクション
  '青春': 72,              // 青春
  '東日本大震災をテーマにした作品': 106, // 震災
  '震災': 106,
  '東日本大震災を題材としている': 106,
  '震災物(阪神淡路大震災)': 106,
  'おとぎ話': 63,          // ファンタジー
  'ダークファンタジー': 63,
  'エロティック': 39,      // エロティック
  'アート': 41,            // 芸術
  'ミステリー': 75,        // ミステリー
  '女性一人芝居／脳死・人工授精・家族': null,
  '旧約聖書「ヨブ記」の翻案劇': null,
  'キャスト年齢設定高い（シルバー）': null,
  '第4回 近松門左衛門賞 受賞': null,
  '関西弁': null,
  '熊本方言': null,
};

// null → 新規作成が必要なジャンル名
const NEW_CATEGORIES = [
  '一人芝居',
  '高校演劇',
  '短編集',
  '翻案戯曲',
  '朗読劇',
  '群像劇',
];

// スキップするジャンル（カテゴリにしない）
const SKIP_GENRES = new Set([
  'お茶の間',              // 曖昧すぎる
  '女性一人芝居／脳死・人工授精・家族', // 複合的すぎる
  '旧約聖書「ヨブ記」の翻案劇',        // 作品固有
  'キャスト年齢設定高い（シルバー）',   // 属性
  '第4回 近松門左衛門賞 受賞',         // 賞は別管理
  '関西弁',                // 方言は除外済み
  '熊本方言',
  '女性の一人芝居',        // → 一人芝居に統合
  '市民劇',                // 曖昧
  '児童青少年演劇',        // → 新規追加の価値低い（1件）
]);

// 統合マッピング（スキップ対象を一人芝居等に統合）
const MERGE_MAP = {
  '女性の一人芝居': '一人芝居',
  '女性一人芝居／脳死・人工授精・家族': null, // スキップ
};

async function main() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // 1. 早稲田メタデータ読み込み
    const wasedaData = JSON.parse(fs.readFileSync('/tmp/gikyoku-metatags-clean.json', 'utf8'));
    console.log(`=== カテゴリインポート${DRY_RUN ? '（ドライラン）' : ''} ===`);
    console.log(`早稲田データ: ${wasedaData.length} 件`);

    // 2. 既存データ取得
    const existingPosts = await prisma.post.findMany({
      select: { id: true, title: true, categories: { select: { id: true, name: true } } }
    });
    const existingCategories = await prisma.category.findMany({
      select: { id: true, name: true }
    });

    const postByTitle = new Map(existingPosts.map(p => [p.title.trim(), p]));
    const categoryByName = new Map(existingCategories.map(c => [c.name.trim(), c.id]));

    console.log(`既存Posts: ${existingPosts.length}`);
    console.log(`既存Categories: ${existingCategories.length}`);
    console.log('');

    // 3. 新規カテゴリ作成
    let newCatCount = 0;
    for (const name of NEW_CATEGORIES) {
      if (categoryByName.has(name)) {
        console.log(`  カテゴリ既存: ${name} (ID: ${categoryByName.get(name)})`);
        continue;
      }
      if (DRY_RUN) {
        console.log(`  [DRY] 新規カテゴリ: ${name}`);
        newCatCount++;
      } else {
        const created = await prisma.category.create({ data: { name } });
        categoryByName.set(name, created.id);
        console.log(`  カテゴリ作成: ${name} (ID: ${created.id})`);
        newCatCount++;
      }
    }
    console.log(`新規カテゴリ: ${newCatCount} 件`);
    console.log('');

    // 4. 最終的なジャンル→カテゴリID マッピング構築
    const finalMap = {};
    for (const [genre, catId] of Object.entries(GENRE_MAP)) {
      if (SKIP_GENRES.has(genre)) continue;
      if (MERGE_MAP[genre] !== undefined) {
        if (MERGE_MAP[genre] === null) continue;
        const mergedId = categoryByName.get(MERGE_MAP[genre]);
        if (mergedId) finalMap[genre] = mergedId;
        continue;
      }
      if (catId !== null) {
        finalMap[genre] = catId;
      } else {
        // NEW_CATEGORIESで作成済み
        const id = categoryByName.get(genre);
        if (id) finalMap[genre] = id;
      }
    }

    // 人情劇の修正（IDを確認）
    // 人情物 のIDを確認
    const jinjoId = categoryByName.get('人情物');
    if (jinjoId) {
      finalMap['人情劇'] = jinjoId;
    }

    console.log('--- ジャンルマッピング ---');
    for (const [genre, catId] of Object.entries(finalMap)) {
      const catName = existingCategories.find(c => c.id === catId)?.name || '(新規)';
      console.log(`  ${genre} → #${catId} ${catName}`);
    }
    console.log('');

    // 5. Post-Category 関係をINSERT
    let matchCount = 0;
    let noMatchCount = 0;
    let linkCount = 0;
    let skipCount = 0;
    let freeTagCount = 0;
    let archiveTagCount = 0;

    const FREE_CAT_ID = 4;       // 無料で読める！
    const ARCHIVE_CAT_ID = 112;  // 戯曲デジタルアーカイブ

    for (const w of wasedaData) {
      const post = postByTitle.get(w.title?.trim());
      if (!post) {
        noMatchCount++;
        continue;
      }
      matchCount++;

      const existingCatIds = new Set(post.categories.map(c => c.id));
      const categoriesToAdd = new Set();

      // 無料URL → #4 無料で読める！ + #112 戯曲デジタルアーカイブ
      if (w.hasFreeUrl) {
        if (!existingCatIds.has(FREE_CAT_ID)) categoriesToAdd.add(FREE_CAT_ID);
        if (!existingCatIds.has(ARCHIVE_CAT_ID)) categoriesToAdd.add(ARCHIVE_CAT_ID);
      }

      // ジャンル → カテゴリ
      for (const genre of w.genres) {
        const catId = finalMap[genre];
        if (catId && !existingCatIds.has(catId)) {
          categoriesToAdd.add(catId);
        }
      }

      if (categoriesToAdd.size === 0) {
        skipCount++;
        continue;
      }

      if (DRY_RUN) {
        const catNames = [...categoriesToAdd].map(id => {
          const name = existingCategories.find(c => c.id === id)?.name ||
                       NEW_CATEGORIES.find(n => categoryByName.get(n) === id) || '?';
          return `#${id} ${name}`;
        });
        console.log(`  ${w.title} → +${catNames.join(', ')}`);
      } else {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            categories: {
              connect: [...categoriesToAdd].map(id => ({ id }))
            }
          }
        });
      }

      if (w.hasFreeUrl && categoriesToAdd.has(FREE_CAT_ID)) freeTagCount++;
      if (w.hasFreeUrl && categoriesToAdd.has(ARCHIVE_CAT_ID)) archiveTagCount++;
      linkCount += categoriesToAdd.size;
    }

    console.log('');
    console.log(`=== 結果 ===`);
    console.log(`タイトル一致: ${matchCount} 件`);
    console.log(`タイトル不一致: ${noMatchCount} 件`);
    console.log(`カテゴリ追加: ${linkCount} 件`);
    console.log(`  うち無料で読める！: ${freeTagCount} 件`);
    console.log(`  うち戯曲デジタルアーカイブ: ${archiveTagCount} 件`);
    console.log(`スキップ（変更なし）: ${skipCount} 件`);
    console.log(`新規カテゴリ: ${newCatCount} 件`);

    if (!DRY_RUN) {
      // 最終確認
      const finalCats = await prisma.category.findMany({
        select: { id: true, name: true, _count: { select: { posts: true } } },
        orderBy: { _count: { posts: 'desc' } }
      });
      console.log('\n--- カテゴリ別Post数（上位20） ---');
      finalCats.slice(0, 20).forEach(c => {
        console.log(`  #${c.id} ${c.name}: ${c._count.posts}`);
      });
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
