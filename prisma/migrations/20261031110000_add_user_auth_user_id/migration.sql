-- 戯曲 ID（Supabase Auth）の利用者 ID を public.User に結びつける列。
-- 正本は Supabase の auth.users.id（uuid）。既存の 86 人は初回ログイン時に埋めるので NULL 可。
ALTER TABLE "User" ADD COLUMN "authUserId" UUID;

CREATE UNIQUE INDEX "User_authUserId_key" ON "User"("authUserId");
