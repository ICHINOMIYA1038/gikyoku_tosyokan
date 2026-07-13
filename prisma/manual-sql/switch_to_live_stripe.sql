-- ============================================================
-- Stripe 本番モード切替時に手動実行するクリーンアップ SQL
-- ============================================================
-- 背景: サンドボックス鍵で本番稼働していた期間、test mode の
--       Customer ID / Subscription ID が本番 User テーブルに残っている。
--       Stripe の test/live 環境は ID 空間が分離しているため、
--       これを放置すると customers.retrieve / billingPortal.sessions.create
--       が「No such customer」で失敗する。
--
-- 実行タイミング:
--   1. Vercel 環境変数を sk_live_ / whsec_(本番) / price_(本番) に置き換え
--   2. Vercel でリデプロイ実行
--   3. 本 SQL を **リデプロイ完了直後** に本番 DB で実行
--   4. 影響ユーザー(=これまでテスト決済で Pro になっていた運用者本人)は
--      改めて /pro から本番 Checkout を叩き直して Pro を有効化する
--
-- 安全性: destructive (test 期間の Stripe 紐付けを消す) だが、
--         Stripe 側のサブスク自体はここでは変えない。DB の紐付けだけ。
--         test 側の subscription はサンドボックスダッシュボードで別途削除可能。
--
-- 実行方法 (例):
--   cd gikyoku_tosyokan
--   URL=$(grep '^POSTGRES_URL_NON_POOLING=' .env.local | sed 's/^POSTGRES_URL_NON_POOLING=//; s/^"//; s/"$//')
--   psql "$URL" -f prisma/migrations/manual/switch_to_live_stripe.sql
-- ============================================================

BEGIN;

-- 対象確認: 実行前にこの結果を目視で確認すること
SELECT id, email, "tomoshibiPlan", "stripeCustomerId", "stripeSubscriptionId"
FROM "User"
WHERE "stripeCustomerId" IS NOT NULL OR "stripeSubscriptionId" IS NOT NULL;

-- クリーンアップ実行
UPDATE "User"
SET
  "tomoshibiPlan" = 'free',
  "tomoshibiPlanExpiresAt" = NULL,
  "stripeCustomerId" = NULL,
  "stripeSubscriptionId" = NULL
WHERE "stripeCustomerId" IS NOT NULL
   OR "stripeSubscriptionId" IS NOT NULL;

-- Idempotency ログもクリアしておく (test 期間のイベント ID を消して live で衝突防止)
DELETE FROM "StripeEvent";

-- 影響件数の確認
SELECT COUNT(*) AS remaining_stripe_users
FROM "User"
WHERE "stripeCustomerId" IS NOT NULL;

-- 問題なさそうなら COMMIT に書き換えて再実行、または明示的に COMMIT する。
ROLLBACK; -- ← 意図せぬ実行を防ぐデフォルト。実行時は手動で COMMIT に変更すること。
