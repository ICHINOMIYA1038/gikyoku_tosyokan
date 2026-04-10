import { prisma } from '@/lib/prisma';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  ogImageUrl?: string | null;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    return null;
  }

  return {
    slug: post.slug,
    title: post.title,
    date: formatDate(post.publishedAt),
    description: post.description || '',
    tags: post.tags,
    content: post.content,
    ogImageUrl: post.ogImageUrl,
  };
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      slug: true,
      title: true,
      publishedAt: true,
      description: true,
      tags: true,
    },
  });

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: formatDate(post.publishedAt),
    description: post.description || '',
    tags: post.tags,
  }));
}

export async function getPostsByTag(tag: string): Promise<BlogPostMeta[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      tags: { has: tag },
    },
    orderBy: { publishedAt: 'desc' },
    select: {
      slug: true,
      title: true,
      publishedAt: true,
      description: true,
      tags: true,
    },
  });

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: formatDate(post.publishedAt),
    description: post.description || '',
    tags: post.tags,
  }));
}

export async function getPostsByLanguage(lang: string): Promise<BlogPostMeta[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, language: lang },
    orderBy: { publishedAt: 'desc' },
    select: {
      slug: true,
      title: true,
      publishedAt: true,
      description: true,
      tags: true,
    },
  });

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: formatDate(post.publishedAt),
    description: post.description || '',
    tags: post.tags,
  }));
}

export async function getPostSlugsByLanguage(lang: string): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, language: lang },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}

export async function getAlternateLanguageSlug(
  slug: string,
  currentLang: string
): Promise<string | null> {
  const alternateLang = currentLang === 'ja' ? 'en' : 'ja';
  const post = await prisma.blogPost.findFirst({
    where: { slug, language: alternateLang, published: true },
    select: { slug: true },
  });
  return post ? post.slug : null;
}

/**
 * タグが最も多く一致するブログ記事を返す（自分自身を除く）。
 * 一致タグ数が多い順、次に公開日が新しい順にソート。
 */
export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  language: string = 'ja',
  limit: number = 5
): Promise<BlogPostMeta[]> {
  if (tags.length === 0) return [];

  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      language,
      slug: { not: currentSlug },
      tags: { hasSome: tags },
    },
    select: {
      slug: true,
      title: true,
      publishedAt: true,
      description: true,
      tags: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 30,
  });

  const scored = posts.map((post) => {
    const matchCount = post.tags.filter((t) => tags.includes(t)).length;
    return { post, matchCount };
  });

  scored.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    return b.post.publishedAt.getTime() - a.post.publishedAt.getTime();
  });

  return scored.slice(0, limit).map(({ post }) => ({
    slug: post.slug,
    title: post.title,
    date: formatDate(post.publishedAt),
    description: post.description || '',
    tags: post.tags,
  }));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { tags: true },
  });

  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
