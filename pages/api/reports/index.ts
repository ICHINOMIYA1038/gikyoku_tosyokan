import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

const VALID_REASONS = [
  'スパム・宣伝',
  '誹謗中傷・差別',
  '個人情報の露出',
  '著作権侵害',
  '不適切なコンテンツ',
  'なりすまし',
  'その他',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  const { reason, details, targetType, targetId, targetUrl } = req.body;

  if (!reason || !VALID_REASONS.includes(reason)) {
    return res.status(400).json({ error: '通報理由を選択してください' });
  }
  if (!targetType || !['comment', 'announcement', 'user'].includes(targetType)) {
    return res.status(400).json({ error: '通報対象が不正です' });
  }
  if (!targetId) {
    return res.status(400).json({ error: '通報対象IDが不正です' });
  }

  // 同一ユーザーからの同一対象への重複通報を防止
  const existing = await prisma.report.findFirst({
    where: {
      reporterId: session.user.id,
      targetType,
      targetId: String(targetId),
      status: 'PENDING',
    },
  });
  if (existing) {
    return res.status(409).json({ error: 'この内容は既に通報済みです' });
  }

  const report = await prisma.report.create({
    data: {
      reporterId: session.user.id,
      reason,
      details: details?.substring(0, 500) || null,
      targetType,
      targetId: String(targetId),
      targetUrl: targetUrl || null,
    },
  });

  // メール通知（運営者へ）
  try {
    const { sendMail } = await import('@/lib/mailer');
    await sendMail({
      from: `戯曲図書館 <${process.env.GMAIL_USER || 'noreply@gikyokutosyokan.com'}>`,
      to: 'gekidankatakago@gmail.com',
      subject: `【通報】${reason} - ${targetType}`,
      text: `通報がありました。\n\n理由: ${reason}\n詳細: ${details || 'なし'}\n対象: ${targetType} (ID: ${targetId})\nURL: ${targetUrl || 'なし'}\n通報者: ${session.user.email}\n\n管理画面で確認してください。`,
    });
  } catch {}

  return res.status(201).json({ id: report.id, message: '通報を受け付けました' });
}
