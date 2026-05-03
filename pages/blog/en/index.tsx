import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getPostsByLanguagePaginated, BlogPostMeta } from '@/lib/blog';

const PER_PAGE = 20;

interface Props {
  posts: BlogPostMeta[];
  total: number;
}

export default function BlogEnIndex({ posts: initialPosts, total }: Props) {
  const [posts, setPosts] = useState<BlogPostMeta[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const hasMore = posts.length < total;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const res = await fetch(`/api/blog-posts?lang=en&page=${nextPage}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Failed to load more posts:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore]);

  // Set html lang to "en" for English blog pages
  useEffect(() => {
    document.documentElement.lang = 'en';
    return () => { document.documentElement.lang = 'ja'; };
  }, []);

  return (
    <Layout>
      <Seo
        pageTitle="Blog - Japanese Theater Library"
        pageDescription="Explore Japanese theater through Kishida Prize playwright profiles, play analyses, and theater guides for international audiences."
        pagePath="/blog/en"
        pageKeywords={['Japanese Theater', 'Kishida Prize', 'Playwrights', 'Blog']}
        hreflang={[
          { lang: 'ja', path: '/blog/ja' },
          { lang: 'en', path: '/blog/en' },
          { lang: 'x-default', path: '/blog' },
        ]}
        locale="en_US"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Blog</h1>
                <p className="text-sm text-gray-400 mt-1">{total} articles</p>
              </div>
              <Link href="/blog/ja" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                &larr; 日本語
              </Link>
            </div>

            {posts.length === 0 ? (
              <p className="text-gray-600">No articles found.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <article
                      key={post.slug}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                    >
                      <Link href={`/blog/en/${post.slug}`}>
                        <h3 className="text-lg font-bold text-blue-600 hover:text-blue-800 mb-1">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-xs mb-2">{post.date}</p>
                      <p className="text-gray-700 text-sm mb-2 line-clamp-2">{post.description}</p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-gray-400 text-xs">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>Load more ({posts.length} / {total})</>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          <aside className="lg:w-80">
            <BlogSidebar language="en" />
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { posts, total } = await getPostsByLanguagePaginated('en', 1, PER_PAGE);
  // 新記事追加は手動オペレーション時に on-demand revalidate する想定。7日に延長。
  return { props: { posts, total }, revalidate: 604800 };
};
