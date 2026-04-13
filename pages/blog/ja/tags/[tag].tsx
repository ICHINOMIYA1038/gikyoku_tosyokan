import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getPostsByTag, BlogPostMeta } from '@/lib/blog';
import Link from 'next/link';
import { FaHome, FaChevronRight, FaTag } from 'react-icons/fa';

interface Props {
  tag: string;
  posts: BlogPostMeta[];
}

export default function TagPage({ tag, posts }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle={`「${tag}」の記事一覧`}
        pageDescription={`戯曲図書館ブログの「${tag}」タグが付いた記事一覧`}
        pagePath={`/blog/ja/tags/${encodeURIComponent(tag)}`}
      />
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6">
          <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-600">
            <li className="flex items-center">
              <Link href="/" className="hover:text-blue-600"><FaHome className="inline mr-1" />ホーム</Link>
            </li>
            <li className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <Link href="/blog/ja" className="hover:text-blue-600">ブログ</Link>
            </li>
            <li className="flex items-center">
              <FaChevronRight className="mx-2 text-gray-400" size={10} />
              <span className="text-gray-900 font-medium flex items-center gap-1">
                <FaTag className="text-xs" />{tag}
              </span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-base">{tag}</span>
              <span className="text-gray-600 text-lg">の記事一覧</span>
              <span className="text-sm text-gray-400 font-normal">({posts.length}件)</span>
            </h1>

            {posts.length === 0 ? (
              <p className="text-gray-500">このタグの記事はまだありません。</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/ja/${post.slug}`}
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
                    {post.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{post.date}</span>
                      <div className="flex gap-1">
                        {post.tags.slice(0, 4).map((t) => (
                          <span key={t} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const tag = decodeURIComponent(params?.tag as string);
  const posts = await getPostsByTag(tag);
  return { props: { tag, posts } };
};
