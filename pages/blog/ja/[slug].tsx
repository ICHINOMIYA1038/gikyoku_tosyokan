import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import StructuredData from '@/components/StructuredData';
import { getPostBySlug, getPostSlugsByLanguage, BlogPost } from '@/lib/blog';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface Props {
  post: BlogPost;
}

export default function BlogJaPost({ post }: Props) {
  const siteUrl = 'https://gikyokutosyokan.com';
  return (
    <Layout>
      <Seo
        pageTitle={post.title}
        pageDescription={post.description}
        pagePath={`/blog/ja/${post.slug}`}
        pageKeywords={post.tags}
        pageType="article"
        hreflang={[
          { lang: 'ja', path: `/blog/ja/${post.slug}` },
          { lang: 'x-default', path: `/blog/ja/${post.slug}` },
        ]}
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
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-600">
            <li className="flex items-center">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                <FaHome className="inline mr-1" />ホーム
              </Link>
            </li>
            <li className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <Link href="/blog/ja" className="hover:text-blue-600 transition-colors">
                ブログ
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
                <p className="text-gray-500 mb-4">{post.date}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </header>

              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
                    p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="my-4 pl-6 space-y-2">{children}</ul>,
                    li: ({ children }) => <li className="list-disc">{children}</li>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                    hr: () => <hr className="my-8 border-gray-300" />,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              <div className="mt-12 pt-6 border-t border-gray-200">
                <Link href="/blog/ja" className="text-blue-600 hover:text-blue-800">
                  &larr; ブログ一覧に戻る
                </Link>
              </div>
            </article>
          </main>

          <aside className="lg:w-80">
            <BlogSidebar language="ja" />
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPostSlugsByLanguage('ja');
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const post = await getPostBySlug(params?.slug as string);
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 60 };
};
