import React from "react";
import Link from "next/link";
import { FaCommentDots, FaThumbsUp, FaTheaterMasks, FaStar, FaQuestionCircle, FaChevronRight, FaPen } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const COMMENT_TYPE_CONFIG: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  "感想": { icon: <FaCommentDots className="text-[10px]" />, bg: "bg-blue-50", text: "text-blue-600" },
  "上演報告": { icon: <FaTheaterMasks className="text-[10px]" />, bg: "bg-green-50", text: "text-green-600" },
  "レビュー": { icon: <FaStar className="text-[10px]" />, bg: "bg-purple-50", text: "text-purple-600" },
  "質問": { icon: <FaQuestionCircle className="text-[10px]" />, bg: "bg-orange-50", text: "text-orange-600" },
};

type RecentComment = {
  id: number;
  content: string;
  author: string;
  date: string;
  likes: number;
  commentType: string | null;
  postId: number;
  postTitle: string;
  postAuthor: string;
  userId?: string | null;
};

const fetchRecentComments = async (): Promise<RecentComment[]> => {
  const res = await fetch("/api/recent-comments");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const RecentComments: React.FC = () => {
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["recentComments"],
    queryFn: fetchRecentComments,
    staleTime: 1000 * 60 * 5,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <section className="py-8 px-4 bg-gradient-to-b from-theater-primary-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <FaCommentDots className="text-theater-primary-500" />
            みんなの声
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !comments || comments.length === 0) {
    return null;
  }

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-theater-primary-50/50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <FaCommentDots className="text-theater-primary-500" />
            みんなの声
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            作品を読んだ方、上演した方からのコメント
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comments.map((comment) => {
            const typeConfig = comment.commentType ? COMMENT_TYPE_CONFIG[comment.commentType] : null;
            return (
              <Link
                key={comment.id}
                href={`/posts/${comment.postId}#comments-section`}
                className="block group"
              >
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-theater-primary-200 hover:shadow-md transition-all h-full flex flex-col">
                  {/* 作品情報 */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-50">
                    <div className="w-7 h-7 bg-theater-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaTheaterMasks className="text-theater-primary-500 text-xs" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 truncate group-hover:text-theater-primary-700 transition-colors">
                        {comment.postTitle}
                      </p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <FaPen className="text-[8px]" />
                        {comment.postAuthor}
                      </p>
                    </div>
                    <FaChevronRight className="text-gray-300 text-xs flex-shrink-0 group-hover:text-theater-primary-400 transition-colors" />
                  </div>

                  {/* コメントタイプ */}
                  {typeConfig && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium w-fit mb-2 ${typeConfig.bg} ${typeConfig.text}`}>
                      {typeConfig.icon}
                      {comment.commentType}
                    </span>
                  )}

                  {/* コメント本文 */}
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">
                    {comment.content}
                  </p>

                  {/* フッター */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                    <div className="text-xs text-gray-400">
                      {comment.userId ? (
                        <span
                          className="font-medium text-gray-500 hover:text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/users/${comment.userId}`;
                          }}
                        >
                          {comment.author}
                        </span>
                      ) : (
                        <span className="font-medium text-gray-500">{comment.author}</span>
                      )}
                      <span className="mx-1">·</span>
                      {comment.date}
                    </div>
                    {comment.likes > 0 && (
                      <div className="flex items-center gap-1 text-xs text-theater-primary-500">
                        <FaThumbsUp className="text-[10px]" />
                        <span>{comment.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">
            あなたの感想・上演報告も投稿できます
          </p>
          <p className="text-xs text-gray-400">
            各作品ページのコメント欄からご投稿ください
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecentComments;
