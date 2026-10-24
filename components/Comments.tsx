import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ReportDialog = dynamic(() => import("@/components/ReportDialog"), { ssr: false });

const COMMENT_TYPES: { value: string; label: string }[] = [
  { value: "感想", label: "感想" },
  { value: "上演報告", label: "上演報告" },
  { value: "レビュー", label: "レビュー" },
  { value: "質問", label: "質問" },
];

const COMMENT_TYPE_STYLES: Record<string, true> = { "感想": true, "上演報告": true, "レビュー": true, "質問": true };

// コメントの下に並べる文字だけの操作ボタン
const ACTION = "min-h-[44px] px-1 text-sm text-gray-600 hover:text-gray-900 hover:underline underline-offset-4";

const MAX_CHARS_DEFAULT = 500;
const MAX_CHARS_REVIEW = 1000;
const INITIAL_DISPLAY_COUNT = 3;

type SortMode = "newest" | "popular";
type FilterType = "all" | "感想" | "上演報告" | "レビュー" | "質問";

const Comments = ({ comments: initialComments, postid, postTitle, inline = false }: any) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [reportTarget, setReportTarget] = useState<{ id: number; isParent: boolean } | null>(null);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [commentResult, setCommentResult] = useState("");
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("名無しさん");
  const [replyTo, setReplyTo] = useState<any>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [showRatingNudge, setShowRatingNudge] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // localStorageからいいね済みコメントを復元
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`liked_comments_${postid}`);
      if (stored) {
        setLikedComments(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, [postid]);

  // localStorageから名前を復元
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("comment_author_name");
      if (storedName) {
        setAuthorName(storedName);
      }
    } catch {}
  }, []);

  // ハッシュ遷移時のハイライトアニメーション
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#comments-section") {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveLiked = (newSet: Set<string>) => {
    setLikedComments(newSet);
    try {
      localStorage.setItem(`liked_comments_${postid}`, JSON.stringify(Array.from(newSet)));
    } catch {}
  };

  const handleLike = async (commentId: number, isParent: boolean) => {
    const key = `${isParent ? "p" : "c"}_${commentId}`;
    if (likedComments.has(key)) return;

    try {
      const response = await fetch("/api/likeComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, isParent }),
      });

      if (response.ok) {
        const updated = await response.json();
        if (isParent) {
          setComments((prev: any) =>
            prev.map((c: any) => c.id === commentId ? { ...c, likes: updated.likes } : c)
          );
        } else {
          setComments((prev: any) =>
            prev.map((c: any) => ({
              ...c,
              children: c.children?.map((ch: any) =>
                ch.id === commentId ? { ...ch, likes: updated.likes } : ch
              ),
            }))
          );
        }
        const newSet = new Set(likedComments);
        newSet.add(key);
        saveLiked(newSet);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleCommentSubmit = async () => {
    const name = authorName.trim() || "名無しさん";
    if (!newComment.trim()) return;
    const maxChars = selectedType === "レビュー" ? MAX_CHARS_REVIEW : MAX_CHARS_DEFAULT;
    if (newComment.length > maxChars) return;

    setIsSendingComment(true);
    setCommentResult("");
    try {
      const response = await fetch("/api/createComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: name,
          content: newComment,
          isParent: replyTo ? false : true,
          targetid: replyTo ? replyTo.id : postid,
          commentType: replyTo ? null : selectedType,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        if (newCommentData && newCommentData.content && newCommentData.author) {
          if (replyTo) {
            setComments((prevComments: any) =>
              prevComments.map((comment: any) =>
                comment.id === replyTo.id
                  ? { ...comment, children: [...(comment.children || []), newCommentData] }
                  : comment
              )
            );
          } else {
            setComments((prevComments: any) => [newCommentData, ...prevComments]);
          }
          setCommentResult("コメントが投稿されました！");
          setNewComment("");
          setReplyTo(null);
          setSelectedType(null);
          setShowAllComments(true);
          try {
            localStorage.setItem("comment_author_name", name);
          } catch {}
          // リアクションとコメントは独立した機能のため、ナッジは表示しない
        } else {
          setCommentResult("コメントのデータが不正です");
        }
      } else {
        setCommentResult("コメントの投稿に失敗しました");
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
      setCommentResult("エラーが発生しました");
    }
    setIsSendingComment(false);
  };

  const handleDelete = async (commentId: number, isParent: boolean) => {
    if (!confirm("このコメントを削除しますか？")) return;

    // 楽観的更新: APIレスポンスを待たず即座にUIを更新
    const prevComments = [...comments];
    if (isParent) {
      setComments((prev: any) =>
        prev.map((c: any) =>
          c.id === commentId ? { ...c, deleted: true, content: "[削除されたコメントです]" } : c
        )
      );
    } else {
      setComments((prev: any) =>
        prev.map((c: any) => ({
          ...c,
          children: c.children?.map((ch: any) =>
            ch.id === commentId ? { ...ch, deleted: true, content: "[削除されたコメントです]" } : ch
          ),
        }))
      );
    }

    // バックグラウンドでAPI呼び出し、失敗時はロールバック
    try {
      const response = await fetch("/api/deleteComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, isParent, postId: postid }),
      });
      if (!response.ok) {
        setComments(prevComments);
        const err = await response.json();
        alert(err.error || "削除に失敗しました");
      }
    } catch (error) {
      setComments(prevComments);
      console.error("Delete error:", error);
      alert("削除中にエラーが発生しました");
    }
  };

  const isOwnComment = (comment: any): boolean => {
    if (!session?.user?.id) return false;
    return comment.user?.id === session.user.id || comment.userId === session.user.id;
  };

  const handleReplyClick = (comment: any) => {
    setReplyTo(comment);
    setTimeout(() => {
      document.getElementById("comment-input")?.focus();
    }, 100);
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  const handleShareComment = (comment: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const title = postTitle || "この作品";
    const text = `「${title}」への${comment.commentType || "コメント"}：${comment.content.substring(0, 60)}${comment.content.length > 60 ? "..." : ""}`;
    const url = `https://gikyokutosyokan.com/posts/${postid}#comments-section`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "width=550,height=420"
    );
  };

  const totalCommentCount = useMemo(() => {
    return comments.reduce((acc: number, c: any) => {
      return acc + 1 + (c.children?.length || 0);
    }, 0);
  }, [comments]);

  const typeCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    comments.forEach((c: any) => {
      const type = c.commentType || "未分類";
      map[type] = (map[type] || 0) + 1;
    });
    return map;
  }, [comments]);

  const processedComments = useMemo(() => {
    let filtered = [...comments];

    if (filterType !== "all") {
      filtered = filtered.filter((c: any) => c.commentType === filterType);
    }

    if (sortMode === "popular") {
      filtered.sort((a: any, b: any) => {
        const aLikes = (a.likes || 0) + (a.children || []).reduce((sum: number, ch: any) => sum + (ch.likes || 0), 0);
        const bLikes = (b.likes || 0) + (b.children || []).reduce((sum: number, ch: any) => sum + (ch.likes || 0), 0);
        return bLikes - aLikes;
      });
    }

    return filtered;
  }, [comments, sortMode, filterType]);

  const displayedComments = inline && !showAllComments
    ? processedComments.slice(0, INITIAL_DISPLAY_COUNT)
    : processedComments;
  const hasMore = inline && !showAllComments && processedComments.length > INITIAL_DISPLAY_COUNT;

  const typeLabel = (commentType: string | null) =>
    commentType && COMMENT_TYPES.some((t) => t.value === commentType) ? (
      <span className="px-1.5 py-px border border-[#D9D5CF] rounded text-xs text-gray-700">{commentType}</span>
    ) : null;

  const renderLikeButton = (id: number, likes: number, isParent: boolean) => {
    const key = `${isParent ? "p" : "c"}_${id}`;
    const isLiked = likedComments.has(key);
    return (
      <button
        className={`${ACTION} ${isLiked ? "!text-theater-primary-700 cursor-default" : ""}`}
        onClick={() => !isLiked && handleLike(id, isParent)}
        disabled={isLiked}
        aria-pressed={isLiked}
      >
        参考になった{likes > 0 && <span className="ml-1 tabular-nums">{likes}</span>}
      </button>
    );
  };

  const renderAuthor = (c: any) => (
    <span className="inline-flex items-center gap-2">
      {(c.user?.avatarUrl || c.user?.image) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.user.avatarUrl || c.user.image} alt="" className="w-6 h-6 rounded-full object-cover" />
      )}
      {c.user?.id ? (
        <Link href={`/users/${c.user.id}`} className="font-bold text-gray-900 hover:underline">
          {c.user.displayName || c.author}
        </Link>
      ) : (
        <span className="font-bold text-gray-900">{c.author}</span>
      )}
    </span>
  );

  const hasFilterableTypes = Object.keys(typeCountMap).some((t) => COMMENT_TYPE_STYLES[t]);
  const loginHref = `/auth/signin?callbackUrl=${encodeURIComponent(`/posts/${postid}#comments-section`)}`;
  const maxChars = selectedType === "レビュー" ? MAX_CHARS_REVIEW : MAX_CHARS_DEFAULT;
  const resultIsError = /失敗|エラー|不正/.test(commentResult);

  return (
    <section
      className={`comments-section scroll-mt-20 transition-shadow duration-1000 ${isHighlighted ? "ring-2 ring-theater-primary-300 ring-offset-8" : ""}`}
      id="comments-section"
      ref={sectionRef}
      aria-labelledby="comments-heading"
    >
      <div className="flex items-baseline gap-3">
        <h2 id="comments-heading" className="!my-0 !pb-0 !text-xl md:!text-2xl !font-bold !text-gray-900">みんなの声</h2>
        {totalCommentCount > 0 && <span className="text-sm text-gray-600 tabular-nums">{totalCommentCount}件</span>}
      </div>
      <p className="mt-2 text-sm text-gray-700">
        読んだ感想、上演した記録、演出の工夫、質問など。次にこの作品を選ぶ人の参考になります。
      </p>

      {/* 入力欄。ログイン中はいつも開いておき、すぐ書けるようにする */}
      {session ? (
        <div className="mt-5 border border-[#D9D5CF] rounded p-4">
          {replyTo ? (
            <div className="mb-3 flex items-start justify-between gap-3 text-sm">
              <p className="min-w-0 text-gray-700">
                <span className="font-bold text-gray-900">{replyTo.author}</span>さんへの返信：
                <span className="text-gray-600">{replyTo.content.substring(0, 30)}{replyTo.content.length > 30 ? "…" : ""}</span>
              </p>
              <button className="shrink-0 text-gray-600 underline underline-offset-4 hover:text-gray-900" onClick={cancelReply}>
                返信をやめる
              </button>
            </div>
          ) : (
            <fieldset className="mb-3">
              <legend className="sr-only">コメントの種類</legend>
              <div className="flex flex-wrap gap-2 text-sm">
                {[{ value: null, label: "自由に" }, ...COMMENT_TYPES].map((type) => {
                  const active = selectedType === type.value;
                  return (
                    <button
                      key={type.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedType(type.value)}
                      className={`h-9 px-3 rounded border ${active ? "border-gray-900 text-gray-900 font-bold" : "border-[#D9D5CF] text-gray-700 hover:border-gray-500"}`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <label htmlFor="comment-input" className="sr-only">コメント</label>
          <textarea
            id="comment-input"
            placeholder={
              replyTo
                ? `${replyTo.author}さんに返信`
                : selectedType === "上演報告"
                  ? "いつ・どこで・何人で上演したか、やってみて分かったことなど"
                  : selectedType === "質問"
                    ? "上演したことがある人に聞きたいこと"
                    : "読んだ感想、上演した記録、演出の工夫など"
            }
            className="w-full min-h-[112px] p-3 rounded border border-[#D9D5CF] text-base leading-relaxed resize-y focus:outline-none focus:border-theater-primary-600"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={maxChars}
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              <span className={newComment.length > maxChars * 0.9 ? "text-theater-primary-700 font-bold" : ""}>{newComment.length}</span>/{maxChars}字
              <span className="mx-2">・</span>
              {session.user.name ?? "ユーザー"}として投稿
              <span className="mx-2">・</span>
              <button className="underline underline-offset-4 hover:text-gray-900" onClick={() => setShowGuidelines(!showGuidelines)} aria-expanded={showGuidelines}>
                投稿のルール
              </button>
            </p>
            <button
              className="h-11 px-6 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
              onClick={handleCommentSubmit}
              disabled={isSendingComment || !newComment.trim()}
            >
              {isSendingComment ? "送信中…" : replyTo ? "返信する" : "投稿する"}
            </button>
          </div>

          {commentResult && (
            <p role="status" className={`mt-2 text-sm ${resultIsError ? "text-theater-primary-700" : "text-[#1F7A4D]"}`}>{commentResult}</p>
          )}

          {showGuidelines && (
            <div className="mt-3 pt-3 border-t border-[#D9D5CF] text-xs leading-relaxed text-gray-700">
              <ul className="list-disc pl-4 space-y-1">
                <li>誹謗中傷、他人へのなりすましはしない</li>
                <li>作品と関係のない投稿、事実と違う投稿はしない</li>
                <li>同じ内容を何度も投稿しない</li>
                <li>個人情報を書かない</li>
                <li>削除を希望するときは、お問い合わせフォームから連絡してください</li>
              </ul>
              <p className="mt-2">「面白かった」「上演します」「上演しました」など、気軽に書いてください。公演の宣伝も歓迎です。</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 border border-[#D9D5CF] rounded p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            {comments.length === 0 ? "まだ書き込みはありません。最初のひとことを書いてみませんか。" : "書き込むには、無料のログインが必要です。"}
          </p>
          <Link href={loginHref} className="inline-flex items-center justify-center h-11 px-5 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold shrink-0">
            ログインして書く
          </Link>
        </div>
      )}

      {/* 並べ替えと種類の絞り込み */}
      {comments.length > 1 && (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <div className="flex gap-4" role="group" aria-label="並べ替え">
            {([["newest", "新着順"], ["popular", "参考になった順"]] as const).map(([mode, label]) => (
              <button
                key={mode}
                aria-pressed={sortMode === mode}
                onClick={() => setSortMode(mode)}
                className={sortMode === mode ? "font-bold text-gray-900 underline underline-offset-[6px] decoration-2 decoration-theater-primary-600" : "text-gray-600 hover:text-gray-900"}
              >
                {label}
              </button>
            ))}
          </div>
          {hasFilterableTypes && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="種類">
              {[{ value: "all", label: "すべて" }, ...COMMENT_TYPES.filter((t) => typeCountMap[t.value])].map((t) => {
                const active = filterType === t.value;
                return (
                  <button
                    key={t.value}
                    aria-pressed={active}
                    onClick={() => setFilterType(active && t.value !== "all" ? "all" : (t.value as FilterType))}
                    className={`h-8 px-2.5 rounded border text-xs ${active ? "border-gray-900 text-gray-900 font-bold" : "border-[#D9D5CF] text-gray-700 hover:border-gray-500"}`}
                  >
                    {t.label}
                    {t.value !== "all" && <span className="ml-1 tabular-nums text-gray-500">{typeCountMap[t.value]}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {comments.length > 0 && processedComments.length === 0 && (
        <p className="mt-6 py-8 text-center text-sm text-gray-600 border-y border-[#D9D5CF]">この種類の書き込みはまだありません。</p>
      )}

      {processedComments.length > 0 && (
        <ul className="mt-4 border-t border-[#D9D5CF]">
          {displayedComments.map((comment: any) => (
            <li key={comment.id} className="border-b border-[#D9D5CF] py-4">
              {!comment.deleted ? (
                <>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    {renderAuthor(comment)}
                    <span className="text-gray-500">{comment.date}</span>
                    {typeLabel(comment.commentType)}
                  </div>
                  <p className="mt-2 text-base leading-relaxed text-gray-900 whitespace-pre-wrap break-words">{comment.content}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 -ml-1">
                    {renderLikeButton(comment.id, comment.likes || 0, true)}
                    <button className={ACTION} onClick={() => (session ? handleReplyClick(comment) : (window.location.href = loginHref))}>返信</button>
                    <button className={ACTION} onClick={(e) => handleShareComment(comment, e)}>Xで共有</button>
                    {isOwnComment(comment) && <button className={ACTION} onClick={() => handleDelete(comment.id, true)}>削除</button>}
                    {session && !isOwnComment(comment) && (
                      <button className={ACTION} onClick={() => setReportTarget({ id: comment.id, isParent: true })}>通報</button>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">このコメントは削除されました</p>
              )}

              {comment.children && comment.children.length > 0 && (
                <ul className="mt-3 ml-3 md:ml-6 pl-4 border-l-2 border-[#D9D5CF] space-y-4">
                  {comment.children.map((elem: any) => (
                    <li key={elem.id}>
                      {!elem.deleted ? (
                        <>
                          <div className="flex flex-wrap items-center gap-x-2 text-sm">
                            {renderAuthor(elem)}
                            <span className="text-gray-500">{elem.date}</span>
                          </div>
                          <p className="mt-1 text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap break-words">{elem.content}</p>
                          <div className="mt-1 flex items-center gap-x-4 -ml-1">
                            {renderLikeButton(elem.id, elem.likes || 0, false)}
                            {isOwnComment(elem) && <button className={ACTION} onClick={() => handleDelete(elem.id, false)}>削除</button>}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">このコメントは削除されました</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <button
          className="mt-4 w-full h-11 rounded border border-[#D9D5CF] text-sm font-bold text-gray-900 hover:bg-[#F4F2EE]"
          onClick={() => setShowAllComments(true)}
        >
          残りの{processedComments.length - INITIAL_DISPLAY_COUNT}件を表示
        </button>
      )}

      {reportTarget && (
        <ReportDialog
          targetType="comment"
          targetId={reportTarget.id}
          targetUrl={`/posts/${postid}#comments-section`}
          onClose={() => setReportTarget(null)}
        />
      )}
    </section>
  );
};

export default Comments;
