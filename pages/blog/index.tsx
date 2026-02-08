import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getPostsByLanguage, BlogPostMeta } from '@/lib/blog';

interface BlogIndexProps {
  jaPosts: BlogPostMeta[];
  enPosts: BlogPostMeta[];
}

function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <article className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
      <Link href={`/blog/${post.slug}`}>
        <h3 className="text-lg font-bold text-blue-600 hover:text-blue-800 mb-1">
          {post.title}
        </h3>
      </Link>
      <p className="text-gray-500 text-xs mb-2">{post.date}</p>
      <p className="text-gray-700 text-sm mb-2 line-clamp-2">{post.description}</p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-gray-400 text-xs">+{post.tags.length - 3}</span>
          )}
        </div>
      )}
    </article>
  );
}

export default function BlogIndex({ jaPosts, enPosts }: BlogIndexProps) {
  const [activeTab, setActiveTab] = useState<'ja' | 'en'>('ja');

  useEffect(() => {
    const browserLang = navigator.language || '';
    if (!browserLang.startsWith('ja')) {
      setActiveTab('en');
    }
  }, []);

  const activePosts = activeTab === 'ja' ? jaPosts : enPosts;

  return (
    <Layout>
      <Seo
        pageTitle="ブログ | Blog"
        pageDescription="戯曲図書館のブログ。公演情報・演劇ガイド・岸田國士賞受賞劇作家の紹介など。Theater Library blog featuring performance news, theater guides, and Kishida Prize playwright profiles."
        pagePath="/blog"
        pageKeywords={['ブログ', '演劇', 'Japanese Theater', 'Kishida Prize', 'Blog']}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-6">ブログ / Blog</h1>

            {/* タブ切り替え */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 max-w-xs">
              <button
                onClick={() => setActiveTab('ja')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'ja'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                日本語 ({jaPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('en')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'en'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                English ({enPosts.length})
              </button>
            </div>

            {/* 記事一覧 */}
            {activePosts.length === 0 ? (
              <p className="text-gray-600">
                {activeTab === 'ja' ? '記事がありません。' : 'No articles found.'}
              </p>
            ) : (
              <div className="space-y-4">
                {activePosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </main>

          {/* サイドバー */}
          <aside className="lg:w-80">
            <div className="sticky top-20">
              <BlogSidebar />
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const jaPosts = await getPostsByLanguage('ja');
  const enPosts = await getPostsByLanguage('en');

  return {
    props: {
      jaPosts,
      enPosts,
    },
    revalidate: 60,
  };
};
