/**
 * 機能フラグ
 *
 * 環境変数 NEXT_PUBLIC_FEATURE_RECRUIT=true で劇団員募集を有効化
 * 環境変数 NEXT_PUBLIC_FEATURE_MESSAGES=true でメッセージを有効化
 *
 * 届出完了後、Vercelの環境変数を設定するだけで即有効化。コード変更不要。
 */

export const FEATURES = {
  recruit: process.env.NEXT_PUBLIC_FEATURE_RECRUIT === 'true',
  messages: process.env.NEXT_PUBLIC_FEATURE_MESSAGES === 'true',
};
