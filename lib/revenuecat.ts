// RevenueCat (tomoshibiモバイルアプリのIAP管理) 連携用の定数・ヘルパー。
// 環境変数は .env.local / Vercel Project Settings に設定する:
//   REVENUECAT_WEBHOOK_SECRET ... RevenueCatダッシュボードのWebhook設定で
//                                 Authorization header value に設定した値と同一のもの

export function revenueCatWebhookSecret(): string {
  const s = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!s) throw new Error('REVENUECAT_WEBHOOK_SECRET is not set');
  return s;
}

/** tomoshibiのProプランに対応するRevenueCatのEntitlement識別子 */
export const REVENUECAT_PRO_ENTITLEMENT_ID = 'pro';
