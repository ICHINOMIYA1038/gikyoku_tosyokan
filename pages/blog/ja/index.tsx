import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getPostsByLanguage, BlogPostMeta } from '@/lib/blog';

interface Props {
  posts: BlogPostMeta[];
}

// Hash a string to a hue value (0-360) for gradient generation
function tagToHue(tag: string): number {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

// Generate gradient style from the first tag
function tagGradient(tags: string[]): { background: string; hue: number } {
  const tag = tags[0] || 'default';
  const hue = tagToHue(tag);
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${(hue + 40) % 360}, 60%, 45%))`,
    hue,
  };
}

// Pill color based on tag string
function tagPillClasses(tag: string): string {
  const hue = tagToHue(tag);
  // Map hue ranges to Tailwind color pairs
  if (hue < 30) return 'bg-red-100 text-red-700';
  if (hue < 60) return 'bg-orange-100 text-orange-700';
  if (hue < 90) return 'bg-yellow-100 text-yellow-700';
  if (hue < 140) return 'bg-green-100 text-green-700';
  if (hue < 180) return 'bg-teal-100 text-teal-700';
  if (hue < 220) return 'bg-cyan-100 text-cyan-700';
  if (hue < 260) return 'bg-blue-100 text-blue-700';
  if (hue < 300) return 'bg-purple-100 text-purple-700';
  if (hue < 340) return 'bg-pink-100 text-pink-700';
  return 'bg-rose-100 text-rose-700';
}

function formatDateNice(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}年${month}月${day}日`;
}

// Featured (latest) post card
function FeaturedCard({ post }: { post: BlogPostMeta }) {
  const gradient = tagGradient(post.tags);

  return (
    <Link href={`/blog/ja/${post.slug}`} className="block group">
      <article className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1">
        {/* Gradient banner */}
        <div
          className="h-40 sm:h-48 flex items-end p-6 relative"
          style={{ background: gradient.background }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            {post.tags[0] && (
              <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {post.tags[0]}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug drop-shadow-sm">
              {post.title}
            </h2>
          </div>
        </div>
        {/* Content area */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-3">
            <time className="text-sm font-medium text-gray-500">
              {formatDateNice(post.date)}
            </time>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              NEW
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {post.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagPillClasses(tag)}`}
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 4 && (
                <span className="text-xs text-gray-400 self-center">
                  +{post.tags.length - 4}
                </span>
              )}
            </div>
            <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 whitespace-nowrap">
              記事を読む &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Regular post card
function PostCard({ post }: { post: BlogPostMeta }) {
  const gradient = tagGradient(post.tags);

  return (
    <Link href={`/blog/ja/${post.slug}`} className="block group">
      <article className="flex overflow-hidden rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 bg-white hover:-translate-y-0.5">
        {/* Gradient side strip */}
        <div
          className="w-2 sm:w-28 flex-shrink-0 relative hidden sm:flex items-center justify-center"
          style={{ background: gradient.background }}
        >
          {post.tags[0] && (
            <span className="text-white text-xs font-bold writing-vertical-rl tracking-wider opacity-90 select-none"
              style={{ writingMode: 'vertical-rl' }}
            >
              {post.tags[0]}
            </span>
          )}
        </div>
        {/* Mobile: thin gradient strip */}
        <div
          className="w-1.5 flex-shrink-0 sm:hidden"
          style={{ background: gradient.background }}
        />
        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
              {post.title}
            </h3>
          </div>
          <time className="block text-xs text-gray-400 font-medium mb-2">
            {formatDateNice(post.date)}
          </time>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
            {post.description}
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagPillClasses(tag)}`}
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-400 self-center">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
            <span className="text-blue-500 text-xs font-medium group-hover:translate-x-1 transition-transform duration-200 whitespace-nowrap flex-shrink-0">
              記事を読む &rarr;
            </span>
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
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                  ブログ
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                  公演情報・演劇ガイド・戯曲の読み方など
                </p>
              </div>
              <Link
                href="/blog/en"
                className="text-sm text-gray-400 hover:text-blue-600 transition-colors border border-gray-200 rounded-full px-3 py-1"
              >
                English &rarr;
              </Link>
            </div>

            {posts.length === 0 ? (
              <p className="text-gray-600">記事がありません。</p>
            ) : (
              <div className="space-y-5">
                {/* Featured (latest) post */}
                {featured && <FeaturedCard post={featured} />}

                {/* Rest of posts */}
                {rest.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {rest.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                )}
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
  // 新記事追加は手動オペレーション時に on-demand revalidate する想定。7日に延長。
  return { props: { posts }, revalidate: 604800 };
};
