import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type VerifiedMatch = {
  postId: number;
  postTitle: string;
  authorName?: string;
  theaterGroupId: number;
  theaterGroupName: string;
  confidence: 'high' | 'medium';
  source: string;
};

async function main() {
  const rawData = fs.readFileSync('/tmp/verified-matches.json', 'utf8');
  const matches: VerifiedMatch[] = JSON.parse(rawData);

  // Only use high confidence matches
  const highConfidence = matches.filter(m => m.confidence === 'high');
  console.log(`Total matches: ${matches.length}`);
  console.log(`High confidence: ${highConfidence.length}`);
  console.log(`Seeding high confidence matches...\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const match of highConfidence) {
    try {
      await prisma.postTheaterGroup.upsert({
        where: {
          postId_theaterGroupId: {
            postId: match.postId,
            theaterGroupId: match.theaterGroupId,
          },
        },
        update: {},
        create: {
          postId: match.postId,
          theaterGroupId: match.theaterGroupId,
        },
      });
      created++;
      console.log(`  [OK] ${match.postTitle} × ${match.theaterGroupName}`);
    } catch (err: any) {
      if (err.code === 'P2002') {
        skipped++;
      } else {
        errors++;
        console.error(`  [ERR] ${match.postTitle} × ${match.theaterGroupName}: ${err.message}`);
      }
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Created: ${created}`);
  console.log(`Skipped (duplicate): ${skipped}`);
  console.log(`Errors: ${errors}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
