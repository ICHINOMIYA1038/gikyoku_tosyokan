/**
 * 案内メール一斉送信 API。
 *   POST: 送信実行 (subject, bodyHtml, bodyText? を受け取る)
 *   GET : 過去の送信ログ一覧
 *
 * ADMIN ロールのみ許可。送信は同期実行（数百人想定）。
 * 各受信者には個別の配信停止リンク付きで送信する。
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return;

  // ADMIN チェック
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, displayName: true },
  });
  if (!me || me.role !== "ADMIN") {
    return res.status(403).json({ error: "管理者権限が必要です" });
  }

  if (req.method === "GET") {
    const list = await prisma.broadcast.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.status(200).json({ items: list });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, bodyHtml, bodyText, mode, userIds } = req.body as {
    subject?: string;
    bodyHtml?: string;
    bodyText?: string;
    /** "all" = 全オプトインユーザー（既定） / "selected" = userIds で指定したユーザーのみ */
    mode?: "all" | "selected";
    userIds?: string[];
  };
  if (!subject?.trim() || !bodyHtml?.trim()) {
    return res.status(400).json({ error: "件名・本文は必須です" });
  }
  if (subject.length > 200) {
    return res.status(400).json({ error: "件名は200文字以内です" });
  }
  if (mode === "selected" && (!Array.isArray(userIds) || userIds.length === 0)) {
    return res.status(400).json({ error: "送信先ユーザーを1人以上選んでください" });
  }

  // 配信対象。常に emailOptIn=true かつメール有のユーザーに絞る
  // （個別選択時も「配信を許可していない人には送らない」セーフティを維持）
  const whereBase = {
    emailOptIn: true,
    email: { not: null },
  } as const;
  const where =
    mode === "selected"
      ? { ...whereBase, id: { in: userIds as string[] } }
      : whereBase;
  const recipients = await prisma.user.findMany({
    where,
    select: { id: true, email: true, displayName: true, name: true, unsubscribeToken: true },
  });
  if (recipients.length === 0) {
    return res.status(400).json({
      error: "送信対象が0人です（配信OFFのユーザーを選択していませんか？）",
    });
  }

  // unsubscribeToken が無い既存ユーザーには発行
  for (const r of recipients) {
    if (!r.unsubscribeToken) {
      r.unsubscribeToken = randomBytes(24).toString("base64url");
      await prisma.user.update({
        where: { id: r.id },
        data: { unsubscribeToken: r.unsubscribeToken },
      });
    }
  }

  const broadcast = await prisma.broadcast.create({
    data: {
      authorId: session.user.id,
      subject,
      bodyHtml,
      bodyText: bodyText || null,
      recipientCount: recipients.length,
      status: "sending",
      startedAt: new Date(),
    },
  });

  const { sendMail } = await import("@/lib/mailer");
  const { broadcastMail } = await import("@/lib/mail-templates");
  const fromAddr = process.env.GMAIL_USER || "noreply@gikyokutosyokan.com";

  let succeeded = 0;
  let failed = 0;
  const failedEmails: string[] = [];

  for (const r of recipients) {
    if (!r.email || !r.unsubscribeToken) {
      failed += 1;
      continue;
    }
    try {
      const t = broadcastMail({
        displayName: r.displayName ?? r.name,
        subject,
        bodyHtml,
        bodyText,
        unsubscribeToken: r.unsubscribeToken,
      });
      await sendMail({
        from: `戯曲図書館 <${fromAddr}>`,
        to: r.email,
        subject: t.subject,
        html: t.html,
        text: t.text,
      });
      succeeded += 1;
    } catch (e) {
      console.error("[broadcast] send failed:", r.email, e);
      failed += 1;
      failedEmails.push(r.email);
    }
  }

  const updated = await prisma.broadcast.update({
    where: { id: broadcast.id },
    data: {
      status: failed === 0 ? "completed" : succeeded === 0 ? "failed" : "completed",
      succeededCount: succeeded,
      failedCount: failed,
      finishedAt: new Date(),
    },
  });

  return res.status(200).json({
    broadcast: updated,
    failedEmails,
  });
}
