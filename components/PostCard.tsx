import * as React from "react";
import { Post as PostType } from "@prisma/client";
import Link from "next/link";
import OptimizedImage from "./OptimizedImage";
import TypeCover from "./TypeCover";
import FavoriteButton from "@/components/FavoriteButton";

type PostPageProps = {
  post: PostType & { author: { id: number; name: string } };
  rank?: number;
};

const FREE_CATEGORY = "無料で読める！";
// ジャンルではないカテゴリ（台本の入手先、時間や人数の目安、賞）は、ジャンル欄に出さない
const NON_GENRE = new Set([FREE_CATEGORY, "戯曲デジタルアーカイブ", "60分以内", "人数多数", "岸田國士戯曲賞", "OMS戯曲賞"]);

function castLabel(post: any) {
  if (!post.totalNumber || post.totalNumber <= 0) return null;
  const parts = [];
  if (post.man > 0) parts.push(`男${post.man}`);
  if (post.woman > 0) parts.push(`女${post.woman}`);
  return parts.length > 0 ? `${post.totalNumber}人（${parts.join("・")}）` : `${post.totalNumber}人`;
}

// 一覧の1行。人数・時間・ジャンル・台本の桁がそろうよう、PC では列で並べる
const PostCard: React.FC<PostPageProps> = ({ post, rank }: any) => {
  const genres = (post.categories || []).filter((c: any) => !NON_GENRE.has(c.name));
  const isFree = (post.categories || []).some((c: any) => c.name === FREE_CATEGORY);
  const cast = castLabel(post);
  const playtime = post.playtime && post.playtime > 0 ? `${post.playtime}分` : null;

  return (
    <div className="group relative border-b border-[#D9D5CF] hover:bg-[#F4F2EE] transition-colors">
      <Link
        href={`/posts/${post.id}`}
        className="grid grid-cols-[56px_minmax(0,1fr)_auto] md:grid-cols-[48px_minmax(0,1fr)_9rem_4.5rem_8rem_4.5rem_2.5rem] items-center gap-x-4 py-3 pr-10 md:pr-2"
        aria-label={`${post.title} - ${post.author?.name ?? ""}`}
      >
        <div className="w-14 h-[75px] md:w-12 md:h-16 overflow-hidden">
          {post.image_url ? (
            <OptimizedImage
              src={post.image_url}
              alt=""
              className="w-full h-full object-cover grayscale"
              loading="lazy"
              width={96}
              height={128}
              sizes="56px"
            />
          ) : (
            <TypeCover title={post.title} className="w-full h-full" titleClassName="text-[9px]" />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-serif font-bold text-[17px] md:text-lg leading-snug text-gray-900 group-hover:text-theater-primary-700 line-clamp-2 md:line-clamp-1">
            {rank ? <span className="font-sans font-bold text-gray-500 mr-2">{rank}.</span> : null}
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 truncate">{post.author?.name}</p>
          {/* スマホでは人数・時間・台本を1行にまとめる */}
          <p className="md:hidden mt-1 text-sm text-gray-800">
            {[cast, playtime, isFree ? "無料" : null].filter(Boolean).join("・")}
          </p>
        </div>

        <span className="hidden md:block text-sm text-gray-800 tabular-nums">{cast ?? "—"}</span>
        <span className="hidden md:block text-sm text-gray-800 tabular-nums">{playtime ?? "—"}</span>
        <span className="hidden md:block text-sm text-gray-600 truncate">{genres[0]?.name ?? "—"}</span>
        <span className="hidden md:block">
          {isFree && <span className="inline-block px-2 py-0.5 rounded text-xs font-medium text-[#1F7A4D] bg-[#E6F2EC]">無料</span>}
        </span>
        <span className="hidden md:block" />
      </Link>
      <div className="absolute right-2 top-3 md:top-1/2 md:-translate-y-1/2">
        <FavoriteButton postId={post.id} size="sm" />
      </div>
    </div>
  );
};

export default PostCard;
