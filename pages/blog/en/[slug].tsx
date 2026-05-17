import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import {
  getPostBySlug,
  getPostSlugsByLanguage,
  getAlternateLanguageSlug,
  getRelatedPosts,
  BlogPost,
  BlogPostMeta,
} from '@/lib/blog';
import { FaHome, FaChevronRight, FaClock, FaPen, FaTag } from 'react-icons/fa';
import BlogTableOfContents from '@/components/BlogTableOfContents';
import BlogShareButtons from '@/components/BlogShareButtons';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import AdSlot from '@/components/Ad/AdSlot';
import { AD_SLOTS } from '@/lib/adSlots';
import {
  extractBlogMetadata,
  stripMetadataComment,
  estimateReadingTime,
  slugifyHeading,
  flattenReactChildren,
  BlogMetadata,
} from '@/lib/blogMetadata';

interface Props {
  post: BlogPost;
  alternateSlug: string | null;
  relatedPosts: BlogPostMeta[];
  metadata: BlogMetadata;
  readingTime: number;
  displayContent: string;
}

/** Hash a string to a hue value 0-360 */
function tagToHue(tag: string): number {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 360) + 360) % 360;
}

/** Generate a gradient CSS string from tags */
function tagsToGradient(tags: string[]): string {
  if (tags.length === 0) {
    return 'linear-gradient(135deg, hsl(220, 60%, 50%), hsl(260, 60%, 50%))';
  }
  if (tags.length === 1) {
    const h = tagToHue(tags[0]);
    return `linear-gradient(135deg, hsl(${h}, 55%, 45%), hsl(${(h + 40) % 360}, 60%, 55%))`;
  }
  const hues = tags.slice(0, 3).map(tagToHue);
  const stops = hues.map((h, i) => `hsl(${h}, 55%, ${45 + i * 5}%) ${Math.round((i / (hues.length - 1)) * 100)}%`);
  return `linear-gradient(135deg, ${stops.join(', ')})`;
}

export default function BlogEnPost({
  post,
  alternateSlug,
  relatedPosts,
  metadata,
  readingTime,
  displayContent,
}: Props) {
  // Set html lang to "en" for English blog pages
  useEffect(() => {
    document.documentElement.lang = 'en';
    return () => { document.documentElement.lang = 'ja'; };
  }, []);

  const siteUrl = 'https://gikyokutosyokan.com';
  const pageUrl = `${siteUrl}/blog/en/${post.slug}`;
  const ogImageUrl = post.ogImageUrl || `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&date=${encodeURIComponent(post.date)}&tags=${encodeURIComponent(post.tags.slice(0, 3).join(','))}`;
  const hreflangList = [
    { lang: 'en', path: `/blog/en/${post.slug}` },
    { lang: 'x-default', path: `/blog/en/${post.slug}` },
    ...(alternateSlug ? [{ lang: 'ja', path: `/blog/ja/${alternateSlug}` }] : []),
  ];
  const gradient = tagsToGradient(post.tags);

  return (
    <Layout>
      <ReadingProgressBar />
      <Seo
        pageTitle={post.title}
        pageDescription={post.description}
        pagePath={`/blog/en/${post.slug}`}
        pageImg={ogImageUrl}
        pageImgWidth={1200}
        pageImgHeight={630}
        pageKeywords={post.tags}
        pageType="article"
        hreflang={hreflangList}
        locale="en_US"
      />
      <StructuredData
        type="Article"
        title={post.title}
        description={post.description}
        url={`${siteUrl}/blog/en/${post.slug}`}
        datePublished={post.date}
        dateModified={post.date}
        author={{ name: 'Gikyoku Tosyokan' }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'Home', url: siteUrl },
          { name: 'Blog', url: `${siteUrl}/blog/en` },
          { name: post.title, url: `${siteUrl}/blog/en/${post.slug}` },
        ]}
      />
      {metadata.events && metadata.events.length > 0 && (
        <StructuredData type="EventList" events={metadata.events} />
      )}
      {metadata.faq && metadata.faq.length > 0 && (
        <StructuredData type="FAQPage" faqItems={metadata.faq} />
      )}

      {/* Hero header */}
      <div
        className="relative overflow-hidden"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px, 40px 40px',
        }} />
        <div className="container mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-14 relative z-10">
          <nav className="mb-6">
            <ol className="flex items-center flex-wrap gap-1 text-sm text-white/80">
              <li className="flex items-center">
                <Link href="/" className="hover:text-white transition-colors">
                  <FaHome className="inline mr-1" />Home
                </Link>
              </li>
              <li className="flex items-center">
                <FaChevronRight className="mx-2 text-white/50" size={10} />
                <Link href="/blog/en" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li className="flex items-center">
                <FaChevronRight className="mx-2 text-white/50" size={10} />
                <span className="text-white font-medium truncate max-w-xs">{post.title}</span>
              </li>
            </ol>
          </nav>

          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-5 max-w-3xl drop-shadow-sm">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5">
            <time className="text-sm text-white/90 font-medium">{post.date}</time>
            <span className="flex items-center gap-1.5 text-sm text-white/90">
              <FaClock className="text-white/70" />
              {readingTime} min read
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20"
                >
                  <FaTag className="text-[10px] opacity-70" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-10 -mt-6 relative z-10">
              <div className="flex justify-end mb-6">
                <BlogShareButtons url={pageUrl} title={post.title} />
              </div>

              <BlogTableOfContents content={displayContent} />

              <div className="my-8 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                <AdSlot slot={AD_SLOTS.BLOG_AFTER_TOC} format="horizontal" className="!my-0" />
              </div>

              <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:leading-[1.85] prose-p:text-gray-700">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => {
                      const id = slugifyHeading(flattenReactChildren(children));
                      return (
                        <h2
                          id={id}
                          className="text-xl font-bold mt-12 mb-5 scroll-mt-20 text-gray-700"
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const id = slugifyHeading(flattenReactChildren(children));
                      return (
                        <h3
                          id={id}
                          className="text-lg font-bold mt-8 mb-4 scroll-mt-20 text-gray-700"
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="my-5 leading-[1.9] text-gray-700 tracking-wide">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-5 pl-0 space-y-2.5 list-none">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-5 pl-0 space-y-2.5 list-none counter-reset-item">
                        {children}
                      </ol>
                    ),
                    li: ({ children }: any) => (
                      <li className="relative pl-6 text-gray-700 leading-relaxed">
                        <span className="absolute left-0 top-[0.65em] w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {children}
                      </li>
                    ),
                    a: ({ href, children }) => {
                      const isInternal = href?.startsWith('/');
                      if (isInternal) {
                        return (
                          <Link href={href || '#'} className="text-theater-primary-600 hover:text-theater-primary-800 underline underline-offset-2 transition-colors">
                            {children}
                          </Link>
                        );
                      }
                      return (
                        <a href={href} className="text-theater-primary-600 hover:text-theater-primary-800 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      );
                    },
                    hr: () => (
                      <hr className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    ),
                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-5 pr-4 py-3 my-6 text-gray-500 italic">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-8 rounded-lg border border-gray-200">
                        <table className="min-w-full border-collapse text-sm">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>,
                    th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-gray-700">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-3 border-t border-gray-100 text-gray-600">{children}</td>,
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>

              {/* Author / meta section */}
              <div className="mt-14 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: gradient }}
                  >
                    <FaPen className="text-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Written by</p>
                    <p className="font-bold text-gray-900">Gikyoku Tosyokan Editorial</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Sharing information about theater and dramatic scripts
                    </p>
                  </div>
                </div>
              </div>

              <BlogRelatedPosts posts={relatedPosts} language="en" />

              <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <Link href="/blog/en" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  &larr; Back to Blog
                </Link>
                <BlogShareButtons url={pageUrl} title={post.title} />
              </div>
            </article>
          </main>

          <aside className="lg:w-80">
            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-4">
              <AdSlot slot={AD_SLOTS.BLOG_SIDEBAR} format="rectangle" className="!my-0" />
            </div>
            <BlogSidebar language="en" />
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug(slug);
  if (!post) return { notFound: true };
  const alternateSlug = await getAlternateLanguageSlug(slug, 'en');
  const relatedPosts = await getRelatedPosts(slug, post.tags, 'en', 4);
  const metadata = extractBlogMetadata(post.content);
  const displayContent = stripMetadataComment(post.content);
  const readingTime = estimateReadingTime(displayContent);
  return {
    props: { post, alternateSlug, relatedPosts, metadata, readingTime, displayContent },
    // 記事本文は公開後ほぼ変化なし。7日に延ばしてISR Writesを削減。
    revalidate: 604800,
  };
};
