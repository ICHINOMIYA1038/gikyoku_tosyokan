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
    <section className="not-prose mt-14">
      <h2 className="!my-0 !pb-2 !text-lg !font-bold !text-gray-900 border-b-2 border-gray-900">{title}</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-[#D9D5CF]">
            <Link href={`/blog/${language}/${post.slug}`} className="group block py-3 px-1 hover:bg-[#F4F2EE]">
              <span className="block font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-theater-primary-700">{post.title}</span>
              {post.description && <span className="block mt-0.5 text-sm text-gray-600 line-clamp-1">{post.description}</span>}
              <span className="block mt-0.5 text-xs text-gray-500 tabular-nums">{post.date.replace(/-/g, '/')}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BlogRelatedPosts;
