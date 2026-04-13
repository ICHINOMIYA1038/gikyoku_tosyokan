import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return;
  const userId = session.user.id;
  const conversationId = req.query.conversationId as string;

  // 会話の参加者であることを確認
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation || (conversation.participant1 !== userId && conversation.participant2 !== userId)) {
    return res.status(403).json({ error: 'この会話にアクセスする権限がありません' });
  }

  if (req.method === 'GET') {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: {
        id: true,
        content: true,
        senderId: true,
        createdAt: true,
        readAt: true,
      },
    });

    // 未読メッセージを既読にする
    await prisma.message.updateMany({
      where: { conversationId, receiverId: userId, readAt: null },
      data: { readAt: new Date() },
    });

    const otherId = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
    const other = await prisma.user.findUnique({
      where: { id: otherId },
      select: { id: true, name: true, displayName: true, image: true, avatarUrl: true },
    });

    return res.status(200).json({
      messages: messages.map((m) => ({
        ...m,
        isMine: m.senderId === userId,
        createdAt: m.createdAt.toISOString(),
      })),
      other: other ? {
        id: other.id,
        name: other.displayName || other.name,
        image: other.avatarUrl || other.image,
      } : null,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
