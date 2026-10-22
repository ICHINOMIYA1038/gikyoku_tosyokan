/**
 * Resend の HTTP API 経由でメール送信する共通ユーティリティ。
 *
 * SMTP は Cloudflare Workers で使えないため、fetch だけで送れる Resend を使う。
 *   - RESEND_API_KEY
 *   - MAIL_FROM（任意。from 未指定時の送信元。無ければ GMAIL_USER）
 *
 * 送信元のドメイン（gikyokutosyokan.com）は Resend 側で認証済みであること。
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// Resend は 1 秒あたりの送信数に上限があり、超えると 429 を返す。
// 一斉送信のループで当たるので、少し待って再送する。
const MAX_RETRIES = 3;

export type MailInput = {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendMail(input: MailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY が未設定です。");
  }

  const from = input.from || process.env.MAIL_FROM || process.env.GMAIL_USER;
  if (!from) {
    throw new Error("送信元アドレスが未設定です（MAIL_FROM または GMAIL_USER）。");
  }

  const body = JSON.stringify({
    from,
    to: Array.isArray(input.to) ? input.to : [input.to],
    subject: input.subject,
    html: input.html,
    text: input.text,
    reply_to: input.replyTo,
  });

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.status === 429 && attempt < MAX_RETRIES) {
      const retryAfter = Number(res.headers.get("retry-after"));
      await sleep(retryAfter > 0 ? retryAfter * 1000 : 1000 * (attempt + 1));
      continue;
    }

    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      name?: string;
      message?: string;
    };
    if (!res.ok) {
      throw new Error(
        `Resend への送信に失敗しました（${res.status} ${data.name ?? ""}）: ${data.message ?? ""}`
      );
    }
    return { id: data.id ?? "" };
  }
}
