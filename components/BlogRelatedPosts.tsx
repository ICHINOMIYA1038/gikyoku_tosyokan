import Link from 'next/link';
import { BlogPostMeta } from '@/lib/blog';
import { FaRegNewspaper, FaArrowRight } from 'react-icons/fa';

interface BlogRelatedPostsProps {
  posts: BlogPostMeta[];
  language?: 'ja' | 'en';
}

/** Hash a string to a hue value 0-360 */
function tagToHue(tag: string): number {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 360) + 360) % 360;
}

function miniGradient(tags: string[]): string {
  if (tags.length === 0) return 'linear-gradient(135deg, hsl(220, 50%, 55%), hsl(260, 50%, 60%))';
  const hues = tags.slice(0, 2).map(tagToHue);
  if (hues.length === 1) {
    return `linear-gradient(135deg, hsl(${hues[0]}, 50%, 50%), hsl(${(hues[0] + 40) % 360}, 55%, 60%))`;
  }
  return `linear-gradient(135deg, hsl(${hues[0]}, 50%, 50%), hsl(${hues[1]}, 55%, 60%))`;
}

const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({
  posts,
  language = 'ja',
}) => {
  if (posts.length === 0) return null;

  const title = language === 'ja' ? '関連記事' : 'Related Articles';

  return (
    <section className="mt-14 pt-8 border-t border-gray-200">
      <h2 className="flex items-center gap-2.5 text-xl font-bold mb-6 text-gray-900">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600">
          <FaRegNewspaper className="text-sm" />
        </div>
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${language}/${post.slug}`}
            className="group block rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
          >
            {/* Mini gradient thumbnail */}
            <div
              className="h-3 w-full"
              style={{ background: miniGradient(post.tags) }}
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              {post.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {post.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{post.date}</p>
                <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  読む <FaArrowRight className="text-[10px]" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogRelatedPosts;
