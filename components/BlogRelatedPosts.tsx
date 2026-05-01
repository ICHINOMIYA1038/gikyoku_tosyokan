import Link from 'next/link';
import { BlogPostMeta } from '@/lib/blog';

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
    <section className="mt-14 pt-8 border-t border-gray-200">
      <h2 className="text-lg font-bold mb-5 text-gray-800">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${language}/${post.slug}`}
            className="group block border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:bg-gray-50 transition-all"
          >
            <h3 className="font-bold text-sm text-gray-800 mb-1.5 line-clamp-2 group-hover:text-theater-primary-600 transition-colors">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                {post.description}
              </p>
            )}
            <p className="text-xs text-gray-300">{post.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogRelatedPosts;
