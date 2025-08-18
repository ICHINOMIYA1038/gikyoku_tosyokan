-- Post テーブルのインデックス
CREATE INDEX IF NOT EXISTS "Post_averageRating_id_idx" ON "Post"("averageRating" DESC NULLS LAST, "id" DESC);
CREATE INDEX IF NOT EXISTS "Post_playtime_idx" ON "Post"("playtime");
CREATE INDEX IF NOT EXISTS "Post_totalNumber_idx" ON "Post"("totalNumber");

-- News テーブルのインデックス  
CREATE INDEX IF NOT EXISTS "News_date_idx" ON "News"("date" DESC);

-- Author テーブルのインデックス
CREATE INDEX IF NOT EXISTS "Author_name_idx" ON "Author"("name");

-- Category テーブルのインデックス
CREATE INDEX IF NOT EXISTS "Category_name_idx" ON "Category"("name");