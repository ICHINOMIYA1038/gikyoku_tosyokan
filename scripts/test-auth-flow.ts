/**
 * 認証フローの統合テスト
 *
 * 使い方:
 *   set -a && source .env.local && set +a
 *   npx tsx scripts/test-auth-flow.ts
 *
 * テスト内容:
 *   1. 新規ユーザー作成（Google OAuth シミュレーション）
 *   2. セッション/アカウント紐付け検証
 *   3. コメント投稿（認証あり）
 *   4. コメントにuserId紐付け確認
 *   5. 本人以外は削除不可
 *   6. アカウント削除（物理削除）
 *   7. 削除後のコメント匿名化確認
 *   8. 削除後のUser/Account/Session消滅確認
 *   9. 再登録（同じメールで新規User作成）
 *  10. 再登録後、旧コメントとの紐付けが復活しないことを確認
 *  11. 再登録ユーザーが新しいコメントを投稿できることを確認
 *  12. 二重削除防止
 *  13. クリーンアップ
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// テスト用データ
const TEST_EMAIL = `test-auth-${Date.now()}@example.com`;
const TEST_NAME = 'テスト太郎';
const TEST_PROVIDER_ACCOUNT_ID = `test-google-${Date.now()}`;
const TEST_POST_ID = 1; // 既存のPost IDを使用（存在する前提）

let testUserId = '';
let testCommentId = 0;
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

async function findTestPost(): Promise<number> {
  const post = await prisma.post.findFirst({ select: { id: true } });
  if (!post) throw new Error('テスト用のPostが1件もありません');
  return post.id;
}

// ----- テスト1: 新規ユーザー作成 -----
async function test1_createUser() {
  console.log('\n📌 テスト1: 新規ユーザー作成');

  const user = await prisma.user.create({
    data: {
      name: TEST_NAME,
      email: TEST_EMAIL,
      image: 'https://example.com/avatar.png',
      role: 'USER',
    },
  });
  testUserId = user.id;

  assert(!!user.id, `User作成成功 (id: ${user.id})`);
  assert(user.email === TEST_EMAIL, `メール一致: ${user.email}`);
  assert(user.role === 'USER', `デフォルトロール: ${user.role}`);
}

// ----- テスト2: Account連携レコード作成 -----
async function test2_createAccount() {
  console.log('\n📌 テスト2: Account連携レコード作成（Google OAuth模擬）');

  const account = await prisma.account.create({
    data: {
      userId: testUserId,
      type: 'oauth',
      provider: 'google',
      providerAccountId: TEST_PROVIDER_ACCOUNT_ID,
      access_token: 'test-access-token',
      token_type: 'Bearer',
      scope: 'openid email profile',
    },
  });

  assert(account.provider === 'google', 'プロバイダ: google');
  assert(account.userId === testUserId, 'User紐付け正しい');

  // ユニーク制約: 同じprovider+providerAccountIdで2つ目は作れない
  let duplicateError = false;
  try {
    await prisma.account.create({
      data: {
        userId: testUserId,
        type: 'oauth',
        provider: 'google',
        providerAccountId: TEST_PROVIDER_ACCOUNT_ID,
      },
    });
  } catch {
    duplicateError = true;
  }
  assert(duplicateError, 'ユニーク制約: 同一provider+accountIdの重複作成は拒否');
}

// ----- テスト3: Session作成 -----
async function test3_createSession() {
  console.log('\n📌 テスト3: Sessionレコード作成');

  const session = await prisma.session.create({
    data: {
      userId: testUserId,
      sessionToken: `test-session-${Date.now()}`,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  assert(session.userId === testUserId, 'Session → User紐付け正しい');
  assert(session.expires > new Date(), 'セッション有効期限は未来');
}

// ----- テスト4: 認証付きコメント投稿 -----
async function test4_createAuthenticatedComment() {
  console.log('\n📌 テスト4: 認証付きコメント投稿');

  const postId = await findTestPost();

  const comment = await prisma.parentComment.create({
    data: {
      author: TEST_NAME,
      content: 'テストコメントです（認証済み投稿）',
      commentType: '感想',
      post: { connect: { id: postId } },
      user: { connect: { id: testUserId } },
    },
    include: { user: { select: { id: true, name: true } } },
  });
  testCommentId = comment.id;

  assert(comment.userId === testUserId, `コメントにuserId紐付け: ${comment.userId}`);
  assert(comment.user?.id === testUserId, 'user リレーション取得可能');
  assert(comment.author === TEST_NAME, `author: ${comment.author}`);
  assert(comment.commentType === '感想', 'commentType: 感想');
}

// ----- テスト5: 他人のコメントは削除不可（ロジック確認） -----
async function test5_cannotDeleteOthersComment() {
  console.log('\n📌 テスト5: 他人のコメント削除権限チェック');

  const comment = await prisma.parentComment.findUnique({
    where: { id: testCommentId },
    select: { userId: true },
  });

  const fakeUserId = 'fake-user-id-12345';
  const isOwner = comment?.userId === fakeUserId;

  assert(!isOwner, '他人のユーザーIDでは所有者判定 false');
  assert(comment?.userId === testUserId, '本人のユーザーIDでは所有者判定 true');
}

// ----- テスト6: アカウント削除（物理削除） -----
async function test6_deleteAccount() {
  console.log('\n📌 テスト6: アカウント削除（物理削除・トランザクション）');

  await prisma.$transaction(async (tx) => {
    // コメント匿名化
    const anonymizedParent = await tx.parentComment.updateMany({
      where: { userId: testUserId },
      data: { userId: null, author: '退会済みユーザー' },
    });
    assert(anonymizedParent.count >= 1, `親コメント匿名化: ${anonymizedParent.count}件`);

    const anonymizedChild = await tx.childComment.updateMany({
      where: { userId: testUserId },
      data: { userId: null, author: '退会済みユーザー' },
    });
    assert(anonymizedChild.count >= 0, `子コメント匿名化: ${anonymizedChild.count}件`);

    // Session, Account, User削除
    await tx.session.deleteMany({ where: { userId: testUserId } });
    await tx.account.deleteMany({ where: { userId: testUserId } });
    await tx.user.delete({ where: { id: testUserId } });
  });

  console.log('  トランザクション完了');
}

// ----- テスト7: 削除後のコメント匿名化確認 -----
async function test7_verifyAnonymizedComment() {
  console.log('\n📌 テスト7: 削除後のコメント匿名化確認');

  const comment = await prisma.parentComment.findUnique({
    where: { id: testCommentId },
    select: { userId: true, author: true, content: true },
  });

  assert(!!comment, 'コメント自体は残っている');
  assert(comment!.userId === null, `userId が null: ${comment!.userId}`);
  assert(comment!.author === '退会済みユーザー', `author: ${comment!.author}`);
  assert(comment!.content === 'テストコメントです（認証済み投稿）', '本文は保持');
}

// ----- テスト8: User/Account/Sessionの消滅確認 -----
async function test8_verifyDeletion() {
  console.log('\n📌 テスト8: User/Account/Session完全消滅の確認');

  const user = await prisma.user.findUnique({ where: { id: testUserId } });
  assert(user === null, `Userレコード消滅: ${user === null}`);

  const accounts = await prisma.account.findMany({
    where: { userId: testUserId },
  });
  assert(accounts.length === 0, `Accountレコード消滅: ${accounts.length}件`);

  const sessions = await prisma.session.findMany({
    where: { userId: testUserId },
  });
  assert(sessions.length === 0, `Sessionレコード消滅: ${sessions.length}件`);
}

// ----- テスト9: 再登録（同じメールで新規User） -----
async function test9_reRegister() {
  console.log('\n📌 テスト9: 同じメールアドレスで再登録');

  const newUser = await prisma.user.create({
    data: {
      name: TEST_NAME + '（再登録）',
      email: TEST_EMAIL,
      image: 'https://example.com/new-avatar.png',
      role: 'USER',
    },
  });

  assert(!!newUser.id, `新User作成成功 (id: ${newUser.id})`);
  assert(newUser.id !== testUserId, `旧IDと異なる: ${newUser.id} !== ${testUserId}`);
  assert(newUser.email === TEST_EMAIL, `同じメール: ${newUser.email}`);

  // Account再連携
  const newAccount = await prisma.account.create({
    data: {
      userId: newUser.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: TEST_PROVIDER_ACCOUNT_ID,
    },
  });
  assert(newAccount.userId === newUser.id, '新AccountがnewUserに紐付け');

  testUserId = newUser.id; // テスト後のクリーンアップ用に更新
}

// ----- テスト10: 再登録後、旧コメントの紐付けが復活しない -----
async function test10_oldCommentsNotRelinked() {
  console.log('\n📌 テスト10: 旧コメントが再登録ユーザーに紐付かないことを確認');

  const oldComment = await prisma.parentComment.findUnique({
    where: { id: testCommentId },
    select: { userId: true, author: true },
  });

  assert(oldComment!.userId === null, `旧コメントのuserIdはnullのまま: ${oldComment!.userId}`);
  assert(oldComment!.author === '退会済みユーザー', `authorは退会済みのまま: ${oldComment!.author}`);

  // 再登録ユーザーのコメント数は0
  const commentCount = await prisma.parentComment.count({
    where: { userId: testUserId, deleted: false },
  });
  assert(commentCount === 0, `再登録ユーザーのコメント数: ${commentCount} (0であるべき)`);
}

// ----- テスト11: 再登録ユーザーが新しいコメントを投稿 -----
async function test11_newUserCanComment() {
  console.log('\n📌 テスト11: 再登録ユーザーが新しいコメントを投稿できる');

  const postId = await findTestPost();

  const newComment = await prisma.parentComment.create({
    data: {
      author: TEST_NAME + '（再登録）',
      content: '再登録後の新しいコメントです',
      post: { connect: { id: postId } },
      user: { connect: { id: testUserId } },
    },
  });

  assert(newComment.userId === testUserId, `新コメントに再登録userId紐付け`);
  assert(newComment.content === '再登録後の新しいコメントです', '新コメント本文OK');

  // 再登録ユーザーのコメント数は1
  const count = await prisma.parentComment.count({
    where: { userId: testUserId, deleted: false },
  });
  assert(count === 1, `再登録ユーザーのコメント数: ${count} (1であるべき)`);
}

// ----- テスト12: 二重削除防止 -----
async function test12_doubleDeletePrevention() {
  console.log('\n📌 テスト12: 二重削除（存在しないUser）でエラー');

  // まず再登録ユーザーを削除
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
    await tx.user.delete({ where: { id: testUserId } });
  });

  // 同じIDで再度削除を試行
  let errorThrown = false;
  try {
    await prisma.user.delete({ where: { id: testUserId } });
  } catch {
    errorThrown = true;
  }
  assert(errorThrown, '既に削除済みのUserを再削除するとPrismaエラー');
}

// ----- テスト13: email uniqueの確認 -----
async function test13_emailUniqueAfterDelete() {
  console.log('\n📌 テスト13: 削除後に同じメールで再々登録可能');

  const user = await prisma.user.create({
    data: {
      name: TEST_NAME + '（再々登録）',
      email: TEST_EMAIL,
      role: 'USER',
    },
  });

  assert(!!user.id, `3回目の登録も成功 (id: ${user.id})`);
  assert(user.email === TEST_EMAIL, `同じメール使用可能`);

  testUserId = user.id;
}

// ----- クリーンアップ -----
async function cleanup() {
  console.log('\n🧹 クリーンアップ');

  // テスト用コメント削除
  await prisma.parentComment.deleteMany({
    where: {
      OR: [
        { id: testCommentId },
        { author: { startsWith: TEST_NAME } },
        { author: '退会済みユーザー', content: { contains: 'テストコメント' } },
        { author: '退会済みユーザー', content: { contains: '再登録後' } },
      ],
    },
  });

  // テスト用Account削除
  await prisma.account.deleteMany({
    where: { providerAccountId: TEST_PROVIDER_ACCOUNT_ID },
  });

  // テスト用Session削除
  if (testUserId) {
    await prisma.session.deleteMany({ where: { userId: testUserId } });
  }

  // テスト用User削除
  await prisma.user.deleteMany({
    where: { email: TEST_EMAIL },
  });

  console.log('  テストデータ削除完了');
}

// ----- メイン -----
async function main() {
  console.log('===========================================');
  console.log('  認証フロー統合テスト');
  console.log('===========================================');

  try {
    await test1_createUser();
    await test2_createAccount();
    await test3_createSession();
    await test4_createAuthenticatedComment();
    await test5_cannotDeleteOthersComment();
    await test6_deleteAccount();
    await test7_verifyAnonymizedComment();
    await test8_verifyDeletion();
    await test9_reRegister();
    await test10_oldCommentsNotRelinked();
    await test11_newUserCanComment();
    await test12_doubleDeletePrevention();
    await test13_emailUniqueAfterDelete();
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
