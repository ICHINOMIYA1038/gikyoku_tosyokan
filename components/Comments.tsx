import React, { useState, useEffect, useMemo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faTimes, faInfoCircle, faThumbsUp, faTheaterMasks, faCommentDots, faQuestionCircle, faPaperPlane, faStar, faFire, faClock, faShareAlt, faCheck, faTrash, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useSession, signIn } from "next-auth/react";

const COMMENT_TYPES = [
  { value: "感想", label: "感想", icon: faCommentDots, color: "blue", bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" },
  { value: "上演報告", label: "上演報告", icon: faTheaterMasks, color: "green", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { value: "レビュー", label: "レビュー", icon: faStar, color: "purple", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  { value: "質問", label: "質問", icon: faQuestionCircle, color: "orange", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
];

const COMMENT_TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "感想": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "上演報告": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "レビュー": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "質問": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};

const MAX_CHARS_DEFAULT = 500;
const MAX_CHARS_REVIEW = 1000;
const INITIAL_DISPLAY_COUNT = 3;

type SortMode = "newest" | "popular";
type FilterType = "all" | "感想" | "上演報告" | "レビュー" | "質問";

const Comments = ({ comments: initialComments, postid, postTitle, inline = false }: any) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [commentResult, setCommentResult] = useState("");
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("名無しさん");
  const [replyTo, setReplyTo] = useState<any>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
          setShowForm(false);
          setShowAllComments(true);
          try {
            localStorage.setItem("comment_author_name", name);
          } catch {}
          if (!replyTo) {
            setTimeout(() => setShowRatingNudge(true), 500);
          }
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
    try {
      const response = await fetch("/api/deleteComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, isParent }),
      });
      if (response.ok) {
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
      } else {
        const err = await response.json();
        alert(err.error || "削除に失敗しました");
      }
    } catch (error) {
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
    setShowForm(true);
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

  const renderCommentTypeTag = (commentType: string | null) => {
    if (!commentType || !COMMENT_TYPE_STYLES[commentType]) return null;
    const style = COMMENT_TYPE_STYLES[commentType];
    const typeConfig = COMMENT_TYPES.find(t => t.value === commentType);
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${style.bg} ${style.text} border ${style.border}`}>
        {typeConfig && <FontAwesomeIcon icon={typeConfig.icon} className="w-2.5 h-2.5" />}
        {commentType}
      </span>
    );
  };

  const renderLikeButton = (id: number, likes: number, isParent: boolean) => {
    const key = `${isParent ? "p" : "c"}_${id}`;
    const isLiked = likedComments.has(key);
    return (
      <button
        className={`flex items-center gap-1.5 text-sm transition-colors rounded-full px-2.5 py-1.5 min-h-[44px] ${
          isLiked
            ? "text-pink-600 bg-pink-50 cursor-default"
            : "text-gray-400 hover:text-pink-600 hover:bg-pink-50 active:bg-pink-100"
        }`}
        onClick={() => !isLiked && handleLike(id, isParent)}
        disabled={isLiked}
        aria-label="いいね"
      >
        <FontAwesomeIcon icon={faThumbsUp} className={`w-3 h-3 ${isLiked ? "text-pink-600" : ""}`} />
        {likes > 0 && <span className="font-medium text-xs">{likes}</span>}
        {!isLiked && likes === 0 && <span className="text-xs hidden sm:inline">参考になった</span>}
      </button>
    );
  };

  const hasFilterableTypes = Object.keys(typeCountMap).some(
    (t) => COMMENT_TYPE_STYLES[t]
  );

  return (
    <div className={`comments-section transition-all duration-1000 ${isHighlighted ? "ring-2 ring-pink-300 ring-offset-4 rounded-xl" : ""}`} id="comments-section" ref={sectionRef}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-pink-600 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-gray-800">
            みんなの声
          </h2>
          {totalCommentCount > 0 && (
            <span className="bg-pink-600 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
              {totalCommentCount}
            </span>
          )}
        </div>
      </div>

      {/* CTA: コメントがない場合 */}
      {comments.length === 0 && !showForm && (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400 mb-4">
            まだコメントはありません
          </p>
          <button
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white text-sm font-bold rounded-full transition-colors min-h-[44px]"
            onClick={() => setShowForm(true)}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" />
            最初のコメントを書く
          </button>
        </div>
      )}

      {/* CTA: コメントがある場合 - テキスト入力風プロンプト */}
      {comments.length > 0 && !showForm && (
        <button
          className="w-full mb-5 flex items-center gap-2.5 px-4 py-3 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg text-left transition-colors min-h-[48px] group"
          onClick={() => setShowForm(true)}
        >
          <FontAwesomeIcon icon={faPaperPlane} className="text-pink-400 w-3.5 h-3.5" />
          <span className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors">
            コメントを書く...
          </span>
        </button>
      )}

      {/* コメント入力フォーム */}
      {showForm && (
        <div className="bg-white shadow-md rounded-xl p-4 md:p-6 mb-6 border border-gray-100">
          {/* 返信先表示 */}
          {replyTo && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg flex justify-between items-center">
              <div className="flex items-center min-w-0">
                <FontAwesomeIcon icon={faReply} className="text-blue-500 w-3 h-3 mr-2 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-bold text-gray-700">返信先: </span>
                  <span className="text-sm text-gray-600 truncate">
                    {replyTo.author}: {replyTo.content.substring(0, 30)}{replyTo.content.length > 30 ? "..." : ""}
                  </span>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={cancelReply}
                aria-label="返信をキャンセル"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {/* コメントタイプ選択 - セグメントコントロール */}
          {!replyTo && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1.5">種類（任意）</p>
              <div className="flex gap-0.5 p-1 bg-gray-100 rounded-lg overflow-x-auto">
                <button
                  className={`flex-1 flex items-center justify-center py-2 px-2 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                    selectedType === null
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  onClick={() => setSelectedType(null)}
                >
                  自由
                </button>
                {COMMENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    className={`flex-1 flex items-center justify-center py-2 px-2 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                      selectedType === type.value
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 名前入力 / ログイン中の表示 */}
          {session ? (
            <div className="mb-3 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              {session.user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "user"}
                  className="w-7 h-7 rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-700">
                  <span className="font-medium">{session.user.name ?? "ユーザー"}</span>{" "}
                  としてログイン中
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-400">名前（任意）</p>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="w-2.5 h-2.5" />
                  ログインして投稿
                </button>
              </div>
              <input
                type="text"
                placeholder="名無しさん"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition text-sm min-h-[44px]"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
          )}

          {/* コメント入力 */}
          <div className="mb-3 relative">
            <textarea
              id="comment-input"
              placeholder={replyTo ? `${replyTo.author}さんに返信...` : "この作品の感想、上演した際の体験談など、自由にお書きください"}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition min-h-[120px] text-sm resize-y"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={selectedType === "レビュー" ? MAX_CHARS_REVIEW : MAX_CHARS_DEFAULT}
            />
            <div className={`absolute bottom-2 right-3 text-xs ${
              newComment.length > (selectedType === "レビュー" ? MAX_CHARS_REVIEW : MAX_CHARS_DEFAULT) * 0.9 ? "text-red-500" : "text-gray-400"
            }`}>
              {newComment.length}/{selectedType === "レビュー" ? MAX_CHARS_REVIEW : MAX_CHARS_DEFAULT}
            </div>
          </div>

          {/* 送信ボタンエリア */}
          <div className="flex items-center justify-between gap-3">
            <button
              className="text-sm text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors px-3 py-2.5 min-h-[44px]"
              onClick={() => { setShowForm(false); setReplyTo(null); }}
            >
              キャンセル
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-colors min-h-[44px] ${
                isSendingComment || !newComment.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white"
              }`}
              onClick={handleCommentSubmit}
              disabled={isSendingComment || !newComment.trim()}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" />
              {isSendingComment ? "送信中..." : "送信"}
            </button>
          </div>

          {commentResult && (
            <p className={`mt-2 text-sm font-medium ${
              commentResult.includes("失敗") || commentResult.includes("エラー") || commentResult.includes("不正")
                ? "text-red-500"
                : "text-green-600"
            }`}>
              <FontAwesomeIcon icon={commentResult.includes("失敗") || commentResult.includes("エラー") || commentResult.includes("不正") ? faTimes : faCheck} className="w-3 h-3 mr-1" />
              {commentResult}
            </p>
          )}

          {/* 注意事項 */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="flex items-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3 mr-1" />
              コメント投稿時の注意事項 {showGuidelines ? "▲" : "▼"}
            </button>

            {showGuidelines && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100">
                <ul className="list-disc pl-4 space-y-1">
                  <li>誹謗中傷、他人へのなりすましの禁止</li>
                  <li>本記事と関係のない投稿、事実に反する投稿の禁止</li>
                  <li>重複投稿やスパム行為の禁止</li>
                  <li>個人情報を含む投稿の禁止</li>
                  <li>削除を希望される場合はお問い合わせフォームよりご連絡ください</li>
                </ul>
                <p className="mt-2">
                  <span className="font-medium">面白かった！上演します！上演しました！</span>
                  などご自由にお書きください。公演の宣伝も大歓迎です！
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ソート＆フィルターバー */}
      {comments.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors min-h-[36px] ${
                sortMode === "newest"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSortMode("newest")}
            >
              <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5" />
              新着順
            </button>
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors min-h-[36px] ${
                sortMode === "popular"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSortMode("popular")}
            >
              <FontAwesomeIcon icon={faFire} className="w-2.5 h-2.5" />
              人気順
            </button>
          </div>

          {hasFilterableTypes && (
            <>
              <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border min-h-[32px] ${
                    filterType === "all"
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setFilterType("all")}
                >
                  すべて
                </button>
                {COMMENT_TYPES.map((type) => {
                  const count = typeCountMap[type.value] || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={type.value}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border min-h-[32px] ${
                        filterType === type.value
                          ? `${COMMENT_TYPE_STYLES[type.value].bg} ${COMMENT_TYPE_STYLES[type.value].text} ${COMMENT_TYPE_STYLES[type.value].border}`
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setFilterType(filterType === type.value ? "all" : type.value as FilterType)}
                    >
                      <FontAwesomeIcon icon={type.icon} className="w-2.5 h-2.5" />
                      {type.label}
                      <span className="text-[10px] opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* フィルター結果が0件の場合 */}
      {comments.length > 0 && processedComments.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          この種類のコメントはまだありません
        </div>
      )}

      {/* コメントリスト */}
      {processedComments.length > 0 && (
        <div className="space-y-4">
          {displayedComments.map((comment: any, index: number) => (
            <div key={comment.id} className="comment-thread">
              {sortMode === "popular" && index === 0 && (comment.likes || 0) > 0 && (
                <div className="flex items-center gap-1.5 mb-1.5 ml-1">
                  <FontAwesomeIcon icon={faFire} className="text-orange-400 w-3 h-3" />
                  <span className="text-xs font-medium text-orange-600">人気のコメント</span>
                </div>
              )}
              <div className={`rounded-xl p-4 border transition ${
                comment.commentType === "レビュー"
                  ? "bg-purple-50/50 border-purple-200 border-2 hover:border-purple-300"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}>
                {!comment.deleted ? (
                  <>
                    {comment.commentType && (
                      <div className="mb-2">
                        {renderCommentTypeTag(comment.commentType)}
                      </div>
                    )}
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {comment.user?.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={comment.user.image}
                            alt={comment.author}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span className="font-medium text-gray-600">{comment.author}</span>
                        {comment.user && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded">認証済</span>
                        )}
                        <span className="mx-0.5">·</span>
                        {comment.date}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {renderLikeButton(comment.id, comment.likes || 0, true)}
                        <button
                          className="flex items-center gap-1 text-sm text-gray-400 hover:text-pink-500 hover:bg-pink-50 active:bg-pink-100 rounded-full px-2 py-1.5 min-h-[44px] transition-colors"
                          onClick={() => handleReplyClick(comment)}
                        >
                          <FontAwesomeIcon icon={faReply} className="w-3 h-3" />
                          <span className="text-xs hidden sm:inline">返信</span>
                        </button>
                        <button
                          className="flex items-center text-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 active:bg-blue-100 rounded-full px-2 py-1.5 min-h-[44px] transition-colors"
                          onClick={(e) => handleShareComment(comment, e)}
                          aria-label="シェア"
                        >
                          <FontAwesomeIcon icon={faShareAlt} className="w-3 h-3" />
                        </button>
                        {isOwnComment(comment) && (
                          <button
                            className="flex items-center text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 rounded-full px-2 py-1.5 min-h-[44px] transition-colors"
                            onClick={() => handleDelete(comment.id, true)}
                            aria-label="削除"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 italic text-sm">このコメントは削除されました</div>
                )}
              </div>

              {comment.children && comment.children.length > 0 && (
                <div className="ml-6 md:ml-10 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                  {comment.children.map((elem: any) => (
                    <div
                      key={elem.id}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                    >
                      {!elem.deleted ? (
                        <>
                          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                            {elem.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              {elem.user?.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={elem.user.image}
                                  alt={elem.author}
                                  className="w-5 h-5 rounded-full"
                                />
                              )}
                              <span className="font-medium text-gray-600">{elem.author}</span>
                              {elem.user && (
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded">認証済</span>
                              )}
                              <span className="mx-0.5">·</span>
                              {elem.date}
                            </div>
                            <div className="flex items-center gap-0.5">
                              {renderLikeButton(elem.id, elem.likes || 0, false)}
                              {isOwnComment(elem) && (
                                <button
                                  className="flex items-center text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full px-2 py-1 transition-colors"
                                  onClick={() => handleDelete(elem.id, false)}
                                  aria-label="削除"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-400 italic text-sm">このコメントは削除されました</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {hasMore && (
            <button
              className="w-full py-3 text-center text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-xl transition-colors border border-gray-200 min-h-[44px]"
              onClick={() => setShowAllComments(true)}
            >
              すべてのコメントを表示（{processedComments.length}件）
            </button>
          )}
        </div>
      )}

      {/* 下部CTA */}
      {comments.length >= 3 && !showForm && showAllComments && (
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <button
            className="inline-flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors min-h-[44px] px-4 py-2"
            onClick={() => {
              setShowForm(true);
              setTimeout(() => {
                document.getElementById("comment-input")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 100);
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" />
            コメントを書く
          </button>
        </div>
      )}

      {/* 評価ナッジ */}
      {showRatingNudge && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500 w-3 h-3" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">コメントありがとうございます！</p>
                <p className="text-xs text-gray-500">この作品の評価もお願いできますか？上の星をクリックして評価できます。</p>
              </div>
            </div>
            <button
              className="flex-shrink-0 text-xs font-medium text-yellow-600 hover:text-yellow-700 transition-colors p-2 min-h-[44px] flex items-center"
              onClick={() => {
                setShowRatingNudge(false);
                const ratingSection = document.querySelector(".bg-white.rounded-xl.shadow-sm.px-4.py-4");
                if (ratingSection) {
                  ratingSection.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              評価する
            </button>
            <button
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setShowRatingNudge(false)}
              aria-label="閉じる"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
