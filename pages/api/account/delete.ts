import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * アカウント完全削除API
 *
 * 削除される情報:
 * - User レコード
 * - Account レコード（Google連携情報）
 * - Session レコード
 *
 * 残る情報（匿名化）:
 * - ParentComment: userId を null に、author を「退会済みユーザー」に
 * - ChildComment: 同上
 *
 * セキュリティ:
 * - ログイン必須（requireAuth）
 * - 自分自身のアカウントのみ削除可能
 * - トランザクションで原子性を保証
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'このメソッドは許可されていません' });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. コメントを匿名化（削除ではなく、userId を外してauthorを変更）
      await tx.parentComment.updateMany({
        where: { userId },
        data: { userId: null, author: '退会済みユーザー' },
      });
      await tx.childComment.updateMany({
        where: { userId },
        data: { userId: null, author: '退会済みユーザー' },
      });

      // 2. Session削除
      await tx.session.deleteMany({
        where: { userId },
      });

      // 3. Account削除（Google連携情報）
      await tx.account.deleteMany({
        where: { userId },
      });

      // 4. User削除
      await tx.user.delete({
        where: { id: userId },
      });
    });

    console.log(`[account] Deleted account: ${userId}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[account] Delete error:', error);
    res.status(500).json({ error: 'アカウント削除中にエラーが発生しました' });
  }
}
