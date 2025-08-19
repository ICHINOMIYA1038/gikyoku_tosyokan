-- AddSearchIndexes
-- 検索パフォーマンス改善のためのインデックス追加

-- Postテーブルの検索用インデックス
CREATE INDEX IF NOT EXISTS "Post_title_idx" ON "Post"("title");
CREATE INDEX IF NOT EXISTS "Post_synopsis_idx" ON "Post"("synopsis");
CREATE INDEX IF NOT EXISTS "Post_man_idx" ON "Post"("man");
CREATE INDEX IF NOT EXISTS "Post_woman_idx" ON "Post"("woman");
CREATE INDEX IF NOT EXISTS "Post_totalNumber_idx" ON "Post"("totalNumber");
CREATE INDEX IF NOT EXISTS "Post_playtime_idx" ON "Post"("playtime");
CREATE INDEX IF NOT EXISTS "Post_averageRating_idx" ON "Post"("averageRating");
CREATE INDEX IF NOT EXISTS "Post_author_id_idx" ON "Post"("author_id");

-- 複合インデックス（よく一緒に使われるフィールド）
CREATE INDEX IF NOT EXISTS "Post_man_woman_totalNumber_idx" ON "Post"("man", "woman", "totalNumber");
CREATE INDEX IF NOT EXISTS "Post_playtime_averageRating_idx" ON "Post"("playtime", "averageRating");

-- Authorテーブルの検索用インデックス
CREATE INDEX IF NOT EXISTS "Author_name_idx" ON "Author"("name");

-- PostCategoryリレーションテーブルのインデックス
CREATE INDEX IF NOT EXISTS "PostCategory_A_idx" ON "_PostCategory"("A");
CREATE INDEX IF NOT EXISTS "PostCategory_B_idx" ON "_PostCategory"("B");

-- Accessテーブルのカウント用インデックス
CREATE INDEX IF NOT EXISTS "Access_postId_idx" ON "Access"("postId");

-- Ratingテーブルのカウント用インデックス
CREATE INDEX IF NOT EXISTS "Rating_postId_idx" ON "Rating"("postId");