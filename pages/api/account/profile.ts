import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { publicName } from '@/lib/public-name';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await requireAuth(req, res);
  if (!session) return;

  const { displayName, bio, groupName, avatarUrl, emailOptIn, completeOnboarding } = req.body;

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
  if (completeOnboarding === true) {
    data.onboardedAt = new Date();
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

  // 表示名を変えたら、過去のコメント・告知の投稿者名を揃え、コメントのある作品ページを作り直す
  if (displayName !== undefined) {
    const name = publicName(updated);
    await prisma.parentComment.updateMany({ where: { userId: updated.id, deleted: false }, data: { author: name } });
    await prisma.childComment.updateMany({ where: { userId: updated.id, deleted: false }, data: { author: name } });
    await prisma.announcement.updateMany({ where: { userId: updated.id }, data: { authorName: name } });
    const posts = await prisma.parentComment.findMany({
      where: { userId: updated.id },
      select: { post_id: true },
      distinct: ['post_id'],
      take: 100,
    });
    await Promise.all(posts.map((p) => res.revalidate(`/posts/${p.post_id}`).catch(() => {})));
  }

  return res.status(200).json(updated);
}
