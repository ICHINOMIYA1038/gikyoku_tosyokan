import React, { useState } from "react";

function CommentForm({
  onCommentSubmit,
  commentResult,
  isSendingComment,
}: any) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [authorError, setAuthorError] = useState("");
  const [contentError, setContentError] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("注意事項に同意してください。");
      return;
    }

    if (author.length > 20) {
      setAuthorError("投稿者名は20文字以内で入力してください");
      return;
    }
    if (content.length > 200) {
      setContentError("内容は200文字以内で入力してください");
      return;
    }

    setAuthorError("");
    setContentError("");
    onCommentSubmit({ author, content });
    setAuthor("");
    setContent("");
    setAgreedToTerms(false);
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
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              authorError ? "border-red-500" : ""
            }`}
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              if (e.target.value.length > 20) {
                setAuthorError("投稿者名は20文字以内で入力してください");
              } else {
                setAuthorError("");
              }
            }}
            required
          />
          {authorError && (
            <p className="text-red-500 text-xs italic">{authorError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            内容:
          </label>
          <textarea
            className={`border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              contentError ? "border-red-500" : ""
            }`}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value.length > 200) {
                setContentError("内容は200文字以内で入力してください");
              } else {
                setContentError("");
              }
            }}
            required
          />
          {contentError && (
            <p className="text-red-500 text-xs italic">{contentError}</p>
          )}
        </div>
        <div className="mb-4">
          <p className="text-red-500 text-sm">
            注意事項:
            <ul className="list-disc ml-5">
              <li>個人情報、誹謗中傷、他人へのなりすましの禁止</li>
              <li>本記事と関係のない投稿、事実に反する投稿の禁止</li>
              <li>重複投稿やスパム行為の禁止</li>
              <li>一度行った投稿は削除できません。</li>
            </ul>
          </p>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            className="mr-2 h-6 w-6 text-blue-500 rounded focus:outline-none focus:shadow-outline"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <label className="text-gray-700 text-sm font-bold">
            注意事項に同意する
          </label>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={
              isSendingComment || authorError || contentError || !agreedToTerms
            }
          >
            {isSendingComment ? "送信中..." : "投稿"}
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
