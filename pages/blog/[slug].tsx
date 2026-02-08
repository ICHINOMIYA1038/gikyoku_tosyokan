import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getAllPostSlugs, getPostBySlug, BlogPost } from '@/lib/blog';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface BlogPostPageProps {
  post: BlogPost;
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <Layout>
      <Seo
        pageTitle={post.title}
        pageDescription={post.description}
        pagePath={`/blog/${post.slug}`}
        pageKeywords={post.tags}
        pageType="article"
      />
      <div className="container mx-auto px-4 py-8">
        {/* パンくず */}
        <nav className="mb-6">
          <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-600">
            <li className="flex items-center">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                <FaHome className="inline mr-1" />ホーム
              </Link>
            </li>
            <li className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <Link href="/blog" className="hover:text-blue-600 transition-colors">
                ブログ
              </Link>
            </li>
            <li className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <span className="text-gray-900 font-medium truncate max-w-xs">
                {post.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1 min-w-0">
            <article className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <p className="text-gray-500 mb-4">{post.date}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="my-4 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-4 pl-6 space-y-2">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="list-disc">{children}</li>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    hr: () => <hr className="my-8 border-gray-300" />,
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              <div className="mt-12 pt-6 border-t border-gray-200">
                <Link href="/blog" className="text-blue-600 hover:text-blue-800">
                  &larr; ブログ一覧に戻る / Back to Blog
                </Link>
              </div>
            </article>
          </main>

          {/* サイドバー */}
          <aside className="lg:w-80">
            <BlogSidebar />
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
