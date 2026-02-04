import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { getAllPosts, BlogPostMeta } from '@/lib/blog';

interface BlogIndexProps {
  posts: BlogPostMeta[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <Layout>
      <Seo
        pageTitle="ブログ"
        pageDescription="戯曲図書館のブログ記事一覧です。公演情報や演劇に関する情報をお届けします。"
        pagePath="/blog"
        pageKeywords={['ブログ', '公演情報', '演劇ニュース']}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ブログ</h1>

        {posts.length === 0 ? (
          <p className="text-gray-600">記事がありません。</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-blue-600 hover:text-blue-800 mb-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-500 text-sm mb-3">{post.date}</p>
                <p className="text-gray-700 mb-3">{post.description}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const posts = getAllPosts();

  return {
    props: {
      posts,
    },
  };
};
