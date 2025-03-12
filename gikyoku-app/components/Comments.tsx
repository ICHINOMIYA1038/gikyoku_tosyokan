import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const Comments = ({ comments: initialComments, postid }: any) => {
  const [comments, setComments] = useState(initialComments);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [commentResult, setCommentResult] = useState(""); // 送信結果メッセージ
  const [newComment, setNewComment] = useState(""); // 新しいコメントの内容
  const [authorName, setAuthorName] = useState(""); // 投稿者名
  const [replyTo, setReplyTo] = useState<any>(null); // 返信先のコメント
  const [showGuidelines, setShowGuidelines] = useState(false); // 注意事項の表示状態

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !authorName.trim()) return; // 空のコメントや投稿者名は送信しない

    setIsSendingComment(true); // 送信中
    setCommentResult(""); // メッセージをクリア
    try {
      const response = await fetch("/api/createComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: authorName,
          content: newComment,
          isParent: replyTo ? false : true,
          targetid: replyTo ? replyTo.id : postid,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        console.log("新しいコメントデータ:", newCommentData);

        // 新しいコメントデータが期待通りの形式であることを確認
        if (newCommentData && newCommentData.content && newCommentData.author) {
          if (replyTo) {
            // 返信の場合、親コメントの子コメントとして追加
            setComments((prevComments: any) =>
              prevComments.map((comment: any) =>
                comment.id === replyTo.id
                  ? {
                    ...comment,
                    children: [...(comment.children || []), newCommentData]
                  }
                  : comment
              )
            );
          } else {
            // 通常のコメントの場合
            setComments((prevComments: any) => [...prevComments, newCommentData]); // 新しいコメントを追加
          }
          setCommentResult("コメントが投稿されました"); // 成功メッセージを設定
          setNewComment(""); // コメントフィールドをクリア
          setReplyTo(null); // 返信先をリセット
        } else {
          setCommentResult("コメントのデータが不正です"); // データが不正な場合のメッセージ
        }
      } else {
        setCommentResult("コメントの投稿に失敗しました"); // 失敗メッセージを設定
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
      setCommentResult("エラーが発生しました"); // エラーメッセージを設定
    }
    setIsSendingComment(false); // 送信完了
  };

  // 返信ボタンをクリックしたときの処理
  const handleReplyClick = (comment: any) => {
    setReplyTo(comment);
    // 入力欄にフォーカスを当てる
    document.getElementById('comment-input')?.focus();
  };

  // 返信をキャンセルする処理
  const cancelReply = () => {
    setReplyTo(null);
  };

  return (
    <div className="comments-container">
      <h3 className="text-xl font-bold mb-4 px-2">
        {comments.length}件のコメント
      </h3>

      {/* コメント入力エリア */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        {replyTo && (
          <div className="mb-3 p-2 bg-blue-50 border-l-4 border-blue-500 rounded flex justify-between items-center">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faReply} className="text-blue-500 mr-2" />
              <div>
                <span className="text-sm font-bold text-gray-700">返信先: </span>
                <span className="text-sm text-gray-600">{replyTo.author}: {replyTo.content.substring(0, 30)}{replyTo.content.length > 30 ? "..." : ""}</span>
              </div>
            </div>
            <button
              className="text-gray-500 hover:text-red-500 transition-colors"
              onClick={cancelReply}
              aria-label="返信をキャンセル"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        <div className="mb-3">
          <input
            type="text"
            placeholder="名前を入力..."
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <textarea
            id="comment-input"
            placeholder={replyTo ? `${replyTo.author}さんに返信...` : "コメントを入力..."}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[100px]"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${isSendingComment
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
              }`}
            onClick={handleCommentSubmit}
            disabled={isSendingComment}
          >
            {isSendingComment ? "送信中..." : (replyTo ? "返信を送信" : "コメントを送信")}
          </button>

          {commentResult && (
            <p className={`text-sm ${commentResult.includes("失敗") || commentResult.includes("エラー") || commentResult.includes("不正")
              ? "text-red-500"
              : "text-green-500"
              }`}>
              {commentResult}
            </p>
          )}
        </div>

        {/* コメント注意事項 */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="flex items-center text-sm text-gray-600 hover:text-blue-500 transition-colors"
          >
            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
            コメント投稿時の注意事項 {showGuidelines ? '▲' : '▼'}
          </button>

          {showGuidelines && (
            <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 border-l-4 border-yellow-400">
              <h4 className="font-bold text-red-600 mb-2">※コメント投稿時の注意事項</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>誹謗中傷、他人へのなりすましの禁止</li>
                <li>本記事と関係のない投稿、事実に反する投稿の禁止</li>
                <li>重複投稿やスパム行為の禁止</li>
                <li>個人情報を含む投稿の禁止</li>
                <li>一度行った投稿は消せません。削除を希望される場合はお問い合わせフォームよりご連絡ください。</li>
              </ul>
              <p className="mt-2">
                <span className="font-medium">面白かった！上演します！上演しました！</span>
                などご自由にお書きください。公演の宣伝の投稿も大歓迎です！自由に交流していただけますと幸いです！
              </p>
            </div>
          )}
        </div>
      </div>

      {/* コメントリスト */}
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="comment-thread">
            {/* 親コメント */}
            <div className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition">
              {!comment.deleted ? (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-grow">
                      <p className="text-gray-800">{comment.content}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">{comment.author}</span> • {comment.date}
                    </div>
                    <button
                      className="text-blue-500 hover:text-blue-700 text-sm flex items-center transition-colors"
                      onClick={() => handleReplyClick(comment)}
                    >
                      <FontAwesomeIcon icon={faReply} className="mr-1" />
                      <span>返信</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 italic">このコメントは削除されました。</div>
              )}
            </div>

            {/* 子コメント */}
            {comment.children && comment.children.length > 0 && (
              <div className="ml-8 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                {comment.children.map((elem: any) => (
                  <div
                    key={elem.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <p className="text-gray-800">{elem.content}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      <span className="font-medium text-gray-700">{elem.author}</span> • {elem.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          まだコメントはありません。最初のコメントを投稿しましょう！
        </div>
      )}
    </div>
  );
};

export default Comments;
