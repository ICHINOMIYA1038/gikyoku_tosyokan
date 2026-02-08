import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faTimes, faInfoCircle, faThumbsUp, faTheaterMasks, faCommentDots, faQuestionCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const COMMENT_TYPES = [
  { value: "感想", label: "感想", icon: faCommentDots, bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" },
  { value: "上演報告", label: "上演報告", icon: faTheaterMasks, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { value: "質問", label: "質問", icon: faQuestionCircle, bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
];

const MAX_CHARS = 500;
const INITIAL_DISPLAY_COUNT = 3;

const Comments = ({ comments: initialComments, postid, inline = false }: any) => {
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

  // localStorageからいいね済みコメントを復元
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`liked_comments_${postid}`);
      if (stored) {
        setLikedComments(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, [postid]);

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
    if (newComment.length > MAX_CHARS) return;

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

  const displayedComments = inline && !showAllComments
    ? comments.slice(0, INITIAL_DISPLAY_COUNT)
    : comments;
  const hasMore = inline && !showAllComments && comments.length > INITIAL_DISPLAY_COUNT;

  const renderCommentTypeTag = (commentType: string | null) => {
    if (!commentType) return null;
    const typeConfig = COMMENT_TYPES.find(t => t.value === commentType);
    if (!typeConfig) return null;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
        <FontAwesomeIcon icon={typeConfig.icon} className="text-[10px]" />
        {commentType}
      </span>
    );
  };

  const renderLikeButton = (id: number, likes: number, isParent: boolean) => {
    const key = `${isParent ? "p" : "c"}_${id}`;
    const isLiked = likedComments.has(key);
    return (
      <button
        className={`flex items-center gap-1 text-sm transition-colors ${
          isLiked
            ? "text-pink-600 cursor-default"
            : "text-gray-400 hover:text-pink-600"
        }`}
        onClick={() => !isLiked && handleLike(id, isParent)}
        disabled={isLiked}
        aria-label="いいね"
      >
        <FontAwesomeIcon icon={faThumbsUp} className={isLiked ? "text-pink-600" : ""} />
        {likes > 0 && <span className="font-medium">{likes}</span>}
      </button>
    );
  };

  return (
    <div className="comments-section" id="comments-section">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-pink-600 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-gray-800">
            みんなの声
          </h2>
          {comments.length > 0 && (
            <span className="bg-pink-600 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
              {comments.length}
            </span>
          )}
        </div>
      </div>

      {/* CTA: コメントがない場合 */}
      {comments.length === 0 && !showForm && (
        <div className="text-center py-6 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-white">
          <p className="text-sm font-bold text-gray-700 mb-1">
            最初の感想を書いてみませんか？
          </p>
          <p className="text-xs text-gray-500 mb-4">
            上演した感想や、読んだ印象など
          </p>
          <button
            className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold text-sm transition-all"
            onClick={() => setShowForm(true)}
          >
            コメントを書く
          </button>
        </div>
      )}

      {/* CTA: コメントがある場合の投稿促進 */}
      {comments.length > 0 && !showForm && (
        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            この作品を上演したことがありますか？感想を共有しましょう
          </p>
          <button
            className="ml-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold text-sm transition-all hover:scale-105 whitespace-nowrap"
            onClick={() => setShowForm(true)}
          >
            書く
          </button>
        </div>
      )}

      {/* コメント入力フォーム */}
      {showForm && (
        <div className="bg-white rounded-xl p-3 md:p-4 mb-4 border border-gray-200">
          {/* 返信先表示 */}
          {replyTo && (
            <div className="mb-3 px-3 py-2 bg-gray-50 border-l-3 border-gray-400 rounded-r-lg flex justify-between items-center text-sm">
              <span className="text-gray-600 truncate">
                <span className="font-bold text-gray-700">返信: </span>
                {replyTo.author}: {replyTo.content.substring(0, 30)}{replyTo.content.length > 30 ? "..." : ""}
              </span>
              <button
                className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0 w-4 h-4"
                onClick={cancelReply}
              >
                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* コメントタイプ選択 + 名前入力を横並び */}
          {!replyTo && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {COMMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all border whitespace-nowrap ${
                    selectedType === type.value
                      ? `${type.bg} ${type.text} ${type.border} ring-1 ring-offset-1 ring-gray-300`
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                >
                  <FontAwesomeIcon icon={type.icon} className="w-3 h-3" />
                  {type.label}
                </button>
              ))}
            </div>
          )}

          {/* 名前入力 */}
          <input
            type="text"
            placeholder="名無しさん"
            className="w-full px-3 py-2 mb-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />

          {/* コメント入力 */}
          <div className="relative mb-2">
            <textarea
              id="comment-input"
              placeholder={replyTo ? `${replyTo.author}さんに返信...` : "感想や体験談など自由にお書きください"}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 min-h-[80px] text-sm resize-y"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={MAX_CHARS}
            />
            <div className={`absolute bottom-1.5 right-2 text-[10px] ${
              newComment.length > MAX_CHARS * 0.9 ? "text-red-500" : "text-gray-400"
            }`}>
              {newComment.length}/{MAX_CHARS}
            </div>
          </div>

          {/* 送信・キャンセル・結果 */}
          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-1.5 rounded-full text-white font-bold text-xs transition-all ${
                isSendingComment || !newComment.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
              onClick={handleCommentSubmit}
              disabled={isSendingComment || !newComment.trim()}
            >
              {isSendingComment ? "送信中..." : (replyTo ? "返信" : "送信")}
            </button>
            <button
              className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-xs transition-colors"
              onClick={() => { setShowForm(false); setReplyTo(null); }}
            >
              キャンセル
            </button>
            {commentResult && (
              <span className={`text-xs ${
                commentResult.includes("失敗") || commentResult.includes("エラー") || commentResult.includes("不正")
                  ? "text-red-500" : "text-green-600"
              }`}>{commentResult}</span>
            )}
          </div>

          {/* 注意事項（折りたたみ） */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="text-[10px] text-gray-400 hover:text-gray-600"
            >
              注意事項 {showGuidelines ? "▲" : "▼"}
            </button>
            {showGuidelines && (
              <div className="mt-1 p-2 bg-gray-50 rounded text-[10px] text-gray-500 leading-relaxed">
                誹謗中傷・なりすまし・スパム・個人情報の投稿は禁止です。削除希望はお問い合わせフォームへ。
              </div>
            )}
          </div>
        </div>
      )}

      {/* コメントリスト */}
      {comments.length > 0 && (
        <div className="space-y-4">
          {displayedComments.map((comment: any) => (
            <div key={comment.id} className="comment-thread">
              {/* 親コメント */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition">
                {!comment.deleted ? (
                  <>
                    {/* タイプタグ */}
                    {comment.commentType && (
                      <div className="mb-2">
                        {renderCommentTypeTag(comment.commentType)}
                      </div>
                    )}
                    {/* コメント本文 */}
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    {/* フッター */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-400">
                        <span className="font-medium text-gray-600">{comment.author}</span>
                        <span className="mx-1.5">·</span>
                        {comment.date}
                      </div>
                      <div className="flex items-center gap-3">
                        {renderLikeButton(comment.id, comment.likes || 0, true)}
                        <button
                          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                          onClick={() => handleReplyClick(comment)}
                        >
                          <FontAwesomeIcon icon={faReply} className="text-xs" />
                          <span className="text-xs">返信</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 italic text-sm">このコメントは削除されました</div>
                )}
              </div>

              {/* 子コメント */}
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
                            <div className="text-xs text-gray-400">
                              <span className="font-medium text-gray-600">{elem.author}</span>
                              <span className="mx-1.5">·</span>
                              {elem.date}
                            </div>
                            {renderLikeButton(elem.id, elem.likes || 0, false)}
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

          {/* もっと見る */}
          {hasMore && (
            <button
              className="w-full py-3 text-center text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
              onClick={() => setShowAllComments(true)}
            >
              すべてのコメントを表示（{comments.length}件）
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
