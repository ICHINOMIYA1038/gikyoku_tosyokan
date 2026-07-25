# RevenueCat セットアップ手順 (tomoshibiモバイルアプリ)

tomoshibiモバイルアプリ (App Store) のPro購読は RevenueCat 経由で管理する。
Web版は引き続き Stripe (`docs/` 内に個別ドキュメントなし、`lib/stripe.ts` 参照) のまま。
購読経路に関わらず `User.tomoshibiPlan` / `tomoshibiPlanExpiresAt` が唯一の真実。

## 全体構成

```
モバイルアプリ (StoreKit購入)
  → RevenueCat (App内購入キーでApple App Store Server APIを検証)
  → Webhook → gikyoku_tosyokan /api/tomoshibi/revenuecat-webhook
  → User.tomoshibiPlan / tomoshibiPlanExpiresAt を更新
```

## 必要な環境変数

```bash
REVENUECAT_WEBHOOK_SECRET="<RevenueCat の Webhook 設定で使う共有シークレット>"
```

## RevenueCat側の設定 (app.revenuecat.com)

プロジェクト `TOMOSHIBI` (Project ID: `986e96ca`) 配下に以下を設定済み:

- **Apps → TOMOSHIBI (App Store)**: Bundle ID `com.gikyokutosyokan.tomoshibi`。
  In-app purchase key (App Store Connect の「アプリ内購入」キー、`SubscriptionKey_*.p8`) を紐付け済み
- **Entitlements → `pro`**: 表示名 "TOMOSHIBI Pro"
- **Products → `com.gikyokutosyokan.tomoshibi.pro.monthly`**: App Store Connect の
  サブスクリプション商品IDと完全一致させている。Entitlement `pro` に紐付け済み
- **Offerings → `default`** (Current Offering): Package "Monthly" に上記Productを設定済み

### Webhook設定 (Integrations → Webhooks)

- Webhook URL: `https://gikyokutosyokan.com/api/tomoshibi/revenuecat-webhook`
- Authorization header value: `Bearer <REVENUECAT_WEBHOOK_SECRETと同じ値>`
- Environment: Both Production and Sandbox

## app_user_id の扱い (重要)

RevenueCat SDKはデフォルトで匿名ID (`$RCAnonymousID:...`) を発行する。
tomoshibi側は **モバイルアプリがログイン済みの場合のみ購入を許可し**、
`Purchases.logIn(<gikyokutosyokan の User.id>)` を呼んでから購入フローに入る設計とする。
Webhookは `event.app_user_id` をそのまま `User.id` として扱うため、
匿名IDのまま行われた購入は `unknownUser: true` としてスキップされ、
プランが更新されない (=購入したのにProにならない) 事故になる。
**モバイル実装時はログイン前にPro購入ボタンを出さないこと。**

## Apple In-App Purchase Key の管理

App Store Connect → ユーザとアクセス → 統合 → アプリ内購入 で発行したキー
(`SubscriptionKey_*.p8`) をRevenueCatにアップロードしている。
このキーは失効しないため、Sign In with Apple の鍵と異なり定期ローテーションは不要。
紛失した場合は新しいキーを発行し、RevenueCatのApp設定で再アップロードするだけでよい。

## 動作確認

RevenueCatダッシュボードの Webhooks 設定画面から「Send Test Webhook」を送ると、
`event.type === 'TEST'` としてDBに触れず200 OKを返す (`revenuecat-webhook.ts` 参照)。
実際の購読状態同期はSandboxテスターでのIAP購入後に確認する。
