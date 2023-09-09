import React, { useState } from "react";

function CommentForm({
  onCommentSubmit,
  commentResult,
  isSendingComment,
}: any) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onCommentSubmit({ author, content });
    setAuthor("");
    setContent("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            投稿者名:
          </label>
          <input
            type="text"
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            内容:
          </label>
          <textarea
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSendingComment} // 送信中の場合はボタンを無効化
          >
            {isSendingComment ? "送信中..." : "投稿"}{" "}
            {/* 送信中の場合、ボタンラベルを変更 */}
          </button>
        </div>
        {commentResult && (
          <div
            className={`text-md ${
              commentResult === "コメントが投稿されました"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {commentResult}
          </div>
        )}
      </form>
    </div>
  );
}

export default CommentForm;
