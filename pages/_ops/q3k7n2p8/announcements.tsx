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
};
type Props = { rows: Row[]; total: number; filter: { show: string } };

export default function AdminAnnouncements({ rows, total, filter }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

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

  return (
    <AdminLayout title="上演告知">
      <p className="mb-4 text-xs text-gray-500">全 <strong className="text-gray-900">{total}</strong> 件</p>

      <form className="mb-4 flex gap-2 rounded-lg border border-gray-200 bg-white p-3">
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
                  <p className={`text-sm ${r.deletedAt ? "text-gray-400 line-through" : "font-medium text-gray-900"}`}>
                    {r.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {r.authorName}
                    {r.userEmail && ` (${r.userEmail})`}
                    {r.performanceDate && ` / 公演日: ${new Date(r.performanceDate).toLocaleDateString("ja-JP")}`}
                    {` / 閲覧 ${r.views}`}
                    {` / ${new Date(r.createdAt).toLocaleDateString("ja-JP")}`}
                  </p>
                </div>
                <a href={`/announcements/${r.id}`} target="_blank" rel="noreferrer" className="shrink-0 text-xs text-rose-600 hover:underline">
                  確認
                </a>
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
  const where: Record<string, unknown> =
    show === "deleted" ? { deletedAt: { not: null } } : show === "all" ? {} : { deletedAt: null };

  const [list, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { user: { select: { email: true } } },
    }),
    prisma.announcement.count(),
  ]);

  return {
    props: {
      total,
      filter: { show },
      rows: list.map((a) => ({
        id: a.id,
        title: a.title,
        authorName: a.authorName,
        userEmail: a.user?.email ?? null,
        performanceDate: a.performanceDate?.toISOString() ?? null,
        views: a.views,
        createdAt: a.createdAt.toISOString(),
        deletedAt: a.deletedAt?.toISOString() ?? null,
      })),
    },
  };
};
