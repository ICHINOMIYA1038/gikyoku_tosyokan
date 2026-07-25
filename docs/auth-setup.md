# 認証セットアップ手順

NextAuth.js + Google OAuth / Sign In with Apple のセットアップガイド。

## 必要な環境変数

`.env.local` に以下を設定:

```bash
# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"            # 本番は https://gikyokutosyokan.com
NEXTAUTH_SECRET="<openssl rand -base64 32 で生成>"

# Google OAuth
GOOGLE_CLIENT_ID="<Google Cloud Consoleで取得>"
GOOGLE_CLIENT_SECRET="<Google Cloud Consoleで取得>"

# Sign In with Apple (tomoshibiモバイルアプリのApp Store審査 4.8 対応)
APPLE_CLIENT_ID="com.gikyokutosyokan.tomoshibi.web"   # Services ID
APPLE_TEAM_ID="<developer.apple.com/account 右上に表示されるTeam ID>"
APPLE_KEY_ID="<Apple Developer Portal で発行したキーのKey ID>"
APPLE_PRIVATE_KEY="<ダウンロードした AuthKey_xxxxx.p8 の中身をそのまま>"
```

## Google Cloud Console セットアップ手順

### 1. プロジェクト作成（既存の場合スキップ）

1. https://console.cloud.google.com/ にアクセス
2. プロジェクト選択ドロップダウンから「新しいプロジェクト」
3. プロジェクト名: `gikyoku-tosyokan`

### 2. OAuth 同意画面設定

1. 左メニュー「APIとサービス」→「OAuth 同意画面」
2. User Type: **External**（一般公開サービス）
3. 必須項目を入力:
   - アプリ名: `戯曲図書館`
   - ユーザーサポートメール: 運営メールアドレス
   - アプリのロゴ: `/public/logo.png` をアップロード
   - アプリケーションのホームページ: `https://gikyokutosyokan.com`
   - プライバシーポリシー: `https://gikyokutosyokan.com/support/privacy-policy`
   - 利用規約: `https://gikyokutosyokan.com/support/terms` （未作成なら作成）
   - デベロッパー連絡先: 運営メール
4. スコープ: **`.../auth/userinfo.email`**, **`.../auth/userinfo.profile`**, **`openid`** のみ追加（Sensitive/Restrictedスコープは一切不要）
5. テストユーザー: 本番公開前は運営者メールを追加
6. 公開前は「公開ステータス: テスト中」でOK。公開申請は後からでも可能

### 3. OAuth クライアント作成

1. 左メニュー「APIとサービス」→「認証情報」
2. 「認証情報を作成」→「OAuth クライアント ID」
3. アプリケーションの種類: **ウェブアプリケーション**
4. 名前: `gikyoku-tosyokan-web`
5. **承認済みの JavaScript 生成元** (設定不要、サーバーサイドフローのため)
6. **承認済みのリダイレクト URI**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://gikyokutosyokan.com/api/auth/callback/google
   ```
7. 「作成」クリック
8. 表示された **クライアント ID** と **クライアント シークレット** を `.env.local` にコピー

## Sign In with Apple セットアップ手順

tomoshibiモバイルアプリでGoogle Sign-Inを使うため、App Store審査ガイドライン4.8により
同等のプライバシー配慮ログインとしてApple Sign Inの併設が必須。

### 1. Apple Developer Portal での設定 (developer.apple.com/account)

1. **Identifiers → App IDs**: `com.gikyokutosyokan.tomoshibi` (Bundle ID) に
   Sign In with Apple capability を有効化 (primary App ID として)
2. **Identifiers → Services IDs**: `com.gikyokutosyokan.tomoshibi.web` を作成し
   Sign In with Apple を有効化。Web Authentication Configuration で:
   - Domains: `gikyokutosyokan.com`
   - Return URLs: `https://gikyokutosyokan.com/api/auth/callback/apple`
3. **Keys**: Sign In with Apple を有効化したキーを新規作成し、
   `.p8` ファイルをダウンロード(**一度しかダウンロードできないので必ず安全な場所に保存**)。
   Team ID (developer.apple.com/account 右上に表示) と Key ID を控える

### 2. client_secret (JWT) は自動生成・ローテーション不要

NextAuthのAppleProviderは `clientSecret` に生のJWT文字列を要求するが、
このJWTはApple仕様上最長6ヶ月しか有効にできない。手動での定期再生成を避けるため、
`lib/appleClientSecret.ts` が **秘密鍵 (失効しない) から起動のたびにその場でJWTを署名する**
方式を採用している。人間が覚えておくべき定期作業は無い。

環境変数に設定するのは失効しない秘密鍵そのもの (`APPLE_TEAM_ID` / `APPLE_KEY_ID` /
`APPLE_PRIVATE_KEY`) であり、`APPLE_CLIENT_SECRET` という変数自体は存在しない。

### 3. Vercel環境変数

```
Vercel Dashboard → Project → Settings → Environment Variables
- APPLE_CLIENT_ID: com.gikyokutosyokan.tomoshibi.web
- APPLE_TEAM_ID: (developer.apple.com/account 右上に表示されるTeam ID)
- APPLE_KEY_ID: (Apple Developer Portal で発行したキーのKey ID)
- APPLE_PRIVATE_KEY: (ダウンロードした .p8 の中身をそのまま貼り付け。改行はそのまま貼ってOK)
```

秘密鍵自体を万が一ローテーションしたくなった場合(漏洩時など)は、Apple Developer Portal で
新しいキーを発行し、上記3変数を差し替えるだけでよい(コード変更不要)。

## NEXTAUTH_SECRET の生成

```bash
openssl rand -base64 32
```

本番環境 (Vercel) の環境変数にも設定が必要:

```
Vercel Dashboard → Project → Settings → Environment Variables
- NEXTAUTH_URL: https://gikyokutosyokan.com
- NEXTAUTH_SECRET: (上記で生成した値)
- GOOGLE_CLIENT_ID: (Google Cloudから取得)
- GOOGLE_CLIENT_SECRET: (Google Cloudから取得)
```

## DBスキーマ

以下のテーブルが追加されています:

- `User` - ユーザー情報（id/name/email/image/role/bio）
- `Account` - OAuth連携（Google等、1Userに複数連携可）
- `Session` - セッション管理（JWT戦略でも将来のため保持）
- `VerificationToken` - マジックリンク用（未使用だが将来拡張用）
- `ParentComment.userId` - コメント投稿者のUser紐付け（nullable=匿名も可）
- `ChildComment.userId` - 返信コメントのUser紐付け（nullable=匿名も可）

## 動作確認

```bash
npm run dev
# → http://localhost:3000
# → ヘッダー右上の「ログイン」ボタン
# → Googleアカウント選択画面に遷移
# → 認証後、/ にリダイレクトされログイン状態になる
```

## トラブルシューティング

### redirect_uri_mismatch エラー

Google Cloud Console の「承認済みのリダイレクト URI」に、現在アクセスしているURL + `/api/auth/callback/google` が登録されているか確認。

### NEXTAUTH_URL 未設定エラー

`NEXTAUTH_URL` が `.env.local` に設定されているか確認。Vercel Preview ブランチで動かす場合は、Vercel環境変数で `NEXTAUTH_URL_INTERNAL` も設定するとプレビュー毎のURLに対応できる。

### セッションが消える

`NEXTAUTH_SECRET` が変わるとJWTの署名が変わり既存セッションが無効になる。本番では**絶対にローテートしないこと**（する場合はダウンタイム告知）。

## セキュリティ考慮事項

- ✅ CSRF対策: NextAuth標準対応
- ✅ HttpOnly Cookie: 自動設定
- ✅ SameSite=Lax: 自動設定
- ✅ JWT署名検証: `NEXTAUTH_SECRET`
- ✅ OAuth state検証: 自動
- ⚠️ **認可チェックは各API routeで自前実装必要** (`lib/auth.ts` の `requireAuth` / `requireRole` を使用)
- ⚠️ レート制限は未実装（Phase 2で `@upstash/ratelimit` 追加予定）

## 関連ファイル

| ファイル | 役割 |
|---|---|
| `lib/authOptions.ts` | NextAuth設定（プロバイダ、callback等） |
| `lib/auth.ts` | APIルート用ヘルパー（`requireAuth` 等） |
| `pages/api/auth/[...nextauth].ts` | NextAuth APIエンドポイント |
| `pages/auth/signin.tsx` | サインインページ |
| `pages/mypage/index.tsx` | マイページ（要ログイン） |
| `types/next-auth.d.ts` | Session/JWT型拡張 |
| `components/AuthMenu.tsx` | ヘッダーのログイン/ユーザーメニュー |
