/**
 * 演劇メニュー辞典のアイキャッチ画像を Gemini (Nano Banana) で生成し S3 にアップ。
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/generate-theater-menu-images.ts
 *   set -a && source .env.local && set +a && npx tsx scripts/generate-theater-menu-images.ts --force  # 既存も再生成
 */
import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const S3_BUCKET = process.env.AWS_S3_BUCKET || "";
const S3_REGION = process.env.AWS_REGION || "ap-northeast-1";
const GEMINI_MODEL = "gemini-2.5-flash-image";
const FORCE = process.argv.includes("--force");

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const CATEGORY_MOOD: Record<string, string> = {
  "warmup": "energetic, sunrise colors, bodies stretching and jumping, warm yellows and oranges",
  "voice-training": "sound waves, open mouth silhouette, microphone, blue and teal palette, calm",
  "focus-trust": "two silhouettes holding hands or falling and catching, muted warm palette, trust and connection",
  "movement": "dynamic body silhouettes in motion, flowing lines, purple and pink gradient, dance-like",
  "improv-short": "quick sketch style, playful, comic-book energy, bright colors, spotlights",
  "improv-long": "layered scenes, ensemble on stage, deeper tones, cinematic, dramatic lighting",
  "etude": "two people in intense conversation, chiaroscuro lighting, deep reds and browns, theatrical",
  "devising": "collaborative circle of people creating, colorful abstract shapes coming together",
  "method": "vintage theatrical portrait, classic drama, sepia and burgundy, old book aesthetic",
  "workshop-script": "open script on wooden stage, warm spotlight, book pages, dramatic curtains",
};

function buildPrompt(m: {
  title: string;
  summary: string;
  categorySlug: string;
  tags: string[];
}): string {
  const mood = CATEGORY_MOOD[m.categorySlug] || "abstract theatrical composition";
  return `Create a 16:9 wide banner illustration for a Japanese theater workshop menu called "${m.title}".
Summary: ${m.summary.substring(0, 200)}
Mood and style: ${mood}.
Style: Elegant, artistic, watercolor-inspired flat illustration, minimalist, editorial quality suitable for a theater education website.
Do NOT include any text, letters, numbers, or typography in the image.
Aspect ratio: landscape 16:9.
The image should evoke the mood and technique without depicting specific characters realistically. Human silhouettes and abstract shapes are welcome.`;
}

async function generateImage(prompt: string): Promise<Buffer | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`  API error ${res.status}: ${errText.substring(0, 200)}`);
      return null;
    }
    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith("image/"));
    if (!imagePart) {
      console.error("  No image in response");
      return null;
    }
    return Buffer.from(imagePart.inlineData.data, "base64");
  } catch (err: any) {
    console.error(`  Fetch error: ${err.message}`);
    return null;
  }
}

async function uploadToS3(buffer: Buffer, slug: string): Promise<string> {
  const key = `theater-menu/${slug}.webp`;
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY が設定されていません");
    process.exit(1);
  }
  const menus = await prisma.theaterMenu.findMany({
    where: FORCE ? {} : { imageUrl: null },
    include: { category: { select: { slug: true } } },
    orderBy: { id: "asc" },
  });
  console.log(`対象: ${menus.length}件 (FORCE=${FORCE})\n`);

  let success = 0;
  let failed = 0;

  for (const m of menus) {
    console.log(`[${m.id}] ${m.slug}`);
    const prompt = buildPrompt({
      title: m.title,
      summary: m.summary,
      categorySlug: m.category.slug,
      tags: m.tags,
    });
    const buf = await generateImage(prompt);
    if (!buf) {
      console.log("  SKIP");
      failed++;
      continue;
    }
    try {
      const url = await uploadToS3(buf, m.slug);
      await prisma.theaterMenu.update({
        where: { id: m.id },
        data: { imageUrl: url },
      });
      console.log(`  OK → ${url}`);
      success++;
    } catch (err: any) {
      console.error(`  S3 error: ${err.message}`);
      failed++;
    }
    // レート制限
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`\n完了! 成功: ${success} 失敗: ${failed}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
