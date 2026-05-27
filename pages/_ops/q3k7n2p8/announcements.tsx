import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Row = {
  id: number;
  title: string;
  authorName: string;
  userEmail: string | null;
  performanceDate: string | null;
  views: number;
  createdAt: string;
  deletedAt: string | null;
  status: string;
  rejectionReason: string | null;
};
type Props = {
  rows: Row[];
  total: number;
  pendingCount: number;
  filter: { show: string; status: string };
};

export default function AdminAnnouncements({ rows, total, pendingCount, filter }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  const review = async (id: number, action: "approve" | "reject") => {
    let reason: string | null = null;
    if (action === "reject") {
      reason = window.prompt("却下理由（任意・本人には表示しません）") || null;
    }
    setBusy(id);
    try {
      const res = await fetch(`/api/_ops/q3k7n2p8/announcements/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, reason }),
      });
      if (!res.ok) {
        alert("操作に失敗しました");
        return;
      }
      router.replace(router.asPath);
    } finally {
      setBusy(null);
    }
  };

  const toggle = async (id: number, deleted: boolean) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/_ops/q3k7n2p8/announcements/toggle-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, deleted }),
      });
      if (!res.ok) {
        alert("操作に失敗しました");
        return;
      }
      router.replace(router.asPath);
    } finally {
      setBusy(null);
    }
  };

  const statusBadge = (s: string) => {
    if (s === "pending") return <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">審査待ち</span>;
    if (s === "rejected") return <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">却下</span>;
    return <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">公開中</span>;
  };

  return (
    <AdminLayout title="上演告知">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">全 <strong className="text-gray-900">{total}</strong> 件</p>
        {pendingCount > 0 && (
          <Link href="?status=pending" className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600">
            審査待ち {pendingCount} 件
          </Link>
        )}
      </div>

      <form className="mb-4 flex gap-2 rounded-lg border border-gray-200 bg-white p-3">
        <select name="status" defaultValue={filter.status} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
          <option value="">ステータス: すべて</option>
          <option value="pending">審査待ち</option>
          <option value="approved">公開中</option>
          <option value="rejected">却下</option>
        </select>
        <select name="show" defaultValue={filter.show} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
          <option value="">表示中のみ</option>
          <option value="deleted">削除済み</option>
          <option value="all">すべて</option>
        </select>
        <button type="submit" className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800">絞り込む</button>
        <Link href="?" className="rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50">リセット</Link>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">該当なし</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <ul className="divide-y divide-gray-100">
            {rows.map((r) => (
              <li key={r.id} className={`flex items-start gap-3 px-4 py-3 ${r.deletedAt ? "bg-gray-50" : ""}`}>
                <div className="min-w-0 flex-1">
                  <p className={`flex items-center gap-2 text-sm ${r.deletedAt ? "text-gray-400 line-through" : "font-medium text-gray-900"}`}>
                    {statusBadge(r.status)}
                    <span className="truncate">{r.title}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {r.authorName}
                    {r.userEmail && ` (${r.userEmail})`}
                    {r.performanceDate && ` / 公演日: ${new Date(r.performanceDate).toLocaleDateString("ja-JP")}`}
                    {` / 閲覧 ${r.views}`}
                    {` / ${new Date(r.createdAt).toLocaleDateString("ja-JP")}`}
                  </p>
                  {r.rejectionReason && (
                    <p className="mt-1 text-[11px] text-rose-600">却下理由: {r.rejectionReason}</p>
                  )}
                </div>
                <a href={`/announcements/${r.id}`} target="_blank" rel="noreferrer" className="shrink-0 self-center text-xs text-blue-600 hover:underline">
                  確認
                </a>
                {r.status === "pending" && !r.deletedAt && (
                  <>
                    <button
                      onClick={() => review(r.id, "approve")}
                      disabled={busy === r.id}
                      className="shrink-0 rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      承認
                    </button>
                    <button
                      onClick={() => review(r.id, "reject")}
                      disabled={busy === r.id}
                      className="shrink-0 rounded-md border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                    >
                      却下
                    </button>
                  </>
                )}
                <button
                  onClick={() => toggle(r.id, !r.deletedAt)}
                  disabled={busy === r.id}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
                    r.deletedAt
                      ? "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                      : "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                  } disabled:opacity-50`}
                >
                  {busy === r.id ? "..." : r.deletedAt ? "復元" : "削除"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const guard = await requireAdminPage(ctx);
  if ("redirect" in guard) return { redirect: guard.redirect };
  if ("notFound" in guard) return { notFound: true };

  const show = typeof ctx.query.show === "string" ? ctx.query.show : "";
  const status = typeof ctx.query.status === "string" ? ctx.query.status : "";
  const where: Record<string, unknown> = {};
  if (show === "deleted") where.deletedAt = { not: null };
  else if (show !== "all") where.deletedAt = null;
  if (status) where.status = status;

  const [list, total, pendingCount] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
      include: { user: { select: { email: true } } },
    }),
    prisma.announcement.count(),
    prisma.announcement.count({ where: { status: "pending", deletedAt: null } }),
  ]);

  return {
    props: {
      total,
      pendingCount,
      filter: { show, status },
      rows: list.map((a) => ({
        id: a.id,
        title: a.title,
        authorName: a.authorName,
        userEmail: a.user?.email ?? null,
        performanceDate: a.performanceDate?.toISOString() ?? null,
        views: a.views,
        createdAt: a.createdAt.toISOString(),
        deletedAt: a.deletedAt?.toISOString() ?? null,
        status: a.status,
        rejectionReason: a.rejectionReason,
      })),
    },
  };
};
