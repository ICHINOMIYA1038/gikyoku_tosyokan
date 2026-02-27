import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const all = await prisma.postTheaterGroup.findMany({
    include: {
      post: { select: { id: true, title: true, author: { select: { name: true } } } },
      theaterGroup: { select: { id: true, name: true, slug: true, website: true, twitter: true, corich: true, groupType: true } }
    },
    orderBy: { theaterGroupId: 'asc' }
  });

  // Group by theater group
  const grouped: Record<number, any> = {};
  for (const ptg of all) {
    const gid = ptg.theaterGroupId;
    if (!grouped[gid]) {
      grouped[gid] = {
        theaterGroup: ptg.theaterGroup,
        posts: []
      };
    }
    grouped[gid].posts.push({
      ptgId: ptg.id,
      postId: ptg.post.id,
      postTitle: ptg.post.title,
      authorName: ptg.post.author?.name,
      sourceUrl: ptg.sourceUrl,
      performanceYear: ptg.performanceYear,
    });
  }

  res.json({
    totalRecords: all.length,
    totalGroups: Object.keys(grouped).length,
    groups: Object.values(grouped)
  });
}
