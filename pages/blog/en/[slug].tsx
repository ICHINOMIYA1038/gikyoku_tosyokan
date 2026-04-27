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
import { FaHome, FaChevronRight, FaClock } from 'react-icons/fa';
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
  return (
    <Layout>
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
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-600">
            <li className="flex items-center">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                <FaHome className="inline mr-1" />Home
              </Link>
            </li>
            <li className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <Link href="/blog/en" className="hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </li>
            <li className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <span className="text-gray-900 font-medium truncate max-w-xs">{post.title}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            <article className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <p className="text-gray-500">{post.date}</p>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <FaClock />
                    {readingTime} min read
                  </span>
                  <BlogShareButtons url={pageUrl} title={post.title} />
                </div>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </header>

              <BlogTableOfContents content={displayContent} />

              {/* Ad: after TOC */}
              <AdSlot slot={AD_SLOTS.BLOG_AFTER_TOC} format="horizontal" />

              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => {
                      const id = slugifyHeading(flattenReactChildren(children));
                      return <h2 id={id} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 scroll-mt-20">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const id = slugifyHeading(flattenReactChildren(children));
                      return <h3 id={id} className="text-xl font-bold mt-6 mb-3 scroll-mt-20">{children}</h3>;
                    },
                    p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="my-4 pl-6 space-y-2">{children}</ul>,
                    li: ({ children }) => <li className="list-disc">{children}</li>,
                    a: ({ href, children }) => {
                      const isInternal = href?.startsWith('/');
                      if (isInternal) {
                        return (
                          <Link href={href || '#'} className="text-blue-600 hover:text-blue-800 underline">
                            {children}
                          </Link>
                        );
                      }
                      return (
                        <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>
                      );
                    },
                    hr: () => <hr className="my-8 border-gray-300" />,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-300 bg-blue-50 pl-4 py-2 my-4 text-gray-700 italic">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-gray-300 text-sm">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                    th: ({ children }) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{children}</th>,
                    td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                  }}
                >
                  {displayContent}
                </ReactMarkdown>
              </div>

              <BlogRelatedPosts posts={relatedPosts} language="en" />

              <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <Link href="/blog/en" className="text-blue-600 hover:text-blue-800">
                  &larr; Back to Blog
                </Link>
                <BlogShareButtons url={pageUrl} title={post.title} />
              </div>
            </article>
          </main>

          <aside className="lg:w-80">
            {/* Ad: blog sidebar */}
            <AdSlot slot={AD_SLOTS.BLOG_SIDEBAR} format="rectangle" />
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
