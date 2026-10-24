import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog';

// ブログの記事の行。日付・題名・説明・タグ
export default function BlogPostRow({ post, lang = 'ja' }: { post: BlogPostMeta; lang?: 'ja' | 'en' }) {
  return (
    <li className="border-b border-[#D9D5CF]">
      <Link href={`/blog/${lang}/${post.slug}`} className="group grid sm:grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 py-4 px-1 hover:bg-[#F4F2EE]">
        <time dateTime={post.date} className="text-sm text-gray-600 tabular-nums">{post.date.replace(/-/g, '/')}</time>
        <span className="min-w-0">
          <span className="block font-bold text-[17px] leading-snug text-gray-900 line-clamp-2 group-hover:text-theater-primary-700">{post.title}</span>
          {post.description && <span className="block mt-1 text-sm text-gray-600 line-clamp-2">{post.description}</span>}
          {post.tags.length > 0 && <span className="block mt-1 text-xs text-gray-500">{post.tags.slice(0, 3).map((t) => `#${t}`).join('　')}</span>}
        </span>
      </Link>
    </li>
  );
}
