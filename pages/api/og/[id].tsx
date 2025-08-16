import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// OG画像生成用のSVGテンプレート
function generateOgImage(post: any): string {
  const title = post.title || "戯曲図書館";
  const author = post.author?.name || "";
  const playtime = post.playtime && post.playtime !== -1 ? `${post.playtime}分` : "";
  const people = [];
  
  if (post.man && post.man !== -1) people.push(`男${post.man}`);
  if (post.woman && post.woman !== -1) people.push(`女${post.woman}`);
  
  const peopleText = people.join(" ");

  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fce7f3;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fbcfe8;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
        </filter>
      </defs>
      
      <!-- 背景 -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- パターン装飾 -->
      <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="2" fill="#ec4899" opacity="0.1"/>
      </pattern>
      <rect width="1200" height="630" fill="url(#dots)"/>
      
      <!-- メインカード -->
      <rect x="60" y="60" width="1080" height="510" rx="20" fill="white" filter="url(#shadow)"/>
      
      <!-- ロゴ・サイト名 -->
      <text x="100" y="120" font-family="Noto Sans JP, sans-serif" font-size="28" font-weight="bold" fill="#ec4899">
        戯曲図書館
      </text>
      
      <!-- タイトル -->
      <text x="100" y="250" font-family="Noto Sans JP, sans-serif" font-size="56" font-weight="bold" fill="#1f2937">
        ${escapeXml(truncateText(title, 20))}
      </text>
      
      <!-- 作者名 -->
      <text x="100" y="330" font-family="Noto Sans JP, sans-serif" font-size="36" fill="#4b5563">
        ${escapeXml(author)}
      </text>
      
      <!-- 詳細情報 -->
      <g transform="translate(100, 420)">
        ${playtime ? `
        <rect x="0" y="0" width="120" height="40" rx="20" fill="#ddd6fe"/>
        <text x="60" y="26" font-family="Noto Sans JP, sans-serif" font-size="20" text-anchor="middle" fill="#5b21b6">
          ${playtime}
        </text>` : ''}
        
        ${peopleText ? `
        <rect x="${playtime ? '140' : '0'}" y="0" width="160" height="40" rx="20" fill="#fed7aa"/>
        <text x="${playtime ? '220' : '80'}" y="26" font-family="Noto Sans JP, sans-serif" font-size="20" text-anchor="middle" fill="#9a3412">
          ${peopleText}
        </text>` : ''}
      </g>
      
      <!-- URL -->
      <text x="100" y="520" font-family="Noto Sans JP, sans-serif" font-size="18" fill="#6b7280">
        gikyokutosyokan.com/posts/${post.id}
      </text>
    </svg>
  `;
}

function escapeXml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || "";
  return text.substring(0, maxLength - 1) + "...";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      // デフォルトのOG画像を返す
      const defaultSvg = `
        <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#fce7f3;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#fbcfe8;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#bg)"/>
          <text x="600" y="280" font-family="Noto Sans JP, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#1f2937">
            戯曲図書館
          </text>
          <text x="600" y="360" font-family="Noto Sans JP, sans-serif" font-size="32" text-anchor="middle" fill="#4b5563">
            上演する脚本を探しの方に
          </text>
        </svg>
      `;
      
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.status(200).send(defaultSvg);
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const svg = generateOgImage(post);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=31536000, immutable"
    );

    res.status(200).send(svg);
  } catch (error) {
    console.error("OG image generation error:", error);
    res.status(500).json({ error: "Failed to generate OG image" });
  } finally {
    await prisma.$disconnect();
  }
}