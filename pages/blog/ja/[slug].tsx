import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
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


export default function BlogJaPost({
  post,
  alternateSlug,
  relatedPosts,
  metadata,
  readingTime,
  displayContent,
}: Props) {
  const siteUrl = 'https://gikyokutosyokan.com';
  const pageUrl = `${siteUrl}/blog/ja/${post.slug}`;
  const ogImageUrl = post.ogImageUrl || `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&date=${encodeURIComponent(post.date)}&tags=${encodeURIComponent(post.tags.slice(0, 3).join(','))}`;
  const hreflangList = [
    { lang: 'ja', path: `/blog/ja/${post.slug}` },
    { lang: 'x-default', path: `/blog/ja/${post.slug}` },
    ...(alternateSlug ? [{ lang: 'en', path: `/blog/en/${alternateSlug}` }] : []),
  ];
  return (
    <Layout>
      <Seo
        pageTitle={post.title}
        pageDescription={post.description}
        pagePath={`/blog/ja/${post.slug}`}
        pageImg={ogImageUrl}
        pageImgWidth={1200}
        pageImgHeight={630}
        pageKeywords={post.tags}
        pageType="article"
        hreflang={hreflangList}
      />
      <StructuredData
        type="Article"
        title={post.title}
        description={post.description}
        url={`${siteUrl}/blog/ja/${post.slug}`}
        datePublished={post.date}
        dateModified={post.date}
        author={{ name: '戯曲図書館' }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: 'ホーム', url: siteUrl },
          { name: 'ブログ', url: `${siteUrl}/blog/ja` },
          { name: post.title, url: `${siteUrl}/blog/ja/${post.slug}` },
        ]}
      />
      {metadata.events && metadata.events.length > 0 && (
        <StructuredData type="EventList" events={metadata.events} />
      )}
      {metadata.faq && metadata.faq.length > 0 && (
        <StructuredData type="FAQPage" faqItems={metadata.faq} />
      )}

      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 pt-6 pb-8 md:pt-8 md:pb-10">
          {/* Breadcrumb */}
          <nav className="mb-5">
            <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-400">
              <li className="flex items-center">
                <Link href="/" className="hover:text-gray-600 transition-colors">
                  <FaHome className="inline mr-1" />ホーム
                </Link>
              </li>
              <li className="flex items-center">
                <FaChevronRight className="mx-2 text-gray-300" size={10} />
                <Link href="/blog/ja" className="hover:text-gray-600 transition-colors">
                  ブログ
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4 max-w-3xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <time className="text-sm text-gray-400">{post.date}</time>
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <FaClock className="text-gray-300" />
              約{readingTime}分で読めます
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-gray-400 bg-white px-2.5 py-1 rounded border border-gray-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            <article className="bg-white p-6 lg:p-10">
              {/* Share buttons at top */}
              <div className="flex justify-end mb-6">
                <BlogShareButtons url={pageUrl} title={post.title} />
              </div>

              <BlogTableOfContents content={displayContent} />

              {/* Ad: after TOC */}
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
                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-theater-primary-100 flex items-center justify-center text-theater-primary-600">
                    <FaPen className="text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-0.5">Written by</p>
                    <p className="font-bold text-gray-900">戯曲図書館 編集部</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      演劇経験者が運営する戯曲検索サービス「戯曲図書館」の編集チームです。
                      脚本選びのノウハウ、演劇業界の最新情報、公演レポートなどを発信しています。
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Link href="/support/about" className="text-xs text-theater-primary-600 hover:underline">
                        サイトについて
                      </Link>
                      <a href="https://twitter.com/gikyokutosyokan" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-500">
                        @gikyokutosyokan
                      </a>
                    </div>
                  </div>
                </div>
                {/* 公開日・更新日 */}
                <div className="mt-3 text-xs text-gray-400 flex items-center gap-4">
                  <span>公開日: {post.date}</span>
                </div>
              </div>

              <BlogRelatedPosts posts={relatedPosts} language="ja" />

              <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <Link href="/blog/ja" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors">
                  &larr; ブログ一覧に戻る
                </Link>
                <BlogShareButtons url={pageUrl} title={post.title} />
              </div>
            </article>
          </main>

          <aside className="lg:w-80">
            {/* Ad: blog sidebar */}
            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-4">
              <AdSlot slot={AD_SLOTS.BLOG_SIDEBAR} format="rectangle" className="!my-0" />
            </div>
            <BlogSidebar language="ja" />
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
  const alternateSlug = await getAlternateLanguageSlug(slug, 'ja');
  const relatedPosts = await getRelatedPosts(slug, post.tags, 'ja', 4);
  const metadata = extractBlogMetadata(post.content);
  const displayContent = stripMetadataComment(post.content);
  const readingTime = estimateReadingTime(displayContent);
  return {
    props: { post, alternateSlug, relatedPosts, metadata, readingTime, displayContent },
    // 記事本文は公開後ほぼ変化なし。7日に延ばしてISR Writesを削減。
    revalidate: 604800,
  };
};
