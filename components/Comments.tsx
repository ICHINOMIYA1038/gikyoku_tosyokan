import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faTimes, faInfoCircle, faThumbsUp, faTheaterMasks, faCommentDots, faQuestionCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const COMMENT_TYPES = [
  { value: "感想", label: "感想", icon: faCommentDots, color: "blue" },
  { value: "上演報告", label: "上演報告", icon: faTheaterMasks, color: "green" },
  { value: "質問", label: "質問", icon: faQuestionCircle, color: "orange" },
];

const COMMENT_TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "感想": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "上演報告": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "質問": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};

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
    if (!commentType || !COMMENT_TYPE_STYLES[commentType]) return null;
    const style = COMMENT_TYPE_STYLES[commentType];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
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
            ? "text-blue-500 cursor-default"
            : "text-gray-400 hover:text-blue-500"
        }`}
        onClick={() => !isLiked && handleLike(id, isParent)}
        disabled={isLiked}
        aria-label="いいね"
      >
        <FontAwesomeIcon icon={faThumbsUp} className={isLiked ? "text-blue-500" : ""} />
        {likes > 0 && <span className="font-medium">{likes}</span>}
      </button>
    );
  };

  return (
    <div className="comments-section" id="comments-section">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold font-serif text-gray-800">
          コメント
          <span className="ml-2 text-base font-normal text-gray-500">
            {comments.length}件
          </span>
        </h2>
      </div>

      {/* CTA: コメントがない場合 */}
      {comments.length === 0 && !showForm && (
        <div className="text-center py-10 px-4 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100">
          <div className="text-4xl mb-3">🎭</div>
          <p className="text-lg font-bold text-gray-800 mb-2">
            最初の感想を書いてみませんか？
          </p>
          <p className="text-sm text-gray-500 mb-6">
            上演した感想や、読んだ印象など、自由にお書きください
          </p>
          <button
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold transition-all hover:scale-105 shadow-md"
            onClick={() => setShowForm(true)}
          >
            コメントを書く
          </button>
        </div>
      )}

      {/* CTA: コメントがある場合の投稿促進 */}
      {comments.length > 0 && !showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
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
        <div className="bg-white shadow-md rounded-xl p-4 md:p-6 mb-6 border border-gray-100">
          {/* 返信先表示 */}
          {replyTo && (
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg flex justify-between items-center">
              <div className="flex items-center min-w-0">
                <FontAwesomeIcon icon={faReply} className="text-blue-500 mr-2 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-bold text-gray-700">返信先: </span>
                  <span className="text-sm text-gray-600 truncate">
                    {replyTo.author}: {replyTo.content.substring(0, 30)}{replyTo.content.length > 30 ? "..." : ""}
                  </span>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                onClick={cancelReply}
                aria-label="返信をキャンセル"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {/* コメントタイプ選択（返信でない場合のみ） */}
          {!replyTo && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {COMMENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      selectedType === type.value
                        ? `${COMMENT_TYPE_STYLES[type.value].bg} ${COMMENT_TYPE_STYLES[type.value].text} ${COMMENT_TYPE_STYLES[type.value].border} ring-2 ring-offset-1 ring-${type.color}-300`
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                  >
                    <FontAwesomeIcon icon={type.icon} className="text-xs" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 名前入力 */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="名無しさん"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition text-sm"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>

          {/* コメント入力 */}
          <div className="mb-3 relative">
            <textarea
              id="comment-input"
              placeholder={replyTo ? `${replyTo.author}さんに返信...` : "この作品の感想、上演した際の体験談など、自由にお書きください"}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition min-h-[120px] text-sm resize-y"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={MAX_CHARS}
            />
            <div className={`absolute bottom-2 right-3 text-xs ${
              newComment.length > MAX_CHARS * 0.9 ? "text-red-500" : "text-gray-400"
            }`}>
              {newComment.length}/{MAX_CHARS}
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm transition-all ${
                  isSendingComment || !newComment.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700 hover:scale-105 shadow-md"
                }`}
                onClick={handleCommentSubmit}
                disabled={isSendingComment || !newComment.trim()}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                {isSendingComment ? "送信中..." : (replyTo ? "返信を送信" : "コメントを送信")}
              </button>
              <button
                className="px-4 py-2.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-sm transition-colors"
                onClick={() => { setShowForm(false); setReplyTo(null); }}
              >
                キャンセル
              </button>
            </div>

            {commentResult && (
              <p className={`text-sm font-medium ${
                commentResult.includes("失敗") || commentResult.includes("エラー") || commentResult.includes("不正")
                  ? "text-red-500"
                  : "text-green-600"
              }`}>
                {commentResult}
              </p>
            )}
          </div>

          {/* 注意事項 */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="flex items-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
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

      {/* コメントリスト */}
      {comments.length > 0 && (
        <div className="space-y-4">
          {displayedComments.map((comment: any) => (
            <div key={comment.id} className="comment-thread">
              {/* 親コメント */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition">
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
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                      <div className="text-xs text-gray-400">
                        <span className="font-medium text-gray-600">{comment.author}</span>
                        <span className="mx-1.5">·</span>
                        {comment.date}
                      </div>
                      <div className="flex items-center gap-3">
                        {renderLikeButton(comment.id, comment.likes || 0, true)}
                        <button
                          className="flex items-center gap-1 text-sm text-gray-400 hover:text-pink-500 transition-colors"
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
                <div className="ml-6 md:ml-10 mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
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
              className="w-full py-3 text-center text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-xl transition-colors border border-gray-100"
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
