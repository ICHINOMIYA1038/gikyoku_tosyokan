import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const session = await requireAuth(req, res);
  if (!session) return;

  const recruitmentId = req.query.id as string;
  const { message } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: '応募メッセージは必須です' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'メッセージは2000文字以内です' });
  }

  const recruitment = await prisma.recruitment.findUnique({
    where: { id: recruitmentId },
    select: { id: true, status: true, postedBy: true, title: true },
  });

  if (!recruitment) return res.status(404).json({ error: '募集が見つかりません' });
  if (recruitment.status !== 'ACTIVE') return res.status(400).json({ error: 'この募集は現在受付停止中です' });
  if (recruitment.postedBy === session.user.id) return res.status(400).json({ error: '自分の募集には応募できません' });

  // 重複応募チェック
  const existing = await prisma.application.findUnique({
    where: { recruitmentId_applicantId: { recruitmentId, applicantId: session.user.id } },
  });
  if (existing) return res.status(409).json({ error: '既に応募済みです' });

  const application = await prisma.application.create({
    data: {
      recruitmentId,
      applicantId: session.user.id,
      message: message.trim(),
    },
  });

  // 募集者にメッセージ送信（サイト内メッセージ）
  const [p1, p2] = [session.user.id, recruitment.postedBy].sort();
  let conversation = await prisma.conversation.findUnique({
    where: { participant1_participant2: { participant1: p1, participant2: p2 } },
  });
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { participant1: p1, participant2: p2 },
    });
  }

  const autoMessage = `【${recruitment.title}】に応募しました。\n\n${message.trim()}`;
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      receiverId: recruitment.postedBy,
      content: autoMessage,
    },
  });
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessage: autoMessage.substring(0, 100), lastAt: new Date() },
  });

  // メール通知
  try {
    const poster = await prisma.user.findUnique({
      where: { id: recruitment.postedBy },
      select: { email: true, displayName: true, name: true },
    });
    if (poster?.email) {
      const applicantName = session.user.name || 'ユーザー';
      const { sendMail } = await import('@/lib/mailer');
      await sendMail({
        from: `戯曲図書館 <${process.env.GMAIL_USER || 'noreply@gikyokutosyokan.com'}>`,
        to: poster.email,
        subject: `【応募】${applicantName}さんが「${recruitment.title}」に応募しました`,
        text: `${poster.displayName || poster.name}さん\n\n${applicantName}さんが「${recruitment.title}」に応募しました。\n\nメッセージ:\n${message.substring(0, 300)}\n\n確認する: https://gikyokutosyokan.com/messages/${conversation.id}\n\n---\n戯曲図書館`,
      });
    }
  } catch {}

  return res.status(201).json({ id: application.id, conversationId: conversation.id });
}
