import React from 'react';
import Link from 'next/link';
import { FaBookOpen, FaChevronRight } from 'react-icons/fa';
import OptimizedImage from './OptimizedImage';

interface ReferencedPost {
  id: number;
  title: string;
  authorName: string | null;
  imageUrl: string | null;
}

interface Props {
  posts: ReferencedPost[];
}

const BlogReferencedPosts: React.FC<Props> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="not-prose mt-14 pt-8 border-t border-gray-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaBookOpen className="text-theater-primary-500" />
        この記事で紹介した戯曲
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {posts.map((p) => (
          <li key={p.id}>
            <Link
              href={`/posts/${p.id}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-theater-primary-300 hover:bg-theater-primary-50/30 transition-colors group"
            >
              <div className="flex-shrink-0 w-12 h-16 bg-gray-100 rounded overflow-hidden">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <OptimizedImage src={p.imageUrl} alt="" width={120} height={120} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">作品</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-theater-primary-700">
                  {p.title}
                </p>
                {p.authorName && (
                  <p className="text-xs text-gray-500 mt-0.5">{p.authorName}</p>
                )}
              </div>
              <FaChevronRight className="text-gray-300 group-hover:text-theater-primary-500 flex-shrink-0" size={12} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BlogReferencedPosts;
