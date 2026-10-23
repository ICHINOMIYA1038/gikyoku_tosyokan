# 戯曲図書館（gikyokutosyokan.com）

このリポジトリで作業するすべてのエージェント（hermes・Claude Code など）向けの指示書。**このファイルが正本**で、`CLAUDE.md` はこのファイルを読み込むだけ。
**このリポジトリは公開されている。** 秘密情報・接続文字列・ビルドログ・個人情報を、コード・PR・コメント・ドキュメントに書かない。
運用の内部情報（Cloudflare のリソース、DB の場所、鍵の置き場所、オーナーの決定）は、オーナーの台帳（skill `app-ledger`）にある。

## サイト
- 戯曲（脚本）を、人数・上演時間・カテゴリで探せる情報サイト。戯曲の全文は載せない。目標はコメントと上演報告が活発になること。投稿のしやすさ・安全・通報への備えにつながる変更を優先する
- 本番は Cloudflare Workers（OpenNext）。DB は PostgreSQL（Prisma）。2026-10-23 に Vercel から切り替えた。**Vercel はもう本番ではない**
- Next.js 15 + TypeScript + Prisma 6 / Tailwind / TanStack Query。画像は S3、メールは Resend、計測は GA4

## コマンド
| コマンド | 用途 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | `prisma generate` してから Next.js のビルド（Node のビルドの確認用） |
| `npm run cf:build` / `npm run cf:preview` | OpenNext で Workers 向けにビルド / ローカルの workerd で確認 |
| `npm run lint` | ESLint |
| `make up` / `make down` / `make psql` | ローカルの Docker と Postgres |
| `make backup-prd` | 本番 DB のバックアップ |

`npm run cf:deploy`（本番へのデプロイ）は、hermes のジョブからは実行しない。

## デプロイ
- main から自動でデプロイされる（`wrangler versions upload` → 0% で stage → promote）。夜に走る。**手動でも自動でも、必ず最新の origin/main からビルドする**（古いチェックアウトから出して本番を巻き戻した事故がある）
- ビルドは UTC で行う（`next.config.js` で `TZ=UTC` に固定済み）。日本時間でビルドすると静的ページの日付が本番とずれる
- `NEXT_PUBLIC_*` はビルド時に要る。既定値は `next.config.js` にある（GA の ID、`FEATURE_RECRUIT`、`FEATURE_MESSAGES`）。これが無いままビルドして、募集・メッセージが「準備中」になった事故がある（2026-10-23）
- `DOQueueHandler が見つからない` という警告は、キャッシュを入れるときの一時プログラムから出るもので無害

## 記事（ブログ）
- 記事は `blog/posts/*.md`（frontmatter: title・date・description・tags）。slug はファイル名から `.md` を除いたもの。`/blog/ja/<slug>` と `/blog/en/<slug>` で出る
- 本番の記事は Postgres から配信される。`bot/` ブランチで PR → マージゲートが、マージ後に DB への登録（`scripts/migrate-blog-to-db.ts`）と再ビルド（最大3時間ごと）を行う
- 手で DB に入れるとき: `set -a && source .env.local && set +a && npx tsx scripts/migrate-blog-to-db.ts`（Prisma に `POSTGRES_PRISMA_URL` を渡すため `set -a` が要る）
- 開発記は「私」の実体験として書く（困ったこと・失敗・没案などの裏話を入れ、同じ日に何本も出さない）

## データベース
- スキーマは `prisma/schema.prisma`。スキーマを変えるときは必ずマイグレーションを作る。本番への適用は `npm run migrate:deploy`
- 主なモデル: `Post`（戯曲）・`Author`・`Category`・`ParentComment` / `ChildComment`・`Rating`・`Access`（IP×日付の閲覧記録）・`News`・`Announcement`（上演告知）・`PostAward`（受賞・最終候補）・劇団・会場（`Venue`・`VenuePerformance`）
- **本番 DB を変える前に必ずバックアップを撮る。** 読むだけのときは `PGOPTIONS="-c default_transaction_read_only=on"` を付けて接続する
- 環境ファイル:
  - `.env.local` — **本番の DB を向いている**（Next.js が読む）
  - `.env.development.local` — ローカルの DB（会場・劇団のテーブルが無いので、その画面はローカルでは見られない）
  - `.env.production` — 本番 DB の `POSTGRES_*` だけ
  - **`.env` は作らない。** Prisma の CLI が `.env` を自動で読むので、`prisma migrate dev` などが本番に向く事故になる
- `BlogPost` への upsert が大量に走っていて、TOAST が膨らんだことがある（2026-10-23 に VACUUM FULL で 2.1GB → 137MB）。発生源は未特定。同じ書き込みを増やさない

## 既知の不具合（2026-10-23 時点）
- Workers では `getStaticProps` の `notFound` が、サイトの 404 ページではなく素の文字になる
- `/lp/quiz` が本番で 500（`NEXT_PUBLIC_API_BASE_URL` が未設定）
- お知らせなどの日付が UTC で表示され、1日早く見える

## 掲載依頼（お問い合わせから届く戯曲）
作者名・PDF は、本人の作品であることと掲載の許可が取れるまで出さない。作者は「作者不詳」（Author id 521）に紐付ける。投稿者の個人情報を DB やコードに入れない。詳しい手順はオーナーの台帳の「戯曲図書館」。

## AI で作るコンテンツ
- 作品の説明文: `scripts/generate-ai-descriptions.ts`（724件すべて作成済み、2026-05）
- カバー画像: `scripts/generate-cover-images.ts` は **動かない**（使っていた `gemini-2.5-flash-image` が 2026-10-02 に提供終了）
- 画像生成 API は「どうしても」の時だけ。**使う前に枚数と金額をオーナーに確認する。** 素材はまずコードで作る（SVG・Canvas・CSS）

## デザイン
- ブランド刷新を進めている（2026-10-23〜、案A「劇場の中の図書館」: 臙脂・藍・墨・和紙白。明朝は作品名と大見出しだけ）。AI が作ったように見える定番（生成りの地＋明朝＋臙脂、角丸カード、左右対称）を避け、香盤表・台本の書式・目録など演劇に固有の書式を使う
- ロゴ: `public/logo.png`（通常、紺系の筆文字）・`public/logo-white.png`（暗い背景用、フッター）・`public/icon.png`（favicon「戯」）・`public/apple-icon.png`。姉妹サイトの戯曲パレットは同じ「戯」のマゼンタ版
- モバイルファースト（Tailwind のブレークポイント）

## コミット・PR
- main に直接 push しない。hermes のブランチは `bot/`
- コミットは短く、`記事追加:` `feat:` `fix:` `perf:` などを付ける。PR には理由と、画面の変更ならスクリーンショット
- テストの仕組みはほぼ無い（`.github/workflows/auth-tests.yml` だけ）。足すなら対象の近く（`__tests__/` か `*.test.ts`）に置き、ここに実行方法を書く

## これからやりたいこと
- `PostAward` の 643件のうち、`Post` に紐付いていない約436件を作品ページとして追加する（受賞 > 最終候補の順、岸田賞から）
