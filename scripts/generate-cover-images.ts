/**
 * Nano Banana (gemini-2.5-flash-image) で作品のカバー画像を一括生成し、S3にアップロード
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/generate-cover-images.ts
 *
 * 環境変数:
 *   GEMINI_API_KEY      — Google AI Studio APIキー
 *   S3_AWS_ACCESS_KEY   — S3アクセスキー
 *   S3_AWS_SECRET_ACCESS_KEY — S3シークレットキー
 *   AWS_S3_BUCKET       — S3バケット名
 *   AWS_REGION          — AWSリージョン
 */
import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const S3_BUCKET = process.env.AWS_S3_BUCKET || "";
const S3_REGION = process.env.AWS_REGION || "ap-northeast-1";
const GEMINI_MODEL = "gemini-2.5-flash-image"; // Nano Banana

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// カテゴリ別のスタイルヒント
const CATEGORY_STYLES: Record<string, string> = {
  "コメディ": "warm colors, cheerful atmosphere, playful composition",
  "不条理劇": "surreal, dreamlike, muted tones, abstract shapes",
  "会話劇": "intimate setting, soft lighting, two people talking",
  "人数多数": "ensemble, crowd scene, dynamic composition",
  "青春": "bright, youthful energy, school or outdoor setting",
};

function buildPrompt(post: {
  title: string;
  author: string;
  categories: string[];
  synopsis: string | null;
  aiDescription: string | null;
  playtime: number | null;
}): string {
  const categoryStyle = post.categories
    .map((c) => CATEGORY_STYLES[c])
    .filter(Boolean)
    .join(", ");

  const description = post.synopsis || post.aiDescription || "";
  const descHint = description
    ? `The play is about: ${description.substring(0, 150)}`
    : "";

  return `Create a beautiful book cover illustration for a Japanese theater script (戯曲).
Title: "${post.title}" by ${post.author}.
${descHint}
Style: Elegant, artistic, watercolor-inspired illustration suitable for a theater poster.
${categoryStyle ? `Mood: ${categoryStyle}.` : ""}
Do NOT include any text, letters, or typography in the image.
Aspect ratio: portrait (2:3).
The image should evoke the mood and atmosphere of the play without depicting specific characters.`;
}

async function generateImage(prompt: string): Promise<Buffer | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    },
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

async function uploadToS3(buffer: Buffer, postId: number): Promise<string> {
  const key = `covers/post-${postId}.webp`;

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
    })
  );

  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY が設定されていません");
    process.exit(1);
  }

  // 画像がない作品を取得
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ image_url: null }, { image_url: "" }],
    },
    select: {
      id: true,
      title: true,
      synopsis: true,
      aiDescription: true,
      playtime: true,
      author: { select: { name: true } },
      categories: { select: { name: true } },
    },
    orderBy: { id: "asc" },
  });

  console.log(`画像なし作品: ${posts.length}件\n`);

  let success = 0;
  let failed = 0;

  for (const post of posts) {
    console.log(`[${post.id}] ${post.title}`);

    const prompt = buildPrompt({
      title: post.title,
      author: post.author.name,
      categories: post.categories.map((c) => c.name),
      synopsis: post.synopsis,
      aiDescription: post.aiDescription,
      playtime: post.playtime,
    });

    const imageBuffer = await generateImage(prompt);
    if (!imageBuffer) {
      console.log("  SKIP (生成失敗)");
      failed++;
      continue;
    }

    try {
      const imageUrl = await uploadToS3(imageBuffer, post.id);
      await prisma.post.update({
        where: { id: post.id },
        data: { image_url: imageUrl },
      });
      console.log(`  OK → ${imageUrl}`);
      success++;
    } catch (err: any) {
      console.error(`  S3 error: ${err.message}`);
      failed++;
    }

    // レート制限対策: 1秒待機
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n完了! 成功: ${success}, 失敗: ${failed}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
