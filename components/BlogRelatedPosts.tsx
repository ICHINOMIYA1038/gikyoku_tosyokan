import Link from 'next/link';
import { BlogPostMeta } from '@/lib/blog';
import { FaRegNewspaper } from 'react-icons/fa';

interface BlogRelatedPostsProps {
  posts: BlogPostMeta[];
  language?: 'ja' | 'en';
}

const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({
  posts,
  language = 'ja',
}) => {
  if (posts.length === 0) return null;

  const title = language === 'ja' ? '関連記事' : 'Related Articles';

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
        <FaRegNewspaper className="text-blue-600" />
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${language}/${post.slug}`}
              className="block p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                {post.title}
              </h3>
              {post.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BlogRelatedPosts;
