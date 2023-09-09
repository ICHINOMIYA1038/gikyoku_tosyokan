import React, { useState } from "react";

function CommentForm({ onCommentSubmit }: any) {
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          投稿
        </button>
      </form>
    </div>
  );
}

export default CommentForm;
