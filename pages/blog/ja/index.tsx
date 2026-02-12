import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getPostsByLanguage, BlogPostMeta } from '@/lib/blog';

interface Props {
  posts: BlogPostMeta[];
}

export default function BlogJaIndex({ posts }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle="ブログ"
        pageDescription="戯曲図書館のブログ記事一覧。公演情報・演劇ガイド・戯曲の読み方など。"
        pagePath="/blog/ja"
        pageKeywords={['ブログ', '公演情報', '演劇ニュース', '戯曲']}
        hreflang={[
          { lang: 'ja', path: '/blog/ja' },
          { lang: 'en', path: '/blog/en' },
          { lang: 'x-default', path: '/blog' },
        ]}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">ブログ</h1>
              <Link href="/blog/en" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                English →
              </Link>
            </div>

            {posts.length === 0 ? (
              <p className="text-gray-600">記事がありません。</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white"
                  >
                    <Link href={`/blog/ja/${post.slug}`}>
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
            )}
          </main>

          <aside className="lg:w-80">
            <BlogSidebar language="ja" />
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await getPostsByLanguage('ja');
  return { props: { posts } };
};
