-- 検索パフォーマンス改善のためのインデックス

-- テキスト検索用のGINインデックス（PostgreSQL）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- タイトルと概要の検索用インデックス
CREATE INDEX IF NOT EXISTS "Post_title_gin_idx" ON "Post" USING gin ("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Post_synopsis_gin_idx" ON "Post" USING gin ("synopsis" gin_trgm_ops);

-- 作者名の検索用インデックス
CREATE INDEX IF NOT EXISTS "Author_name_gin_idx" ON "Author" USING gin ("name" gin_trgm_ops);

-- 数値範囲検索用の複合インデックス
CREATE INDEX IF NOT EXISTS "Post_man_woman_total_idx" ON "Post"("man", "woman", "totalNumber");
CREATE INDEX IF NOT EXISTS "Post_playtime_total_idx" ON "Post"("playtime", "totalNumber");

-- ソート用インデックス
CREATE INDEX IF NOT EXISTS "Post_id_desc_idx" ON "Post"("id" DESC);
CREATE INDEX IF NOT EXISTS "Post_man_desc_idx" ON "Post"("man" DESC);
CREATE INDEX IF NOT EXISTS "Post_woman_desc_idx" ON "Post"("woman" DESC);
CREATE INDEX IF NOT EXISTS "Post_totalNumber_desc_idx" ON "Post"("totalNumber" DESC);
CREATE INDEX IF NOT EXISTS "Post_playtime_desc_idx" ON "Post"("playtime" DESC);

-- カテゴリとの関連用インデックス
CREATE INDEX IF NOT EXISTS "_PostCategory_B_index" ON "_PostCategory"("B");
CREATE INDEX IF NOT EXISTS "_PostCategory_AB_unique" ON "_PostCategory"("A", "B");