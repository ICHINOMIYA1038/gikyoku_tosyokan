import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const session = await requireAuth(req, res);
  if (!session) return;

  const recruitmentId = req.query.id as string;
  const userId = session.user.id;

  const recruitment = await prisma.recruitment.findUnique({
    where: { id: recruitmentId },
    select: { id: true, postedBy: true, title: true, status: true },
  });
  if (!recruitment) return res.status(404).json({ error: '募集が見つかりません' });
  if (recruitment.postedBy === userId) return res.status(400).json({ error: '自分の募集です' });

  // トグル
  const existing = await prisma.interest.findUnique({
    where: { recruitmentId_userId: { recruitmentId, userId } },
  });

  if (existing) {
    await prisma.interest.delete({ where: { id: existing.id } });
    return res.status(200).json({ interested: false });
  }

  await prisma.interest.create({ data: { recruitmentId, userId } });

  // 募集者に通知メッセージ
  try {
    const [p1, p2] = [userId, recruitment.postedBy].sort();
    let conversation = await prisma.conversation.findUnique({
      where: { participant1_participant2: { participant1: p1, participant2: p2 } },
    });
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { participant1: p1, participant2: p2 },
      });
    }

    const senderName = session.user.name || 'ユーザー';
    const content = `「${recruitment.title}」に興味があります！`;

    await prisma.message.create({
      data: { conversationId: conversation.id, senderId: userId, receiverId: recruitment.postedBy, content },
    });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessage: content, lastAt: new Date() },
    });

    // メール通知
    const poster = await prisma.user.findUnique({
      where: { id: recruitment.postedBy },
      select: { email: true, displayName: true, name: true },
    });
    if (poster?.email) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `戯曲図書館 <noreply@${process.env.RESEND_DOMAIN || 'gikyokutosyokan.com'}>`,
        to: poster.email,
        subject: `${senderName}さんが「${recruitment.title}」に興味を示しています`,
        text: `${poster.displayName || poster.name}さん\n\n${senderName}さんが「${recruitment.title}」に興味を示しています。\nプロフィールを確認して、メッセージを送ってみましょう。\n\n確認する: https://gikyokutosyokan.com/messages/${conversation.id}\n\n---\n戯曲図書館`,
      });
    }
  } catch {}

  return res.status(200).json({ interested: true });
}
