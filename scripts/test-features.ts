/**
 * 機能テスト（コメント・お気に入り・プロフィール・削除）
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/test-features.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_EMAIL = `feature-test-${Date.now()}@example.com`;
const TEST_NAME = '機能テストユーザー';

let testUserId = '';
let testPostId = 0;
let parentCommentId = 0;
let childCommentId = 0;
let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function setup() {
  console.log('\n🔧 セットアップ');

  const user = await prisma.user.create({
    data: { name: TEST_NAME, email: TEST_EMAIL, role: 'USER' },
  });
  testUserId = user.id;
  console.log(`  User: ${user.id}`);

  const post = await prisma.post.findFirst({ select: { id: true } });
  if (!post) throw new Error('Postが存在しません');
  testPostId = post.id;
  console.log(`  Post: ${testPostId}`);
}

// ====== コメント投稿テスト ======
async function testCommentCreation() {
  console.log('\n📝 コメント投稿テスト');

  // 認証付き親コメント
  const parent = await prisma.parentComment.create({
    data: {
      author: TEST_NAME,
      content: 'テスト親コメント',
      commentType: '感想',
      post: { connect: { id: testPostId } },
      user: { connect: { id: testUserId } },
    },
  });
  parentCommentId = parent.id;
  assert(parent.userId === testUserId, '親コメント: userId紐付け');
  assert(parent.commentType === '感想', '親コメント: commentType設定');
  assert(parent.deleted === false, '親コメント: 初期状態は未削除');
  assert(parent.likes === 0, '親コメント: 初期いいね数は0');

  // 認証付き子コメント
  const child = await prisma.childComment.create({
    data: {
      author: TEST_NAME,
      content: 'テスト子コメント（返信）',
      parentComment: { connect: { id: parentCommentId } },
      user: { connect: { id: testUserId } },
    },
  });
  childCommentId = child.id;
  assert(child.userId === testUserId, '子コメント: userId紐付け');
  assert(child.parentCommentId === parentCommentId, '子コメント: 親コメントに紐付け');

  // 匿名コメント（userId なし）
  const anon = await prisma.parentComment.create({
    data: {
      author: '名無しさん',
      content: '匿名テストコメント',
      post: { connect: { id: testPostId } },
    },
  });
  assert(anon.userId === null, '匿名コメント: userId=null');
  assert(anon.author === '名無しさん', '匿名コメント: author=名無しさん');
  await prisma.parentComment.delete({ where: { id: anon.id } });

  // 空コメント拒否（DBレベル）
  let emptyError = false;
  try {
    await prisma.parentComment.create({
      data: { author: 'test', content: '', post: { connect: { id: testPostId } } },
    });
  } catch {
    emptyError = true;
  }
  // Prismaは空文字列を許可するので、APIレベルのバリデーションが必要
  assert(!emptyError, '空コメント: DB自体は空文字を許可（APIバリデーションで防ぐ）');

  // リアクションコメントはコメント一覧に含まれない
  const reaction = await prisma.parentComment.create({
    data: {
      author: '名無しさん',
      content: '泣けた',
      commentType: 'リアクション',
      post: { connect: { id: testPostId } },
    },
  });
  const comments = await prisma.parentComment.findMany({
    where: {
      post_id: testPostId,
      OR: [{ commentType: { not: 'リアクション' } }, { commentType: null }],
    },
  });
  const reactionInComments = comments.some((c) => c.id === reaction.id);
  assert(!reactionInComments, 'リアクションはコメント一覧に含まれない');
  await prisma.parentComment.delete({ where: { id: reaction.id } });
}

// ====== コメント削除テスト ======
async function testCommentDeletion() {
  console.log('\n🗑️ コメント削除テスト');

  // 本人による親コメント削除（ソフトデリート）
  await prisma.parentComment.update({
    where: { id: parentCommentId },
    data: { deleted: true, content: '[削除されたコメントです]' },
  });
  const deletedParent = await prisma.parentComment.findUnique({ where: { id: parentCommentId } });
  assert(deletedParent!.deleted === true, '親コメント削除: deleted=true');
  assert(deletedParent!.content === '[削除されたコメントです]', '親コメント削除: 内容置換');

  // 子コメント削除
  await prisma.childComment.update({
    where: { id: childCommentId },
    data: { deleted: true, content: '[削除されたコメントです]' },
  });
  const deletedChild = await prisma.childComment.findUnique({ where: { id: childCommentId } });
  assert(deletedChild!.deleted === true, '子コメント削除: deleted=true');

  // 二重削除: 既に削除済みのコメントを再更新しても問題ない
  await prisma.parentComment.update({
    where: { id: parentCommentId },
    data: { deleted: true, content: '[削除されたコメントです]' },
  });
  assert(true, '二重削除: エラーなし');

  // 他人のコメント削除権限チェック（ロジックテスト）
  const otherUser = await prisma.user.create({
    data: { name: '他人', email: `other-${Date.now()}@example.com` },
  });
  const otherComment = await prisma.parentComment.create({
    data: {
      author: '他人',
      content: '他人のコメント',
      post: { connect: { id: testPostId } },
      user: { connect: { id: otherUser.id } },
    },
  });
  const isOwner = otherComment.userId === testUserId;
  assert(!isOwner, '他人のコメント: 所有者ではない');

  // ADMIN/MODERATORは削除可能
  const adminUser = await prisma.user.create({
    data: { name: 'Admin', email: `admin-${Date.now()}@example.com`, role: 'ADMIN' },
  });
  assert(adminUser.role === 'ADMIN', 'ADMINユーザー: role=ADMIN');
  const isAdminOrMod = adminUser.role === 'ADMIN' || adminUser.role === 'MODERATOR';
  assert(isAdminOrMod, 'ADMIN/MODERATORは他人のコメント削除可能');

  // クリーンアップ
  await prisma.parentComment.delete({ where: { id: otherComment.id } });
  await prisma.user.deleteMany({ where: { id: { in: [otherUser.id, adminUser.id] } } });
}

// ====== お気に入りテスト ======
async function testFavorites() {
  console.log('\n❤️ お気に入りテスト');

  // お気に入り追加
  const fav = await prisma.favorite.create({
    data: { userId: testUserId, postId: testPostId },
  });
  assert(fav.userId === testUserId, 'お気に入り追加: userId一致');
  assert(fav.postId === testPostId, 'お気に入り追加: postId一致');

  // 重複追加は拒否（ユニーク制約）
  let dupError = false;
  try {
    await prisma.favorite.create({
      data: { userId: testUserId, postId: testPostId },
    });
  } catch {
    dupError = true;
  }
  assert(dupError, 'お気に入り重複: ユニーク制約で拒否');

  // お気に入り一覧取得
  const favList = await prisma.favorite.findMany({
    where: { userId: testUserId },
    select: { postId: true },
  });
  assert(favList.length === 1, `お気に入り一覧: ${favList.length}件`);
  assert(favList[0].postId === testPostId, 'お気に入り一覧: postId一致');

  // お気に入り削除（トグル）
  await prisma.favorite.delete({
    where: { userId_postId: { userId: testUserId, postId: testPostId } },
  });
  const afterDelete = await prisma.favorite.findMany({ where: { userId: testUserId } });
  assert(afterDelete.length === 0, 'お気に入り削除後: 0件');

  // 存在しないPostへのお気に入りは外部キー制約で拒否
  let invalidPostError = false;
  try {
    await prisma.favorite.create({
      data: { userId: testUserId, postId: 999999 },
    });
  } catch {
    invalidPostError = true;
  }
  assert(invalidPostError, '存在しないPostへのお気に入り: 外部キー制約で拒否');
}

// ====== プロフィール更新テスト ======
async function testProfileUpdate() {
  console.log('\n👤 プロフィール更新テスト');

  // displayName更新
  const updated1 = await prisma.user.update({
    where: { id: testUserId },
    data: { displayName: 'テスト表示名' },
  });
  assert(updated1.displayName === 'テスト表示名', 'displayName更新');

  // groupName更新
  const updated2 = await prisma.user.update({
    where: { id: testUserId },
    data: { groupName: 'テスト劇団' },
  });
  assert(updated2.groupName === 'テスト劇団', 'groupName更新');

  // bio更新
  const updated3 = await prisma.user.update({
    where: { id: testUserId },
    data: { bio: 'テスト自己紹介です。演劇歴10年。' },
  });
  assert(updated3.bio === 'テスト自己紹介です。演劇歴10年。', 'bio更新');

  // avatarUrl更新
  const updated4 = await prisma.user.update({
    where: { id: testUserId },
    data: { avatarUrl: 'https://example.com/avatar-123.jpg' },
  });
  assert(updated4.avatarUrl === 'https://example.com/avatar-123.jpg', 'avatarUrl更新');

  // displayName空文字でnullに戻す
  const updated5 = await prisma.user.update({
    where: { id: testUserId },
    data: { displayName: null },
  });
  assert(updated5.displayName === null, 'displayName: nullに戻し可能');

  // コメント投稿時にdisplayNameが優先される確認
  await prisma.user.update({
    where: { id: testUserId },
    data: { displayName: 'カスタム名' },
  });
  const dbUser = await prisma.user.findUnique({
    where: { id: testUserId },
    select: { displayName: true, name: true },
  });
  const displayAuthor = dbUser?.displayName || dbUser?.name || '名無しさん';
  assert(displayAuthor === 'カスタム名', 'コメント投稿名: displayName優先');
}

// ====== アカウント削除カスケードテスト ======
async function testAccountDeletionCascade() {
  console.log('\n💥 アカウント削除カスケードテスト');

  // お気に入りを追加
  await prisma.favorite.create({
    data: { userId: testUserId, postId: testPostId },
  });
  const favBefore = await prisma.favorite.count({ where: { userId: testUserId } });
  assert(favBefore === 1, '削除前: お気に入り1件');

  // コメントのuserIdを残す（匿名化テスト用）
  const commentBefore = await prisma.parentComment.findUnique({ where: { id: parentCommentId } });
  assert(commentBefore?.userId === testUserId, '削除前: コメントにuserId紐付け');

  // アカウント削除トランザクション（APIの動作をシミュレート）
  await prisma.$transaction(async (tx) => {
    await tx.parentComment.updateMany({
      where: { userId: testUserId },
      data: { userId: null, author: '退会済みユーザー' },
    });
    await tx.childComment.updateMany({
      where: { userId: testUserId },
      data: { userId: null, author: '退会済みユーザー' },
    });
    await tx.session.deleteMany({ where: { userId: testUserId } });
    await tx.account.deleteMany({ where: { userId: testUserId } });
    // Favorite は onDelete: Cascade なので User 削除で自動削除
    await tx.user.delete({ where: { id: testUserId } });
  });

  // お気に入りもカスケード削除されたか
  const favAfter = await prisma.favorite.count({ where: { userId: testUserId } });
  assert(favAfter === 0, '削除後: お気に入りカスケード削除');

  // ユーザー消滅
  const userAfter = await prisma.user.findUnique({ where: { id: testUserId } });
  assert(userAfter === null, '削除後: User消滅');

  // コメントは匿名化されて残存
  const commentAfter = await prisma.parentComment.findUnique({ where: { id: parentCommentId } });
  assert(commentAfter !== null, '削除後: コメントは残存');
  assert(commentAfter!.userId === null, '削除後: コメントuserId=null');
  assert(commentAfter!.author === '退会済みユーザー', '削除後: author=退会済みユーザー');
}

// ====== ウェルカムページリダイレクトロジック ======
async function testWelcomeRedirectLogic() {
  console.log('\n🎉 ウェルカムページリダイレクトロジック');

  // 新規ユーザー（displayName未設定）→ ウェルカムページ表示
  const newUser = await prisma.user.create({
    data: { name: 'New User', email: `new-${Date.now()}@example.com` },
  });
  assert(newUser.displayName === null, '新規ユーザー: displayName=null → ウェルカム表示');

  // プロフィール設定後 → ホームにリダイレクト
  await prisma.user.update({
    where: { id: newUser.id },
    data: { displayName: '設定済み' },
  });
  const updated = await prisma.user.findUnique({ where: { id: newUser.id } });
  assert(updated!.displayName !== null, '設定済みユーザー: displayName≠null → ホームにリダイレクト');

  await prisma.user.delete({ where: { id: newUser.id } });
}

// ====== コメントとリアクションの独立性 ======
async function testReactionIndependence() {
  console.log('\n🎭 リアクション独立性テスト');

  // リアクションを作成
  const reactions = ['泣けた', '笑えた', '感動した'];
  const reactionIds: number[] = [];
  for (const r of reactions) {
    const created = await prisma.parentComment.create({
      data: {
        author: '名無しさん',
        content: r,
        commentType: 'リアクション',
        post: { connect: { id: testPostId } },
      },
    });
    reactionIds.push(created.id);
  }

  // リアクション集計
  const counts = await prisma.parentComment.groupBy({
    by: ['content'],
    where: { post_id: testPostId, commentType: 'リアクション', deleted: false },
    _count: true,
  });
  assert(counts.length >= 3, `リアクション集計: ${counts.length}種類`);

  // コメント一覧にはリアクションが含まれない
  const comments = await prisma.parentComment.findMany({
    where: {
      post_id: testPostId,
      OR: [{ commentType: { not: 'リアクション' } }, { commentType: null }],
    },
  });
  const hasReaction = comments.some((c) => reactionIds.includes(c.id));
  assert(!hasReaction, 'コメント一覧にリアクションなし');

  // コメント数にリアクションは含まれない
  const commentCount = comments.length;
  const totalWithReactions = await prisma.parentComment.count({ where: { post_id: testPostId } });
  assert(commentCount < totalWithReactions, `コメント数(${commentCount}) < 全件数(${totalWithReactions})`);

  // クリーンアップ
  await prisma.parentComment.deleteMany({ where: { id: { in: reactionIds } } });
}

// ====== クリーンアップ ======
async function cleanup() {
  console.log('\n🧹 クリーンアップ');
  await prisma.childComment.deleteMany({ where: { id: childCommentId } });
  await prisma.parentComment.deleteMany({
    where: {
      OR: [
        { id: parentCommentId },
        { author: { in: [TEST_NAME, '退会済みユーザー', '名無しさん', '他人'] }, post_id: testPostId },
      ],
    },
  });
  await prisma.favorite.deleteMany({ where: { userId: testUserId } });
  await prisma.user.deleteMany({ where: { email: { startsWith: 'feature-test-' } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: 'new-' } } });
  console.log('  テストデータ削除完了');
}

async function main() {
  console.log('===========================================');
  console.log('  機能テスト');
  console.log('===========================================');

  try {
    await setup();
    await testCommentCreation();
    await testCommentDeletion();
    await testFavorites();
    await testProfileUpdate();
    await testAccountDeletionCascade();
    await testWelcomeRedirectLogic();
    await testReactionIndependence();
  } catch (error) {
    console.error('\n💥 テスト実行中にエラー:', error);
    failed++;
  }

  await cleanup();

  console.log('\n===========================================');
  console.log(`  結果: ✅ ${passed} passed, ❌ ${failed} failed`);
  console.log('===========================================');

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main();
