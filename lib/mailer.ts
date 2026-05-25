/**
 * Google Workspace (Gmail) SMTP 経由でメール送信する共通ユーティリティ。
 *
 * 認証方式は2系統サポート:
 *   1. OAuth2 (推奨・Workspace ではこちらしか動かないケース多い)
 *      - GMAIL_CLIENT_ID
 *      - GMAIL_CLIENT_SECRET
 *      - GMAIL_REFRESH_TOKEN
 *      - GMAIL_USER (送信元アドレス。例: support@gikyokutosyokan.com)
 *   2. アプリパスワード (個人 Gmail / Workspace で許可されている場合)
 *      - GMAIL_USER
 *      - GMAIL_APP_PASSWORD
 *
 * OAuth2 が優先。RefreshToken があればそちらが使われる。
 */
import nodemailer, { type Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (_transporter) return _transporter;

  const user = process.env.GMAIL_USER;
  if (!user) {
    throw new Error("GMAIL_USER が未設定です（送信元アドレス）。");
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  // OAuth2 を優先
  if (clientId && clientSecret && refreshToken) {
    _transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user,
        clientId,
        clientSecret,
        refreshToken,
      },
    });
    return _transporter;
  }

  // フォールバック: アプリパスワード
  if (appPassword) {
    _transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass: appPassword },
    });
    return _transporter;
  }

  throw new Error(
    "GMAIL の認証情報が未設定です。OAuth2 (CLIENT_ID/SECRET/REFRESH_TOKEN) もしくは APP_PASSWORD のどちらかを設定してください。"
  );
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
