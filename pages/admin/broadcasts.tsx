import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

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
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!confirm(`${optInCount} 人に送信します。よろしいですか？`)) return;
    setSending(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, bodyHtml }),
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
        // 履歴は次のリロードで反映
      }
    } catch (e) {
      setError(`通信エラー: ${(e as Error).message}`);
    }
    setSending(false);
  };

  return (
    <Layout>
      <Seo pageTitle="案内メール一斉送信 (管理)" pageDescription="管理者専用" pagePath="/admin/broadcasts" />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">案内メール一斉送信</h1>
        <p className="mb-6 text-sm text-gray-500">
          配信を許可しているユーザー <span className="font-semibold text-gray-900">{optInCount} 人</span> に送信します。
        </p>

        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">件名 *</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              placeholder="例: 新機能のお知らせ"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">本文 (HTML可) *</label>
            <textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={12}
              placeholder={`<p>こんにちは。</p>\n<p>戯曲図書館に新機能が追加されました。</p>\n<p><a href="https://gikyokutosyokan.com/...">詳しく見る</a></p>`}
              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              各メールの末尾に「配信停止」リンクが自動で付加されます。
            </p>
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {result && (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {result}
            </p>
          )}

          <button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !bodyHtml.trim() || optInCount === 0}
            className="rounded-md bg-pink-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-50"
          >
            {sending ? "送信中..." : `${optInCount} 人に送信`}
          </button>
        </div>

        {/* 履歴 */}
        <h2 className="mt-10 mb-3 text-lg font-semibold text-gray-900">送信履歴</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">まだ送信履歴はありません。</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
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
                    <td className="px-3 py-2 text-xs text-gray-600">
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
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/signin?callbackUrl=/admin/broadcasts", permanent: false } };
  }
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!me || me.role !== "ADMIN") {
    return { notFound: true };
  }

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
