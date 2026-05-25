/**
 * メール本文テンプレート。
 * 各テンプレートは {subject, html, text} を返し、sendMail にそのまま渡せる。
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gikyokutosyokan.com";
const BRAND = "戯曲図書館";

function unsubscribeFooter(token: string | null): string {
  if (!token) return "";
  const url = `${SITE_URL}/unsubscribe?token=${encodeURIComponent(token)}`;
  return `
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
    <p style="color: #888; font-size: 12px; line-height: 1.6;">
      このメールは ${BRAND} からの案内メールです。<br>
      今後この種類のメールを受け取りたくない場合は<a href="${url}" style="color: #1976d2;">こちらから配信停止</a>できます。
    </p>
    <p style="color: #aaa; font-size: 11px;">
      ${BRAND}<br>
      ${SITE_URL}
    </p>
  `;
}

function unsubscribeFooterText(token: string | null): string {
  if (!token) return "";
  const url = `${SITE_URL}/unsubscribe?token=${encodeURIComponent(token)}`;
  return `\n\n----\n配信停止: ${url}\n${BRAND} ${SITE_URL}`;
}

/** 新規登録時のウェルカムメール（必ず1度送る、オプトイン関係なし） */
export function welcomeMail(opts: {
  displayName: string | null;
  email: string;
}): { subject: string; html: string; text: string } {
  const name = opts.displayName || "新規登録ユーザー";
  return {
    subject: `${BRAND}へようこそ`,
    html: `
      <div style="font-family: 'Hiragino Sans', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #c2185b;">${BRAND}へようこそ</h2>
        <p>${name} さん</p>
        <p>このたびは ${BRAND} にご登録いただきありがとうございます。</p>

        <h3 style="color: #555; margin-top: 24px;">できること</h3>
        <ul style="line-height: 1.8;">
          <li>戯曲を条件で検索（人数・上演時間・ジャンル）</li>
          <li>気に入った作品をブックマーク・レビュー</li>
          <li>上演告知の投稿、劇団員の募集／応募</li>
          <li>姉妹サイト「戯曲パレット」と共通アカウントで利用可能</li>
        </ul>

        <p style="margin-top: 24px;">
          <a href="${SITE_URL}" style="display: inline-block; background: #c2185b; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none;">
            サイトを開く
          </a>
        </p>

        <p style="color: #666; font-size: 14px; margin-top: 28px;">
          ご質問・ご要望は <a href="${SITE_URL}/support/contact" style="color: #c2185b;">お問い合わせフォーム</a> からどうぞ。
        </p>

        <p style="color: #aaa; font-size: 11px; margin-top: 30px;">
          ${BRAND}<br>
          ${SITE_URL}
        </p>
      </div>
    `,
    text: [
      `${name} さん`,
      "",
      `${BRAND} にご登録いただきありがとうございます。`,
      "",
      "■ できること",
      "・戯曲を条件で検索（人数・上演時間・ジャンル）",
      "・気に入った作品をブックマーク・レビュー",
      "・上演告知の投稿、劇団員の募集／応募",
      "・姉妹サイト「戯曲パレット」と共通アカウントで利用可能",
      "",
      `サイトを開く: ${SITE_URL}`,
      `お問い合わせ: ${SITE_URL}/support/contact`,
      "",
      "----",
      `${BRAND} ${SITE_URL}`,
    ].join("\n"),
  };
}

/** 一斉案内メール（管理画面から） */
export function broadcastMail(opts: {
  displayName: string | null;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  unsubscribeToken: string;
}): { subject: string; html: string; text: string } {
  const name = opts.displayName || "ユーザー";
  return {
    subject: opts.subject,
    html: `
      <div style="font-family: 'Hiragino Sans', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <p>${name} さん</p>
        ${opts.bodyHtml}
        ${unsubscribeFooter(opts.unsubscribeToken)}
      </div>
    `,
    text: (opts.bodyText || stripHtml(opts.bodyHtml)) +
      unsubscribeFooterText(opts.unsubscribeToken),
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+\n/g, "\n").trim();
}
