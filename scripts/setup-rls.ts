/**
 * Supabase RLS（行レベルセキュリティ）設定スクリプト
 *
 * Prisma経由のサーバーサイドアクセスはpostgresユーザー（service_role相当）なので
 * RLSをバイパスする。一方、anon keyでの直接アクセスは全拒否。
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/setup-rls.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SENSITIVE_TABLES = [
  'User',
  'Account',
  'Session',
  'VerificationToken',
  'Message',
  'Conversation',
  'Application',
  'Report',
  'Favorite',
  'SearchHistory',
];

const PUBLIC_READ_TABLES = [
  'Post',
  'Author',
  'Category',
  'News',
  'BlogPost',
  'TheaterGroup',
  'Recruitment',
  'Announcement',
  'ParentComment',
  'ChildComment',
];

async function main() {
  console.log('=== RLS設定 ===\n');

  // 1. 機密テーブル: RLS ON + anon全拒否
  for (const table of SENSITIVE_TABLES) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY`);
      // 既存ポリシーがあれば削除
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "deny_anon_all" ON "public"."${table}"`);
      // anonロールからの全アクセスを拒否（Prismaのpostgresユーザーはバイパス）
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "deny_anon_all" ON "public"."${table}"
        FOR ALL
        TO anon
        USING (false)
      `);
      console.log(`  🔒 ${table}: RLS ON, anon全拒否`);
    } catch (e: any) {
      console.log(`  ⚠️ ${table}: ${e.message?.substring(0, 80)}`);
    }
  }

  // 2. 公開テーブル: RLS ON + anon読み取りのみ許可
  for (const table of PUBLIC_READ_TABLES) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "public"."${table}" ENABLE ROW LEVEL SECURITY`);
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "anon_read_only" ON "public"."${table}"`);
      await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "deny_anon_write" ON "public"."${table}"`);
      // anon: SELECT のみ許可
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "anon_read_only" ON "public"."${table}"
        FOR SELECT
        TO anon
        USING (true)
      `);
      // anon: INSERT/UPDATE/DELETE は拒否
      await prisma.$executeRawUnsafe(`
        CREATE POLICY "deny_anon_write" ON "public"."${table}"
        FOR ALL
        TO anon
        USING (false)
        WITH CHECK (false)
      `);
      console.log(`  📖 ${table}: RLS ON, anon読み取りのみ`);
    } catch (e: any) {
      console.log(`  ⚠️ ${table}: ${e.message?.substring(0, 80)}`);
    }
  }

  // 3. 確認
  console.log('\n=== RLS確認 ===');
  const result = await prisma.$queryRaw<Array<{ tablename: string; rowsecurity: boolean }>>`
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;
  const onCount = result.filter((r) => r.rowsecurity).length;
  const offCount = result.filter((r) => !r.rowsecurity).length;
  console.log(`  ON: ${onCount}テーブル, OFF: ${offCount}テーブル`);

  const offTables = result.filter((r) => !r.rowsecurity).map((r) => r.tablename);
  if (offTables.length > 0) {
    console.log(`  OFF: ${offTables.join(', ')}`);
  }

  console.log('\n=== 完了 ===');
  console.log('Prisma (postgres user) はRLSをバイパスするため、サーバーサイドの動作に影響なし。');
  console.log('anon keyでの直接アクセスは機密テーブルが全拒否、公開テーブルが読み取りのみ。');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('エラー:', e);
  process.exit(1);
});
