import React from 'react';
import TypeCover from '@/components/TypeCover';
import Link from 'next/link';
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
    <section className="not-prose mt-14">
      <h2 className="!my-0 !pb-2 !text-lg !font-bold !text-gray-900 border-b-2 border-gray-900">この記事で紹介した戯曲</h2>
      <ul className="grid sm:grid-cols-2 sm:gap-x-6">
        {posts.map((p) => (
          <li key={p.id} className="border-b border-[#D9D5CF]">
            <Link href={`/posts/${p.id}`} className="group grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3 py-3 px-1 hover:bg-[#F4F2EE]">
              <span className="w-10 h-[53px] overflow-hidden">
                {p.imageUrl ? (
                  <OptimizedImage src={p.imageUrl} alt="" width={80} height={106} loading="lazy" className="w-full h-full object-cover grayscale" />
                ) : (
                  <TypeCover title={p.title} className="w-full h-full" titleClassName="text-[8px]" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block font-serif font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-theater-primary-700">{p.title}</span>
                {p.authorName && <span className="block text-sm text-gray-600">{p.authorName}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BlogReferencedPosts;
