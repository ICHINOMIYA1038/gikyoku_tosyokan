import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/**
 * コメントソフト削除API
 * - 本人のみ削除可能
 * - サイトADMIN/MODERATORは常に削除可能
 * - soft delete（content を置換）
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "このメソッドは許可されていません" });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  const { commentId, isParent } = req.body;
  if (!commentId || typeof commentId !== "number" || typeof isParent !== "boolean") {
    return res.status(400).json({ error: "パラメータが不正です" });
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "MODERATOR";

  try {
    if (isParent) {
      const comment = await prisma.parentComment.findUnique({
        where: { id: commentId },
        select: { userId: true, deleted: true },
      });
      if (!comment) return res.status(404).json({ error: "コメントが見つかりません" });
      if (comment.deleted) return res.status(400).json({ error: "既に削除されています" });
      if (comment.userId !== userId && !isAdmin) {
        return res.status(403).json({ error: "このコメントを削除する権限がありません" });
      }
      await prisma.parentComment.update({
        where: { id: commentId },
        data: { deleted: true, content: "[削除されたコメントです]" },
      });
    } else {
      const comment = await prisma.childComment.findUnique({
        where: { id: commentId },
        select: { userId: true, deleted: true },
      });
      if (!comment) return res.status(404).json({ error: "コメントが見つかりません" });
      if (comment.deleted) return res.status(400).json({ error: "既に削除されています" });
      if (comment.userId !== userId && !isAdmin) {
        return res.status(403).json({ error: "このコメントを削除する権限がありません" });
      }
      await prisma.childComment.update({
        where: { id: commentId },
        data: { deleted: true, content: "[削除されたコメントです]" },
      });
    }
    // ISRキャッシュを再検証
    const { postId } = req.body;
    if (postId) {
      try { await res.revalidate(`/posts/${postId}`); } catch {}
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "削除中にエラーが発生しました" });
  }
}
