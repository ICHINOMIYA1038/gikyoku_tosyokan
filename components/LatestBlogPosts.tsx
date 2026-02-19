import React from "react";
import Link from "next/link";
import { FaPen, FaChevronRight } from "react-icons/fa";

type BlogPost = {
  slug: string;
  title: string;
  description: string | null;
  publishedAt: string;
  tags: string[];
};

type Props = {
  posts: BlogPost[];
};

const LatestBlogPosts: React.FC<Props> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <FaPen className="text-pink-500" />
            最新の記事
          </h2>
          <Link
            href="/blog/ja"
            className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1"
          >
            すべての記事 <FaChevronRight className="text-xs" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/ja/${post.slug}`}
              className="block group"
            >
              <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-pink-50 text-pink-600 text-[10px] font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-pink-700 transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                    {post.description}
                  </p>
                )}
                <div className="text-xs text-gray-400 mt-auto">
                  {post.publishedAt}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;
