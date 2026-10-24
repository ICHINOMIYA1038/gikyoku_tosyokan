import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
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
  getPostsReferencedInContent,
  BlogPost,
  BlogPostMeta,
} from '@/lib/blog';
import BlogReferencedPosts from '@/components/BlogReferencedPosts';

const CALLOUT_TYPES: CalloutType[] = ['info', 'tip', 'warn', 'quote'];

function splitContentByCallouts(content: string): Array<{ kind: 'md'; body: string } | { kind: 'callout'; type: CalloutType; title?: string; body: string }> {
  const segments: Array<{ kind: 'md'; body: string } | { kind: 'callout'; type: CalloutType; title?: string; body: string }> = [];
  const regex = /^:::(info|tip|warn|quote)(?:\s+(.+?))?\s*\n([\s\S]*?)^:::\s*$/gm;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(content)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ kind: 'md', body: content.slice(lastIndex, m.index) });
    }
    segments.push({ kind: 'callout', type: m[1] as CalloutType, title: m[2], body: m[3].trimEnd() });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    segments.push({ kind: 'md', body: content.slice(lastIndex) });
  }
  return segments;
}
import BlogTableOfContents from '@/components/BlogTableOfContents';
import BlogShareButtons from '@/components/BlogShareButtons';
import BlogRelatedPosts from '@/components/BlogRelatedPosts';
import BlogCallout, { CalloutType } from '@/components/BlogCallout';
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
  referencedPosts: Array<{ id: number; title: string; authorName: string | null; imageUrl: string | null }>;
  metadata: BlogMetadata;
  readingTime: number;
  displayContent: string;
}


export default function BlogJaPost({
  post,
  alternateSlug,
  relatedPosts,
  referencedPosts,
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
      <ReadingProgressBar />
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

      <div className="max-w-6xl mx-auto pt-6 md:pt-8">
        <Breadcrumb items={[{ name: 'ホーム', href: '/' }, { name: 'ブログ', href: '/blog/ja' }, { name: post.title }]} />
        <header className="max-w-3xl">
          <h1 className="text-[26px] md:text-[34px] font-serif font-bold text-gray-900 leading-snug">{post.title}</h1>
          <p className="mt-3 text-sm text-gray-600">
            <time dateTime={post.date}>{post.date.replace(/-/g, '/')}</time>
            <span className="mx-2">・</span>
            約{readingTime}分で読めます
          </p>
          {post.tags.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog/ja/tags/${encodeURIComponent(tag)}`} className="text-gray-700 hover:text-theater-primary-700 hover:underline underline-offset-4">
                  #{tag}
                </Link>
              ))}
            </p>
          )}
        </header>
      </div>

      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0">
            <article className="max-w-3xl">
              {post.description && (
                <aside aria-label="この記事のポイント" className="not-prose mt-6 border-l-4 border-theater-primary-600 bg-[#F4F2EE] px-5 py-4">
                  <p className="text-xs font-bold text-gray-700">この記事のポイント</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-gray-900">{post.description}</p>
                </aside>
              )}

              <BlogTableOfContents content={displayContent} />

              <div className="my-8">
                <AdSlot slot={AD_SLOTS.BLOG_AFTER_TOC} format="horizontal" className="!my-0" />
              </div>

              <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:leading-[1.85] prose-p:text-gray-700">
                {splitContentByCallouts(displayContent).map((seg, idx) => seg.kind === 'callout' ? (
                  <BlogCallout key={idx} type={seg.type} title={seg.title}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{seg.body}</ReactMarkdown>
                  </BlogCallout>
                ) : (
                <ReactMarkdown
                  key={idx}
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
                      <p className="my-5 leading-[1.95] text-gray-900">
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
                      <li className="relative pl-5 text-gray-900 leading-relaxed">
                        <span className="absolute left-0 top-[0.7em] w-1.5 h-1.5 rounded-full bg-gray-500" />
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
                    thead: ({ children }) => <thead className="bg-[#F4F2EE] border-b border-[#D9D5CF]">{children}</thead>,
                    th: ({ children }) => <th className="px-4 py-3 text-left font-semibold text-gray-700">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-3 border-b border-[#D9D5CF] text-gray-900">{children}</td>,
                  }}
                >
                  {seg.body}
                </ReactMarkdown>
                ))}
              </div>

              <BlogReferencedPosts posts={referencedPosts} />

              <div className="mt-14 pt-6 border-t border-[#D9D5CF] text-sm text-gray-700">
                <p>
                  <span className="font-bold text-gray-900">戯曲図書館 編集部</span>
                  <span className="mx-2">・</span>公開日 {post.date.replace(/-/g, '/')}
                </p>
                <p className="mt-1">演劇経験者が運営する戯曲検索サービスの編集チームです。脚本選びのノウハウ、演劇の最新情報、公演レポートなどを書いています。</p>
                <p className="mt-2 flex gap-4">
                  <Link href="/support/about" className="text-theater-primary-700 underline underline-offset-4">サイトについて</Link>
                  <a href="https://twitter.com/gikyokutosyokan" target="_blank" rel="noopener noreferrer" className="text-gray-700 underline underline-offset-4">@gikyokutosyokan</a>
                </p>
              </div>

              <BlogRelatedPosts posts={relatedPosts} language="ja" />

              <div className="mt-12 pt-6 border-t border-[#D9D5CF] flex flex-wrap items-center justify-between gap-4">
                <Link href="/blog/ja" className="text-sm text-gray-700 underline underline-offset-4 hover:text-gray-900">
                  ブログの一覧へ
                </Link>
                <BlogShareButtons url={pageUrl} title={post.title} />
              </div>
            </article>
          </main>

          <aside className="lg:w-80">
            {/* Ad: blog sidebar */}
            <div className="mb-8">
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
  const referencedPosts = await getPostsReferencedInContent(displayContent, 8);
  return {
    props: { post, alternateSlug, relatedPosts, referencedPosts, metadata, readingTime, displayContent },
    // 記事本文は公開後ほぼ変化なし。7日に延ばしてISR Writesを削減。
    revalidate: 2592000,
  };
};
