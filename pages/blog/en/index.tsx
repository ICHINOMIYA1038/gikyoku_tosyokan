import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import BlogSidebar from '@/components/BlogSidebar';
import Seo from '@/components/seo';
import { getPostsByLanguage, BlogPostMeta } from '@/lib/blog';

interface Props {
  posts: BlogPostMeta[];
}

export default function BlogEnIndex({ posts }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle="Blog - Japanese Theater Library"
        pageDescription="Explore Japanese theater through Kishida Prize playwright profiles, play analyses, and theater guides for international audiences."
        pagePath="/blog/en"
        pageKeywords={['Japanese Theater', 'Kishida Prize', 'Playwrights', 'Blog']}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Blog</h1>
              <Link href="/blog/ja" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                ← 日本語
              </Link>
            </div>

            {posts.length === 0 ? (
              <p className="text-gray-600">No articles found.</p>
            ) : (
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
  const posts = await getPostsByLanguage('en');
  return { props: { posts }, revalidate: 60 };
};
