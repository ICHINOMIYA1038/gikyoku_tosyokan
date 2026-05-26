import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Candidate = {
  id: string;
  email: string | null;
  displayName: string | null;
  name: string | null;
  groupName: string | null;
};

type BroadcastRow = {
  id: string;
  subject: string;
  recipientCount: number;
  succeededCount: number;
  failedCount: number;
  status: string;
  createdAt: string;
};

type Props = {
  optInCount: number;
  history: BroadcastRow[];
};

export default function AdminBroadcasts({ optInCount, history }: Props) {
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [mode, setMode] = useState<"all" | "selected">("all");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateQuery, setCandidateQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 個別選択モードに入った時 / 検索クエリ変更時に候補をロード
  useEffect(() => {
    if (mode !== "selected") return;
    let cancelled = false;
    setLoadingCandidates(true);
    const t = setTimeout(async () => {
      try {
        const url = `/api/_ops/q3k7n2p8/broadcast-recipients?q=${encodeURIComponent(candidateQuery)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCandidates(data.users);
      } finally {
        if (!cancelled) setLoadingCandidates(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [mode, candidateQuery]);

  const recipientCount = mode === "selected" ? selectedIds.size : optInCount;

  const toggleId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      candidates.forEach((c) => next.add(c.id));
      return next;
    });
  };
  const clearSelected = () => setSelectedIds(new Set());

  const handleSend = async () => {
    if (recipientCount === 0) return;
    if (!confirm(`${recipientCount} 人に送信します。よろしいですか？`)) return;
    setSending(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/_ops/q3k7n2p8/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          bodyHtml,
          mode,
          userIds: mode === "selected" ? Array.from(selectedIds) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "送信に失敗しました");
      } else {
        setResult(
          `送信完了 ✓ 成功 ${data.broadcast.succeededCount} / 失敗 ${data.broadcast.failedCount}`
        );
        setSubject("");
        setBodyHtml("");
        setSelectedIds(new Set());
      }
    } catch (e) {
      setError(`通信エラー: ${(e as Error).message}`);
    }
    setSending(false);
  };

  return (
    <AdminLayout title="案内メール">
      <p className="mb-4 text-xs text-gray-500">
        配信を許可しているユーザー <strong className="text-gray-900">{optInCount}</strong> 人が送信対象候補です。
      </p>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
        {/* 送信先モード */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">送信先</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("all")}
              className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                mode === "all"
                  ? "border-rose-400 bg-rose-50 text-rose-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              全配信許可ユーザー ({optInCount})
            </button>
            <button
              type="button"
              onClick={() => setMode("selected")}
              className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                mode === "selected"
                  ? "border-rose-400 bg-rose-50 text-rose-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              個別に選ぶ {mode === "selected" && `(${selectedIds.size})`}
            </button>
          </div>

          {mode === "selected" && (
            <div className="mt-3 space-y-2 rounded-md border border-gray-200 bg-gray-50/50 p-3">
              <div className="flex flex-wrap gap-2">
                <input
                  value={candidateQuery}
                  onChange={(e) => setCandidateQuery(e.target.value)}
                  placeholder="メール / 表示名 / 所属で絞り込み"
                  className="flex-1 min-w-[200px] rounded-md border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
                <button
                  type="button"
                  onClick={selectAllVisible}
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  表示中を全選択
                </button>
                <button
                  type="button"
                  onClick={clearSelected}
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  選択解除
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                配信OFFのユーザーは候補に含まれません。
                {loadingCandidates && " 読み込み中..."}
              </p>
              <div className="max-h-72 overflow-y-auto rounded-md border border-gray-200 bg-white">
                {candidates.length === 0 ? (
                  <p className="px-3 py-6 text-center text-xs text-gray-400">
                    {loadingCandidates ? "..." : "該当するユーザーがいません"}
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {candidates.map((c) => {
                      const checked = selectedIds.has(c.id);
                      return (
                        <li key={c.id}>
                          <label className="flex cursor-pointer items-start gap-2 px-3 py-2 hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleId(c.id)}
                              className="mt-0.5 h-3.5 w-3.5"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-gray-900">
                                {c.displayName || c.name || "—"}
                              </p>
                              <p className="truncate text-[11px] text-gray-500">
                                {c.email}
                                {c.groupName && ` / ${c.groupName}`}
                              </p>
                            </div>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">件名 *</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
            placeholder="例: 新機能のお知らせ"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">本文 (HTML可) *</label>
          <textarea
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            rows={12}
            placeholder={`<p>こんにちは。</p>\n<p>戯曲図書館に新機能が追加されました。</p>\n<p><a href="https://gikyokutosyokan.com/...">詳しく見る</a></p>`}
            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          <p className="mt-1 text-[11px] text-gray-500">
            各メールの末尾に「配信停止」リンクが自動で付加されます。
          </p>
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {result && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{result}</p>
        )}

        <button
          onClick={handleSend}
          disabled={sending || !subject.trim() || !bodyHtml.trim() || recipientCount === 0}
          className="rounded-md bg-rose-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
        >
          {sending ? "送信中..." : `${recipientCount} 人に送信`}
        </button>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold text-gray-700">送信履歴</h2>
      {history.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
          まだ送信履歴はありません。
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 text-left">日時</th>
                <th className="px-3 py-2 text-left">件名</th>
                <th className="px-3 py-2 text-right">対象</th>
                <th className="px-3 py-2 text-right">成功 / 失敗</th>
                <th className="px-3 py-2 text-left">状態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((b) => (
                <tr key={b.id}>
                  <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">
                    {new Date(b.createdAt).toLocaleString("ja-JP", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="px-3 py-2 max-w-xs truncate">{b.subject}</td>
                  <td className="px-3 py-2 text-right">{b.recipientCount}</td>
                  <td className="px-3 py-2 text-right">
                    <span className="text-emerald-700">{b.succeededCount}</span> / <span className="text-red-700">{b.failedCount}</span>
                  </td>
                  <td className="px-3 py-2 text-xs">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const guard = await requireAdminPage(ctx);
  if ("redirect" in guard) return { redirect: guard.redirect };
  if ("notFound" in guard) return { notFound: true };

  const [optInCount, history] = await Promise.all([
    prisma.user.count({ where: { emailOptIn: true, email: { not: null } } }),
    prisma.broadcast.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        subject: true,
        recipientCount: true,
        succeededCount: true,
        failedCount: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    props: {
      optInCount,
      history: history.map((h) => ({
        ...h,
        createdAt: h.createdAt.toISOString(),
      })),
    },
  };
};
