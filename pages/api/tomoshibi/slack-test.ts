import type { NextApiRequest, NextApiResponse } from 'next';
import { notifySlack, slackSection } from '@/lib/slack';

/**
 * 一時的な Slack 疎通確認エンドポイント (デバッグ用)。
 * GET /api/tomoshibi/slack-test?token=<SECRET> を叩くと Slack に投稿。
 * 動作確認後は本ファイルを削除してよい。
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 誰でも叩けると spam の元になるので簡易的なトークン制御
  const expected = process.env.STRIPE_WEBHOOK_SECRET; // 既存 secret を流用
  const provided = req.query.token;
  if (!expected || provided !== expected) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const envValue = process.env.SLACK_WEBHOOK__NOTIFICATIONS;
  const envInfo = {
    exists: !!envValue,
    length: envValue?.length ?? 0,
    prefix: envValue?.slice(0, 30) ?? null,
  };

  await notifySlack({
    text: '🧪 Slack 疎通テスト',
    iconEmoji: ':test_tube:',
    blocks: [slackSection(`*🧪 Slack 疎通テスト*\n時刻: ${new Date().toISOString()}\n環境変数長: ${envInfo.length}`)],
  });

  return res.json({ ok: true, envInfo, note: 'Slack にメッセージが投稿されたか確認してください' });
}
