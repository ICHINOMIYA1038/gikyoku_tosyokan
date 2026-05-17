import React from 'react';
import Link from 'next/link';
import { FaNewspaper, FaChevronRight } from 'react-icons/fa';

interface BlogMention {
  slug: string;
  title: string;
  date: string;
  description: string;
}

interface Props {
  posts: BlogMention[];
}

const PostBlogMentions: React.FC<Props> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-10 p-5 md:p-6 bg-gradient-to-br from-amber-50/60 to-white rounded-xl border border-amber-100">
      <h2 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaNewspaper className="text-amber-500" />
        この作品が登場するブログ記事
      </h2>
      <ul className="space-y-2.5">
        {posts.map((bp) => (
          <li key={bp.slug}>
            <Link
              href={`/blog/ja/${bp.slug}`}
              className="flex items-start gap-3 p-3 rounded-lg bg-white border border-transparent hover:border-amber-200 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-amber-700">
                  {bp.title}
                </p>
                {bp.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{bp.description}</p>
                )}
                <p className="text-[11px] text-gray-400 mt-1">{bp.date}</p>
              </div>
              <FaChevronRight className="text-gray-300 group-hover:text-amber-500 flex-shrink-0 mt-1" size={12} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PostBlogMentions;
