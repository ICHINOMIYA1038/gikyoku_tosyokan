import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

/**
 * tomoshibi 等のサブドメインから 1クリックで NextAuth セッションを切るための専用ルート。
 * NextAuth 公式の /api/auth/signout は GET だと CSRF フォーム経由なので、
 * クロスサブドメインの単純なリンクから抜けられない。
 * このルートはセッション/コールバック Cookie を親ドメイン (.gikyokutosyokan.com) で
 * 削除して callbackUrl にリダイレクトする。
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieName = isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
  const callbackName = isProd ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url';

  const expired = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    domain: isProd ? '.gikyokutosyokan.com' : undefined,
    maxAge: 0,
  };

  res.setHeader('Set-Cookie', [
    serialize(cookieName, '', expired),
    serialize(callbackName, '', { ...expired, httpOnly: false }),
  ]);

  const raw = typeof req.query.callbackUrl === 'string' ? req.query.callbackUrl : '/';
  const safe = isSafeRedirect(raw) ? raw : '/';
  res.redirect(302, safe);
}

function isSafeRedirect(u: string): boolean {
  if (u.startsWith('/')) return true;
  try {
    const url = new URL(u);
    return url.protocol === 'https:' && /(^|\.)gikyokutosyokan\.com$/.test(url.hostname);
  } catch {
    return false;
  }
}
