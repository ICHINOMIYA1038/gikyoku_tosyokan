import type { NextApiRequest, NextApiResponse } from 'next';

// 軽量 Set-Cookie シリアライザ (cookie パッケージの型同梱を避ける)
function serialize(name: string, value: string, opts: {
  httpOnly?: boolean; secure?: boolean; sameSite?: 'lax' | 'strict' | 'none';
  path?: string; domain?: string; maxAge?: number;
}): string {
  const parts = [`${name}=${value}`];
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`);
  if (opts.path) parts.push(`Path=${opts.path}`);
  if (opts.domain) parts.push(`Domain=${opts.domain}`);
  if (opts.httpOnly) parts.push('HttpOnly');
  if (opts.secure) parts.push('Secure');
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite[0].toUpperCase()}${opts.sameSite.slice(1)}`);
  return parts.join('; ');
}

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

  // 親ドメイン Cookie と (cookie domain 切替前に設定された) ホスト限定 Cookie の両方を消す。
  // 両者は名前が同じでも別オリジン扱いなので両方明示的に expire させる必要がある。
  const expiredCommon = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
  const domainVariant = { ...expiredCommon, domain: isProd ? '.gikyokutosyokan.com' : undefined };
  const hostOnlyVariant = { ...expiredCommon }; // domain属性なし = host-only

  res.setHeader('Set-Cookie', [
    serialize(cookieName, '', domainVariant),
    serialize(cookieName, '', hostOnlyVariant),
    serialize(callbackName, '', { ...domainVariant, httpOnly: false }),
    serialize(callbackName, '', { ...hostOnlyVariant, httpOnly: false }),
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
