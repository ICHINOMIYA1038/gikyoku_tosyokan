import type { NextApiRequest, NextApiResponse, GetServerSidePropsContext } from 'next';
import { getServerSession, type Session } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import type { UserRole } from '@prisma/client';

/**
 * API Route から現在のセッションを取得（ログインしていない場合はnull）
 */
export async function getAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> {
  return getServerSession(req, res, authOptions);
}

/**
 * getServerSideProps から現在のセッションを取得
 */
export async function getAuthSSP(
  context: GetServerSidePropsContext
): Promise<Session | null> {
  return getServerSession(context.req, context.res, authOptions);
}

/**
 * API Route でログイン必須のチェック。未ログイン時は401を返して false を返す。
 *
 * 使い方:
 *   const session = await requireAuth(req, res);
 *   if (!session) return; // 401送信済み
 *   console.log(session.user.id);
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Session | null> {
  const session = await getAuth(req, res);
  if (!session) {
    res.status(401).json({ error: 'ログインが必要です' });
    return null;
  }
  return session;
}

/**
 * 特定のロール以上の権限が必要なAPI向け。
 */
export async function requireRole(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles: UserRole[]
): Promise<Session | null> {
  const session = await requireAuth(req, res);
  if (!session) return null;

  if (!allowedRoles.includes(session.user.role)) {
    res.status(403).json({ error: 'この操作を行う権限がありません' });
    return null;
  }
  return session;
}
