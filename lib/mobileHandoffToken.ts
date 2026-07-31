import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

// tomoshibiモバイルアプリのASWebAuthenticationSessionは、アプリ本体のWebViewとは
// 別のCookieストアで完結するため、サインイン成功後にセッションCookieが引き継がれない。
// この一度きりの短命トークンを tomoshibi://auth-callback に載せて渡し、アプリ本体の
// WebViewから /api/auth/mobile-handoff を叩かせることで、そのレスポンスとして正式な
// セッションCookieをWebView自身のCookieストアに発行させる。
const IDENTIFIER_PREFIX = "mobile-handoff:";
const TOKEN_TTL_MS = 2 * 60 * 1000;

export async function createMobileHandoffToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await prisma.verificationToken.create({
    data: {
      identifier: `${IDENTIFIER_PREFIX}${userId}`,
      token,
      expires: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  return token;
}

// 検証と同時に必ず削除する(使い捨て)。有効期限切れやプレフィックス不一致はnullを返す。
export async function consumeMobileHandoffToken(token: string): Promise<string | null> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record) return null;

  await prisma.verificationToken
    .delete({ where: { token } })
    .catch(() => {
      // 並行リクエストで既に削除済みでも無視する
    });

  if (record.expires < new Date()) return null;
  if (!record.identifier.startsWith(IDENTIFIER_PREFIX)) return null;

  return record.identifier.slice(IDENTIFIER_PREFIX.length);
}
