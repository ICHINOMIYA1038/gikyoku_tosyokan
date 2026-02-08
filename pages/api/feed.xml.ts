import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

function escapeXml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRssFeed(posts: any[], blogPosts: any[]): string {
  const siteUrl = "https://gikyokutosyokan.com";
  const buildDate = new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>戯曲図書館 - 最新作品・ブログ</title>
    <link>${siteUrl}</link>
    <description>戯曲図書館の最新作品情報とブログ記事をお届けします。上演時間や人数などから脚本を検索できます。</description>
    <language>ja</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        const postUrl = `${siteUrl}/posts/${post.id}`;
        const pubDate = post.createdAt ? new Date(post.createdAt).toUTCString() : buildDate;

        // 作品情報の詳細な説明を生成
        let description = "";
        if (post.synopsis) {
          description = escapeXml(post.synopsis.substring(0, 200));
        }

        // 追加情報
        const details = [];
        if (post.playtime && post.playtime !== -1) {
          details.push(`上演時間: 約${post.playtime}分`);
        }
        if (post.man && post.man !== -1) {
          details.push(`男性: ${post.man}人`);
        }
        if (post.woman && post.woman !== -1) {
          details.push(`女性: ${post.woman}人`);
        }

        if (details.length > 0) {
          description += ` [${details.join(", ")}]`;
        }

        return `
    <item>
      <title>${escapeXml(post.title)} - ${escapeXml(post.author?.name || "作者不明")}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(post.author?.name || "作者不明")}</dc:creator>
      ${post.categories?.map((cat: any) => `<category>${escapeXml(cat.name)}</category>`).join("\n      ") || ""}
    </item>`;
      })
      .join("")}
    ${blogPosts
      .map((bp) => {
        const bpUrl = `${siteUrl}/blog/${bp.language}/${bp.slug}`;
        const pubDate = bp.publishedAt ? new Date(bp.publishedAt).toUTCString() : buildDate;
        const description = bp.description ? escapeXml(bp.description.substring(0, 200)) : "";

        return `
    <item>
      <title>${escapeXml(bp.title)}</title>
      <link>${bpUrl}</link>
      <guid isPermaLink="true">${bpUrl}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>戯曲図書館</dc:creator>
      ${bp.tags?.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join("\n      ") || ""}
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 最新30件の投稿を取得
    const posts = await prisma.post.findMany({
      take: 30,
      orderBy: {
        id: "desc",
      },
      include: {
        author: true,
        categories: true,
      },
    });

    // 最新30件のブログ記事を取得
    const blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
      take: 30,
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        title: true,
        description: true,
        language: true,
        publishedAt: true,
        tags: true,
      },
    });

    const rssFeed = generateRssFeed(posts, blogPosts);

    // キャッシュヘッダーを設定
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );

    res.status(200).send(rssFeed);
  } catch (error) {
    console.error("RSS feed generation error:", error);
    res.status(500).json({ error: "Failed to generate RSS feed" });
  }
}