# 戯曲図書館（gikyokutosyokan.com）

このリポジトリで作業するすべてのエージェント（hermes・Claude Code など）向けの指示書。**このファイルが正本**で、`CLAUDE.md` はこのファイルを読み込むだけ。
**このリポジトリは公開されている。** 秘密情報・接続文字列・ビルドログ・個人情報を、コード・PR・コメント・ドキュメントに書かない。
運用の内部情報（Cloudflare のリソース、DB の場所、鍵の置き場所、オーナーの決定）は、オーナーの台帳（skill `app-ledger`）にある。

## サイト
- 戯曲（脚本）を、人数・上演時間・カテゴリで探せる情報サイト。戯曲の全文は載せない。**検索は入口で、主役は書き込み**（作品へのコメント「みんなの声」、掲示板＝上演告知・劇団員募集・上演レポート）。投稿のしやすさ・安全・通報への備えにつながる変更を優先する（オーナーの方針 2026-10-24）
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

`npm run cf:deploy`（本番へのデプロイ）は、hermes のジョブからは実行しない。デプロイは下の「デプロイ」のとおり、main へのマージで自動で行われる。

## デプロイ
- **main にマージされると、GitHub Actions（`.github/workflows/deploy.yml`）が自動でビルドしてデプロイする**（2026-10-24〜）。デプロイ後に主なページが 200 を返すか確かめ、失敗したら直前の版に `wrangler rollback` で戻す。続けてマージされても1本ずつ順に流れる。手で出す必要はない
- 鍵は GitHub の environment `production` の secret にある（値はオーナーが登録した。読んだり出力したりしない）
- 手で出すとき（Actions が止まっているときなど）だけ: **必ず最新の origin/main から** `npm run cf:build` → `npx opennextjs-cloudflare deploy`。個人の Cloudflare アカウントでログインしていることを `npx wrangler whoami` で確かめる（古いチェックアウトから出して本番を巻き戻した事故がある）
- ビルドは UTC で行う（`next.config.js` で `TZ=UTC` に固定済み）。日本時間でビルドすると静的ページの日付が本番とずれる
- `NEXT_PUBLIC_*` はビルド時に要る。既定値は `next.config.js` にある（GA の ID、`FEATURE_RECRUIT`、`FEATURE_MESSAGES`）。これが無いままビルドして、募集・メッセージが「準備中」になった事故がある（2026-10-23）
- `DOQueueHandler が見つからない` という警告は、キャッシュを入れるときの一時プログラムから出るもので無害
- Worker の入口は `worker.ts`（`wrangler.jsonc` の `main`）。OpenNext の `.open-next/worker.js` を包み、`notFound` で Next.js の既定の文字だけが返ったときにサイトの 404 ページを返す。`tsconfig.json` の対象から外している
- 日付をサーバーで `toLocaleDateString` するときは `timeZone: 'Asia/Tokyo'` を必ず付ける

## API・個人情報（必ず守る）
- **`middleware.ts` は `/api` を対象にしていない。** 管理画面（`/_ops/...`）は Basic 認証で守られているが、API は守られていない。書き込む API には必ず認可を入れる: 本人の操作は `requireAuth`（`lib/auth.ts`）＋持ち主の確認、管理用は `requireAdminApi`（`lib/admin-guard.ts`）。サンプルデータを作る API は本番で 404 にする。ログインなしで作品を書き換えられる API が残っていた（2026-10-24 に直した）
- **利用者の `User.name`（Google / Apple のアカウント名＝本名のことが多い）・メールアドレス・IP アドレスを、ページのデータ（`__NEXT_DATA__`）・API・メール・メッセージで他の人に出さない。** 他の人に見せる名前は `lib/public-name.ts` の `publicName()`（表示名、無ければ「ユーザー」）だけ。Prisma の `select` で `user` / `poster` に `name: true` を入れない。上演告知を外に出すときは `lib/announcement-public.ts` の項目だけ
- 削除済み（`deleted` / `deletedAt`）のコメント・告知・募集は、一覧・詳細・ページのデータに出さない。管理画面の削除は本文を残すので、ページに渡す前に空にする
- 公開してよい情報（表示名・プロフィール画像・投稿内容）は利用規約とプライバシーポリシーに書いてある。公開する情報を増やすときは、先に両方を直す（オーナーの確認が要る）
- 問い合わせ先は support@gikyokutosyokan.com

## 日時
- サーバーは UTC で動く。フォームの `datetime-local` / `date` の値（タイムゾーンなし）は、`lib/date-format.ts` の `parseJstInput()` で日本時間として読む。そのまま `new Date()` すると9時間ずれる（上演告知の公演日時が9時間ずれていた。2026-10-24 にデータも直した）
- 表示は `formatJstDateTime()` / `performanceDateParts()` / `timeAgo()`（日本時間）を使う。`toLocaleDateString` をサーバーで使うと UTC になる
- `Announcement.performanceDate` は `timestamp without time zone` で UTC の時刻を入れている。SQL で日本時間を見るときは `+ interval '9 hours'`（`AT TIME ZONE 'Asia/Tokyo'` は逆向きに効く）

## 記事（ブログ）
- 記事は `blog/posts/*.md`（frontmatter: title・date・description・tags）。slug はファイル名から `.md` を除いたもの。`/blog/ja/<slug>` と `/blog/en/<slug>` で出る
- 本番の記事は Postgres から配信される。`bot/` ブランチで PR → マージゲートが、マージ後に DB への登録（`scripts/migrate-blog-to-db.ts`）と再ビルド（最大3時間ごと）を行う
- 手で DB に入れるとき: `set -a && source .env.local && set +a && npx tsx scripts/migrate-blog-to-db.ts`（Prisma に `POSTGRES_PRISMA_URL` を渡すため `set -a` が要る）
- 開発記は「私」の実体験として書く（困ったこと・失敗・没案などの裏話を入れ、同じ日に何本も出さない）

## データベース
- スキーマは `prisma/schema.prisma`。スキーマを変えるときは必ずマイグレーションを作る。本番への適用は `npm run migrate:deploy`
- 主なモデル: `Post`（戯曲）・`Author`・`Category`・`ParentComment` / `ChildComment`・`Rating`・`Access`（IP×日付の閲覧記録）・`News`・`Announcement`（上演告知）・`PostAward`（受賞・最終候補）・劇団・会場（`Venue`・`VenuePerformance`）
- `Rating.star` は 1〜5 の整数だけ。平均（`Post.averageRating`）と件数も 1〜5 だけで数える（以前の不具合で 0 や 6 が入っている）
- **本番 DB を変える前に必ずバックアップを撮る。** 読むだけのときは `PGOPTIONS="-c default_transaction_read_only=on"` を付けて接続する
- 環境ファイル:
  - `.env.local` — **本番の DB を向いている**（Next.js が読む）
  - `.env.development.local` — ローカルの DB（会場・劇団のテーブルが無いので、その画面はローカルでは見られない）
  - `.env.production` — 本番 DB の `POSTGRES_*` だけ
  - **`.env` は作らない。** Prisma の CLI が `.env` を自動で読むので、`prisma migrate dev` などが本番に向く事故になる
- `BlogPost` への upsert が大量に走っていて、TOAST が膨らんだことがある（2026-10-23 に VACUUM FULL で 2.1GB → 137MB）。発生源は未特定。同じ書き込みを増やさない

## 既知の不具合（2026-10-24 時点）
- コメントは 2026-06-15 から増えていない（2026-04 からログイン必須。API は正常）

## 掲載依頼（お問い合わせから届く戯曲）
作者名・PDF は、本人の作品であることと掲載の許可が取れるまで出さない。作者は「作者不詳」（Author id 521）に紐付ける。投稿者の個人情報を DB やコードに入れない。詳しい手順はオーナーの台帳の「戯曲図書館」。

## AI で作るコンテンツ
- 作品の説明文: `scripts/generate-ai-descriptions.ts`（724件すべて作成済み、2026-05）
- カバー画像: `scripts/generate-cover-images.ts` は **動かない**（使っていた `gemini-2.5-flash-image` が 2026-10-02 に提供終了）
- 画像生成 API は「どうしても」の時だけ。**使う前に枚数と金額をオーナーに確認する。** 素材はまずコードで作る（SVG・Canvas・CSS）

## デザイン（第3版、2026-10-24 から本番）
- 白地＋紅1色（`theater-primary-600` = #B3123A）。面の色 #F4F2EE、罫線 #D9D5CF、文字 #1A1A1A / #5E5A55、「無料」は #1F7A4D on #E6F2EC
- 書体: 明朝（Shippori Mincho）は h1 と作品名・劇団名だけ。それ以外は Noto Sans JP。見出しは `word-break: auto-phrase`
- 一覧は**カードではなく表組みの行**（罫線で区切る、PC は列の見出し付き）。既存の部品を使う: 作品 `PostCardList` / `PostCard`、劇団 `TheaterGroupList`、掲示板の頭 `BoardHeader`（タブ・見出し・投稿ボタン・空の状態）、詳細の表 `InfoTable` と共有 `ShareLinks`（`components/BoardDetail.tsx`）、本文の URL のリンク化 `LinkifiedText`
- `globals.css` の `h2` / `h3` は `@layer` の外で余白と大きさを持つ。行や欄の見出しでは `!my-0 !pb-0 !text-…` で打ち消す
- AI が作ったように見えるものを入れない: 作り物のデータ（請求記号・通し番号）、比喩の部品の多用、気の利いたコピー、英字の大文字・字間の見出し、グラデーションの光、絵文字の見出し、01/02 の数字、色分けのバッジ、影付きの角丸カード
- ロゴは `public/logo.svg`（明朝の字形、「戯」だけ紅）とシンボル `public/logo-mark.svg`。アイコン一式（`icon-192.png` など）もそこから書き出してある。`logo.png` / `logo-white.png` は古い
- 画面を変えたら、PC（1440px）とスマホ（390px）で撮って PR に付ける。スマホで横にはみ出していないか（`scrollWidth`）を確かめる。1列のグリッドは `grid-cols-1` と子の `min-w-0` を付けないとはみ出すことがある
- モバイルファースト（Tailwind のブレークポイント）

## コミット・PR
- main に直接 push しない。hermes のブランチは `bot/`
- コミットは短く、`記事追加:` `feat:` `fix:` `perf:` などを付ける。PR には理由と、画面の変更ならスクリーンショット
- テストの仕組みはほぼ無い（`.github/workflows/auth-tests.yml` だけ）。足すなら対象の近く（`__tests__/` か `*.test.ts`）に置き、ここに実行方法を書く

## これからやりたいこと
- `PostAward` の 643件のうち、`Post` に紐付いていない約436件を作品ページとして追加する（受賞 > 最終候補の順、岸田賞から）
