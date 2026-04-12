import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@/lib/auth";

/**
 * コメント投稿API
 *
 * 認証状態:
 * - ログイン済み: session.user.id/name が紐付く。authorフィールドは表示名として扱う
 * - 未ログイン: 従来通り匿名投稿（author任意指定）
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "このメソッドは許可されていません" });
  }

  const { author, content, isParent, targetid, commentType } = req.body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return res.status(400).json({ error: "コメント本文は必須です" });
  }
  if (content.length > 2000) {
    return res.status(400).json({ error: "コメントは2000文字以内で入力してください" });
  }
  if (!targetid || typeof targetid !== "number") {
    return res.status(400).json({ error: "投稿先IDが不正です" });
  }

  const session = await getAuth(req, res);
  const userId = session?.user?.id ?? null;

  // ログインユーザーはdisplayName > name の優先度でプロフィール名を使う（なりすまし防止）
  let displayAuthor = author || "名無しさん";
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { displayName: true, name: true },
    });
    displayAuthor = dbUser?.displayName || dbUser?.name || displayAuthor;
  }

  try {
    let comment;
    if (isParent) {
      comment = await prisma.parentComment.create({
        data: {
          author: displayAuthor,
          content,
          commentType: commentType || null,
          deleted: false,
          post: { connect: { id: targetid } },
          ...(userId ? { user: { connect: { id: userId } } } : {}),
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });
    } else {
      comment = await prisma.childComment.create({
        data: {
          author: displayAuthor,
          content,
          deleted: false,
          parentComment: { connect: { id: targetid } },
          ...(userId ? { user: { connect: { id: userId } } } : {}),
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      });
    }

    // 日時をJSTフォーマットして返す
    const jst = new Date(
      (comment as { date: Date }).date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
    );
    const formatted = `${jst.getFullYear()}/${jst.getMonth() + 1}/${jst.getDate()} ${jst.getHours()}:${jst.getMinutes()}`;

    // ISRキャッシュを再検証（次回アクセス時に最新コメントが表示される）
    let revalidatePostId: number | null = targetid;
    if (!isParent) {
      // 子コメントの場合、親コメントからpost_idを取得
      const parent = await prisma.parentComment.findUnique({
        where: { id: targetid },
        select: { post_id: true },
      });
      revalidatePostId = parent?.post_id ?? null;
    }
    if (revalidatePostId) {
      try { await res.revalidate(`/posts/${revalidatePostId}`); } catch {}
    }

    res.status(201).json({ ...comment, date: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "コメントの投稿中にエラーが発生しました" });
  }
}
