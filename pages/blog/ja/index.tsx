import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getPostsByLanguage, BlogPostMeta } from '@/lib/blog';

interface Props {
  posts: BlogPostMeta[];
}

function formatDateNice(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// Featured (latest) post card
function FeaturedCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/ja/${post.slug}`} className="block group">
      <article className="relative overflow-hidden rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all duration-200">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-white bg-theater-primary-500 px-2.5 py-0.5 rounded">
              NEW
            </span>
            <time className="text-sm text-gray-400">
              {formatDateNice(post.date)}
            </time>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-theater-primary-600 transition-colors leading-snug mb-3">
            {post.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {post.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-theater-primary-500 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 whitespace-nowrap">
              続きを読む &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Regular post card
function PostCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link href={`/blog/ja/${post.slug}`} className="block group">
      <article className="flex items-start gap-4 py-5 border-b border-gray-100 last:border-0">
        <time className="text-xs text-gray-300 font-medium whitespace-nowrap pt-1 w-20 flex-shrink-0 hidden sm:block">
          {formatDateNice(post.date)}
        </time>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-800 group-hover:text-theater-primary-600 transition-colors leading-snug mb-1 line-clamp-2">
            {post.title}
          </h3>
          <time className="text-xs text-gray-300 mb-1.5 block sm:hidden">
            {formatDateNice(post.date)}
          </time>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-1 mb-2">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogJaIndex({ posts }: Props) {
  const [featured, ...rest] = posts;

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
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">ブログ</h1>
              <Link href="/blog/en" className="text-sm text-gray-400 hover:text-theater-primary-600 transition-colors">
                English &rarr;
              </Link>
            </div>

            {posts.length === 0 ? (
              <p className="text-gray-600">記事がありません。</p>
            ) : (
              <>
                {/* Featured (latest) post */}
                {featured && <FeaturedCard post={featured} />}

                {/* Rest of posts */}
                {rest.length > 0 && (
                  <div className="mt-8">
                    {rest.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                )}
              </>
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
  return { props: { posts }, revalidate: 604800 };
};
