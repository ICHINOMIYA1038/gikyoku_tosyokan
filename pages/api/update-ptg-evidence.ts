import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// POST /api/update-ptg-evidence
// Body: { updates: [{ ptgId: number, sourceUrl: string, sourceType: string, performanceYear?: number }] }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { updates } = req.body;
  if (!Array.isArray(updates)) return res.status(400).json({ error: 'updates must be an array' });

  let success = 0, failed = 0;
  const errors: any[] = [];

  for (const u of updates) {
    try {
      await prisma.postTheaterGroup.update({
        where: { id: u.ptgId },
        data: {
          ...(u.sourceUrl && { sourceUrl: u.sourceUrl }),
          ...(u.sourceType && { sourceType: u.sourceType }),
          ...(u.performanceYear && { performanceYear: u.performanceYear }),
        },
      });
      success++;
    } catch (err: any) {
      failed++;
      errors.push({ ptgId: u.ptgId, error: err.message });
    }
  }

  res.json({ success, failed, errors });
}
