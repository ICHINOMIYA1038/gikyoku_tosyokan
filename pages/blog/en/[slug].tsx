import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
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
import BlogTableOfContents from '@/components/BlogTableOfContents';
import BlogShareButtons from '@/components/BlogShareButtons';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import AdSlot from '@/components/Ad/AdSlot';
import { AD_SLOTS } from '@/lib/adSlots';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import { containsAffiliateHref, externalLinkRel } from '@/lib/affiliateLinks';
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

      <div className="max-w-6xl mx-auto pt-6 md:pt-8">
        <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blog', href: '/blog/en' }, { name: post.title }]} />
        <header className="max-w-3xl">
          <h1 className="text-[26px] md:text-[34px] font-serif font-bold text-gray-900 leading-snug">{post.title}</h1>
          <p className="mt-3 text-sm text-gray-600">
            <time dateTime={post.date}>{post.date}</time>
            <span className="mx-2">·</span>
            {readingTime} min read
          </p>
          {post.tags.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-700">
              {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
            </p>
          )}
        </header>
      </div>

      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0">
            <article className="max-w-3xl">
              {containsAffiliateHref(displayContent) && <AffiliateDisclosure language="en" />}

              <BlogTableOfContents content={displayContent} lang="en" />

              <div className="my-8">
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
                          className="!text-[22px] !font-bold !mt-14 !mb-5 !pb-2 scroll-mt-20 !text-gray-900 border-b border-[#D9D5CF]"
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
                          className="!text-lg !font-bold !mt-9 !mb-3 scroll-mt-20 !text-gray-900"
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
                        <a href={href} className="text-theater-primary-600 hover:text-theater-primary-800 underline underline-offset-2 transition-colors" target="_blank" rel={externalLinkRel(href)}>
                          {children}
                        </a>
                      );
                    },
                    hr: () => (
                      <hr className="my-10 border-0 h-px bg-[#D9D5CF]" />
                    ),
                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#D9D5CF] pl-5 pr-4 py-1 my-6 text-gray-700">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-8 border-t border-[#D9D5CF]">
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

              <div className="mt-14 pt-6 border-t border-[#D9D5CF] text-sm text-gray-700">
                <p><span className="font-bold text-gray-900">Gikyoku Tosyokan Editorial</span><span className="mx-2">·</span>{post.date}</p>
                <p className="mt-1">Sharing information about Japanese theater and dramatic scripts.</p>
              </div>

              <BlogRelatedPosts posts={relatedPosts} language="en" />

              <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <Link href="/blog/en" className="text-sm text-gray-700 underline underline-offset-4 hover:text-gray-900">
                  Back to the blog
                </Link>
                <BlogShareButtons url={pageUrl} title={post.title} lang="en" />
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
    revalidate: 2592000,
  };
};
