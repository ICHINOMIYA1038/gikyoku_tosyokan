import type { NextApiRequest, NextApiResponse } from "next";
import { encode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { consumeMobileHandoffToken } from "@/lib/mobileHandoffToken";

// authOptions.ts の session.maxAge / cookies.sessionToken と揃える。
const SESSION_MAX_AGE = 30 * 24 * 60 * 60;
const isProd = process.env.NODE_ENV === "production";
const SESSION_COOKIE_NAME = isProd
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token";

function buildSessionCookie(value: string): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=${value}`,
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isProd) {
    parts.push("Domain=.gikyokutosyokan.com", "Secure");
  }
  return parts.join("; ");
}

// tomoshibiモバイルアプリのWebView(アプリ本体のCookieストア)がこのエンドポイントに
// アクセスすることで、ASWebAuthenticationSession側で確立したセッションを
// WebView自身のCookieストアへ引き継ぐ。tokenは一度きり・短命。
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = typeof req.query.token === "string" ? req.query.token : null;
  if (!token) {
    res.redirect(302, "/auth/signin");
    return;
  }

  const userId = await consumeMobileHandoffToken(token);
  if (!userId) {
    res.redirect(302, "/auth/signin?error=Default");
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      displayName: true,
      image: true,
      avatarUrl: true,
      role: true,
    },
  });
  if (!user) {
    res.redirect(302, "/auth/signin?error=Default");
    return;
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }

  const jwt = await encode({
    token: {
      sub: user.id,
      id: user.id,
      role: user.role,
      name: user.displayName ?? user.name,
      email: user.email,
      picture: user.avatarUrl ?? user.image,
    },
    secret,
    maxAge: SESSION_MAX_AGE,
  });

  res.setHeader("Set-Cookie", buildSessionCookie(jwt));
  res.redirect(302, "https://tomoshibi.gikyokutosyokan.com/");
}
