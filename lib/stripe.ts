import Stripe from 'stripe';

// tomoshibi Pro プラン用の Stripe クライアント & 定数。
// 環境変数は .env.local / Vercel Project Settings に設定する:
//   STRIPE_SECRET_KEY               ... サンドボックスなら sk_test_..., 本番なら sk_live_...
//   STRIPE_WEBHOOK_SECRET           ... Stripe Dashboard の Webhook 登録時に発行される whsec_...
//   STRIPE_PRICE_ID_TOMOSHIBI_PRO   ... Product 内の Price ID (price_...)
//   TOMOSHIBI_APP_URL               ... Checkout 成功/キャンセル戻り先 (例: https://tomoshibi.gikyokutosyokan.com)

let cached: Stripe | null = null;

/**
 * Stripe クライアントを遅延初期化する。
 * ビルド時に環境変数が無くてもモジュールロードは通したいので、実際に呼ばれるまでキーを要求しない。
 */
export function stripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  cached = new Stripe(key, {
    // Stripe SDK 22 の推奨は自動 API version。明示指定は不要。
    typescript: true,
  });
  return cached;
}

export function stripePriceId(): string {
  const id = process.env.STRIPE_PRICE_ID_TOMOSHIBI_PRO;
  if (!id) throw new Error('STRIPE_PRICE_ID_TOMOSHIBI_PRO is not set');
  return id;
}

export function stripeWebhookSecret(): string {
  const s = process.env.STRIPE_WEBHOOK_SECRET;
  if (!s) throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  return s;
}

export function tomoshibiAppUrl(): string {
  return process.env.TOMOSHIBI_APP_URL || 'https://tomoshibi.gikyokutosyokan.com';
}
