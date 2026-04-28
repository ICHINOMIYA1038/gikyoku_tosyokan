import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import Link from "next/link";

type SynopsisEntry = {
  id: number;
  content: string;
  status: string;
  createdAt: string;
  post: { id: number; title: string };
  user: { name: string | null; displayName: string | null; email: string | null };
};

export default function AdminSynopsis() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<SynopsisEntry[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);

  const fetchEntries = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/synopsis?status=${status}`);
      if (res.ok) {
        setEntries(await res.json());
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries(filter);
  }, [filter]);

  const handleAction = async (id: number, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/synopsis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {}
  };

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <Layout>
        <div className="p-8 text-center text-gray-500">管理者権限が必要です</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo pageTitle="概要投稿管理" noindex={true} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">ユーザー概要投稿の管理</h1>

        {/* フィルタータブ */}
        <div className="flex gap-0 border-b border-gray-200 mb-6">
          {(["pending", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-sm font-bold transition-colors relative
                ${filter === s ? "text-theater-primary-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              {{ pending: "未確認", approved: "承認済み", rejected: "却下" }[s]}
              {filter === s && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-theater-primary-500" />}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">読み込み中...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-400 text-sm">
            {{ pending: "未確認の投稿はありません", approved: "承認済みの投稿はありません", rejected: "却下した投稿はありません" }[filter]}
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                {/* ヘッダー */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <Link href={`/posts/${entry.post.id}`} className="font-bold text-sm text-theater-primary-600 hover:underline">
                      {entry.post.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {entry.user.displayName || entry.user.name || "名無し"} ({entry.user.email})
                      · {new Date(entry.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                </div>

                {/* 本文 */}
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded p-3 mb-3">
                  {entry.content}
                </p>

                {/* アクションボタン */}
                {filter === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(entry.id, "approved")}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors"
                    >
                      承認
                    </button>
                    <button
                      onClick={() => handleAction(entry.id, "rejected")}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded transition-colors"
                    >
                      却下
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
