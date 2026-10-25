import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POST_ID = 698;
const OFFICIAL_PRODUCTION_URL = "https://www.seinenza.com/information/";
const AUTHOR_OFFICIAL_URL = "https://rappaya.jp/";

async function main() {
  if (process.argv[2] !== "--apply") {
    throw new Error("Refusing to write without --apply");
  }

  const current = await prisma.post.findUnique({
    where: { id: POST_ID },
    select: {
      id: true,
      title: true,
      author_id: true,
      synopsis: true,
      aiDescription: true,
      website1: true,
      website2: true,
    },
  });

  if (!current) {
    throw new Error(`Post ${POST_ID} was not found`);
  }
  if (current.title !== "をんな善哉") {
    throw new Error(`Post ${POST_ID} title mismatch: ${current.title}`);
  }

  const synopsis =
    "鈴木聡が作を手がけた劇団青年座第201回公演。劇団青年座の公式公演情報では、2011年5月12日から5月22日までの公演として確認できます。2012年に第15回鶴屋南北戯曲賞を受賞した作品です。";
  const aiDescription =
    "『をんな善哉』は鈴木聡作、劇団青年座第201回公演の戯曲です。公式公演情報で2011年5月の上演と作者名を確認でき、劇団ラッパ屋の公式プロフィールでは第15回鶴屋南北戯曲賞の受賞作として紹介されています。";

  await prisma.post.update({
    where: { id: POST_ID },
    data: {
      synopsis,
      aiDescription,
      website1: OFFICIAL_PRODUCTION_URL,
      website2: AUTHOR_OFFICIAL_URL,
    },
  });

  const updated = await prisma.post.findUnique({
    where: { id: POST_ID },
    select: {
      id: true,
      title: true,
      synopsis: true,
      aiDescription: true,
      website1: true,
      website2: true,
    },
  });
  console.log(JSON.stringify(updated, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
