import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return;
  const userId = session.user.id;

  if (req.method === 'GET') {
    // 会話一覧
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participant1: userId }, { participant2: userId }],
      },
      orderBy: { lastAt: 'desc' },
      take: 50,
    });

    // 相手のユーザー情報を取得
    const otherIds = conversations.map((c) =>
      c.participant1 === userId ? c.participant2 : c.participant1
    );
    const users = await prisma.user.findMany({
      where: { id: { in: otherIds } },
      select: { id: true, name: true, displayName: true, image: true, avatarUrl: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    // 未読数
    const unreadCounts = await prisma.message.groupBy({
      by: ['conversationId'],
      where: { receiverId: userId, readAt: null },
      _count: true,
    });
    const unreadMap = new Map(unreadCounts.map((u) => [u.conversationId, u._count]));

    const result = conversations.map((c) => {
      const otherId = c.participant1 === userId ? c.participant2 : c.participant1;
      const other = userMap.get(otherId);
      return {
        id: c.id,
        other: other ? {
          id: other.id,
          name: other.displayName || other.name,
          image: other.avatarUrl || other.image,
        } : null,
        lastMessage: c.lastMessage,
        lastAt: c.lastAt.toISOString(),
        unread: unreadMap.get(c.id) || 0,
      };
    });

    return res.status(200).json(result);
  }

  if (req.method === 'POST') {
    // 新しいメッセージ送信
    const { receiverId, content } = req.body;
    if (!receiverId || !content?.trim()) {
      return res.status(400).json({ error: '宛先とメッセージは必須です' });
    }
    if (receiverId === userId) {
      return res.status(400).json({ error: '自分自身にはメッセージを送れません' });
    }
    if (content.length > 2000) {
      return res.status(400).json({ error: 'メッセージは2000文字以内です' });
    }

    // 相手が存在するか
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    // 会話を取得or作成（participant1 < participant2 でソートして一意に）
    const [p1, p2] = [userId, receiverId].sort();
    let conversation = await prisma.conversation.findUnique({
      where: { participant1_participant2: { participant1: p1, participant2: p2 } },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { participant1: p1, participant2: p2 },
      });
    }

    // メッセージ作成
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        receiverId,
        content: content.trim(),
      },
    });

    // 会話の最終メッセージ更新
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: content.substring(0, 100),
        lastAt: new Date(),
      },
    });

    // メール通知
    try {
      if (receiver.email) {
        const senderName = session.user.name || 'ユーザー';
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: `戯曲図書館 <noreply@${process.env.RESEND_DOMAIN || 'gikyokutosyokan.com'}>`,
          to: receiver.email,
          subject: `${senderName}さんからメッセージが届きました`,
          text: `${receiver.displayName || receiver.name}さん\n\n${senderName}さんからメッセージが届きました。\n\n「${content.substring(0, 100)}${content.length > 100 ? '...' : ''}」\n\n確認する: https://gikyokutosyokan.com/messages/${conversation.id}\n\n---\n戯曲図書館`,
        });
      }
    } catch {}

    return res.status(201).json({
      id: message.id,
      conversationId: conversation.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
