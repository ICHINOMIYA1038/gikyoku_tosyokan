import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import BlogPostRow from '@/components/BlogPostRow';
import Seo from '@/components/seo';
import { getPostsByLanguagePaginated, BlogPostMeta } from '@/lib/blog';
import AdSlot from '@/components/Ad/AdSlot';
import { AD_SLOTS } from '@/lib/adSlots';

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
      <div className="max-w-6xl mx-auto pt-6 md:pt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <main className="flex-1 min-w-0">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-[26px] md:text-[32px] font-serif font-bold text-gray-900 leading-tight">Blog</h1>
                <p className="mt-2 text-base text-gray-600">Guides to Japanese theater and plays. {total.toLocaleString()} articles.</p>
              </div>
              <Link href="/blog/ja" className="text-sm text-gray-700 underline underline-offset-4 shrink-0">日本語</Link>
            </div>

            {posts.length === 0 ? (
              <p className="mt-8 text-gray-700">No articles found.</p>
            ) : (
              <>
                <ul className="mt-6 border-t border-[#D9D5CF]">
                  {posts.map((post) => <BlogPostRow key={post.slug} post={post} lang="en" />)}
                </ul>

                <AdSlot slot={AD_SLOTS.CATEGORY_AFTER_LIST} format="horizontal" />

                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="h-11 px-6 rounded border border-[#D9D5CF] text-sm font-bold text-gray-900 hover:bg-[#F4F2EE] disabled:opacity-50"
                    >
                      {loading ? 'Loading…' : `Load more (${posts.length} / ${total})`}
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
  return { props: { posts, total }, revalidate: 2592000 };
};
