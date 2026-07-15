/**
 * Slack Incoming Webhook 通知ヘルパ。
 * 通知先は環境変数 SLACK_WEBHOOK_URL_NOTIFICATIONS で指定。
 * 通知失敗は本業ロジックを止めないよう、常に例外を握り潰す (ログ出力のみ)。
 */

const WEBHOOK_ENV = 'SLACK_WEBHOOK__NOTIFICATIONS';

type SlackBlock = Record<string, unknown>;

interface NotifyOptions {
  /** Slack の text フィールド (通知プレビュー・アクセシビリティ用) */
  text: string;
  /** リッチな Block Kit ペイロード (省略可) */
  blocks?: SlackBlock[];
  /** username 上書き (省略時は Slack app 設定に従う) */
  username?: string;
  /** icon_emoji 上書き (例: ':moneybag:') */
  iconEmoji?: string;
}

export async function notifySlack(opts: NotifyOptions): Promise<void> {
  const url = process.env[WEBHOOK_ENV];
  if (!url) {
    // 未設定は無視 (dev/preview 環境で通知不要な場面もある)
    console.log('[slack] webhook URL not configured, skip:', opts.text);
    return;
  }

  try {
    const payload: Record<string, unknown> = { text: opts.text };
    if (opts.blocks) payload.blocks = opts.blocks;
    if (opts.username) payload.username = opts.username;
    if (opts.iconEmoji) payload.icon_emoji = opts.iconEmoji;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('[slack] non-2xx response:', res.status, await res.text().catch(() => ''));
    }
  } catch (err) {
    console.error('[slack] notify failed:', err);
  }
}

/** Block Kit のシンプルなセクションブロックを生成 */
export function slackSection(mrkdwn: string): SlackBlock {
  return { type: 'section', text: { type: 'mrkdwn', text: mrkdwn } };
}
