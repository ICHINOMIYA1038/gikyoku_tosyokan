/**
 * Google Workspace (Gmail) SMTP 経由でメール送信する共通ユーティリティ。
 *
 * Resend から移行したため、既存呼び出し側 (resend.emails.send({from, to, subject, html}))
 * とほぼ同じシグネチャで使えるよう sendMail を提供する。
 *
 * 環境変数:
 *   GMAIL_USER          - 送信元のフルアドレス (例: noreply@gikyokutosyokan.com)
 *   GMAIL_APP_PASSWORD  - Google アカウントのアプリパスワード (16桁)
 *   MAIL_FROM           - デフォルトの From ヘッダ (省略時は GMAIL_USER を使う)
 */
import nodemailer, { type Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (_transporter) return _transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER / GMAIL_APP_PASSWORD が未設定です。Google Workspace の SMTP 認証情報を設定してください。"
    );
  }

  _transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  return _transporter;
}

export type MailInput = {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendMail(input: MailInput) {
  const transporter = getTransporter();
  const fromHeader =
    input.from || process.env.MAIL_FROM || process.env.GMAIL_USER;
  const info = await transporter.sendMail({
    from: fromHeader,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });
  return { id: info.messageId };
}
