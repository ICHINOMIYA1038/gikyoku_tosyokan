import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  const { displayName, bio, groupName, avatarUrl, emailOptIn } = req.body;

  // バリデーション
  if (displayName !== undefined && typeof displayName !== 'string') {
    return res.status(400).json({ error: '表示名が不正です' });
  }
  if (displayName && displayName.length > 50) {
    return res.status(400).json({ error: '表示名は50文字以内で入力してください' });
  }
  if (bio !== undefined && typeof bio !== 'string') {
    return res.status(400).json({ error: '自己紹介が不正です' });
  }
  if (bio && bio.length > 500) {
    return res.status(400).json({ error: '自己紹介は500文字以内で入力してください' });
  }
  if (groupName !== undefined && typeof groupName !== 'string') {
    return res.status(400).json({ error: '劇団名が不正です' });
  }
  if (groupName && groupName.length > 100) {
    return res.status(400).json({ error: '劇団名は100文字以内で入力してください' });
  }

  const data: Record<string, string | boolean | Date | null> = {};
  if (displayName !== undefined) data.displayName = displayName || null;
  if (bio !== undefined) data.bio = bio || null;
  if (groupName !== undefined) data.groupName = groupName || null;
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl || null;
  if (typeof emailOptIn === "boolean") {
    data.emailOptIn = emailOptIn;
    data.emailOptInAt = emailOptIn ? new Date() : null;
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: {
      id: true,
      name: true,
      displayName: true,
      bio: true,
      groupName: true,
      image: true,
      avatarUrl: true,
    },
  });

  return res.status(200).json(updated);
}
