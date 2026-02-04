import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { getAllPostSlugs, getPostBySlug, BlogPost } from '@/lib/blog';

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            &larr; ブログ一覧に戻る
          </Link>
        </div>

        <article>
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
        </article>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            &larr; ブログ一覧に戻る
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};
