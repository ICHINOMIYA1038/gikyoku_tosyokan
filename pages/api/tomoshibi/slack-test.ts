import type { NextApiRequest, NextApiResponse } from 'next';
import { notifySlack, slackSection } from '@/lib/slack';

/**
 * 一時的な Slack 疎通確認エンドポイント (デバッグ用)。
 * GET /api/tomoshibi/slack-test?token=<SECRET> を叩くと Slack に投稿。
 * 動作確認後は本ファイルを削除してよい。
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 一時的なデバッグ用エンドポイント。動作確認後は本ファイルを削除する。
  // 悪用防止のため、Referer が gikyokutosyokan.com か User-Agent が curl か、
  // かつ ?debug=true が付いている場合のみ実行。
  if (req.query.debug !== 'true') {
    return res.status(403).json({ error: 'debug flag required' });
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
