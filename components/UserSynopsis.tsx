import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type UserSynopsisProps = {
  postId: number;
};

type SynopsisEntry = {
  id: number;
  content: string;
  createdAt: string;
  user: { name: string | null; displayName: string | null };
};

const MAX_LENGTH = 500;

const UserSynopsis = ({ postId }: UserSynopsisProps) => {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<SynopsisEntry[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/user-synopsis?postId=${postId}`)
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  }, [postId]);

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/user-synopsis?postId=${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setContent("");
        setHasSubmitted(true);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "送信に失敗しました" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      {/* 承認済みの投稿を表示 */}
      {entries.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-bold text-gray-700">ユーザーによる作品紹介</h3>
          {entries.map((entry) => (
            <div key={entry.id} className="text-sm text-gray-600 leading-relaxed">
              <p>{entry.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                — {entry.user.displayName || entry.user.name || "名無しさん"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 投稿フォーム */}
      {!hasSubmitted && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-bold text-gray-700 mb-2">この作品の紹介文を書く</p>
          {session ? (
            <>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="あらすじや作品の魅力を紹介してください（ネタバレにはご注意ください）"
                maxLength={MAX_LENGTH}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-200 focus:border-theater-primary-400 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{content.length}/{MAX_LENGTH}</span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !content.trim()}
                  className="px-4 py-1.5 bg-theater-primary-600 hover:bg-theater-primary-700 disabled:bg-gray-300 text-white text-xs font-bold rounded transition-colors"
                >
                  {submitting ? "送信中..." : "投稿する"}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">投稿は運営確認後に表示されます</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              <Link href="/auth/signup" className="text-theater-primary-600 hover:underline font-medium">
                ログイン
              </Link>
              すると紹介文を投稿できます
            </p>
          )}
        </div>
      )}

      {/* メッセージ */}
      {message && (
        <p className={`text-xs mt-2 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default UserSynopsis;
