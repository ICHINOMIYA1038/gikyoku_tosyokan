import React from 'react';
import Link from 'next/link';

interface BlogMention {
  slug: string;
  title: string;
  date: string;
  description: string;
}

interface Props {
  posts: BlogMention[];
}

// 作品が出てくるブログ記事の行。見出しは置く側（作品ページ）で付ける
const PostBlogMentions: React.FC<Props> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <ul className="border-t border-[#D9D5CF]">
      {posts.map((bp) => (
        <li key={bp.slug} className="border-b border-[#D9D5CF]">
          <Link href={`/blog/ja/${bp.slug}`} className="group block py-3 px-2 hover:bg-[#F4F2EE]">
            <span className="block font-bold text-gray-900 line-clamp-2 group-hover:text-theater-primary-700">{bp.title}</span>
            {bp.description && <span className="block mt-0.5 text-sm text-gray-600 line-clamp-1">{bp.description}</span>}
            <span className="block mt-0.5 text-xs text-gray-500 tabular-nums">{bp.date.replace(/-/g, '/')}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostBlogMentions;
