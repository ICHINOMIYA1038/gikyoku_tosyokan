import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Row = {
  id: number;
  reason: string;
  details: string | null;
  targetType: string;
  targetId: string;
  targetUrl: string | null;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
  reporterEmail: string | null;
};

type Props = {
  rows: Row[];
  pending: number;
  total: number;
  filter: { status: string };
};

export default function AdminReports({ rows, pending, total, filter }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  const resolve = async (id: number, next: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/_ops/q3k7n2p8/reports/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
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
    <AdminLayout title="通報">
      <p className="mb-4 text-xs text-gray-500">
        未対応 <strong className="text-rose-600">{pending}</strong> 件 / 全 <strong className="text-gray-900">{total}</strong> 件
      </p>

      <form className="mb-4 flex gap-2 rounded-lg border border-gray-200 bg-white p-3">
        <select name="status" defaultValue={filter.status} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
          <option value="">すべて</option>
          <option value="PENDING">未対応のみ</option>
          <option value="RESOLVED">対応済み</option>
          <option value="DISMISSED">却下</option>
        </select>
        <button type="submit" className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800">
          絞り込む
        </button>
        <Link href="?" className="rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          リセット
        </Link>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
          該当する通報はありません。
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <ul className="divide-y divide-gray-100">
            {rows.map((r) => (
              <li key={r.id} className="flex items-start gap-3 px-4 py-3">
                <StatusBadge status={r.status} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{r.reason}</p>
                  {r.details && <p className="mt-0.5 text-xs text-gray-600 whitespace-pre-wrap">{r.details}</p>}
                  <p className="mt-1 text-[11px] text-gray-500">
                    対象: {r.targetType} ({r.targetId})
                    {r.targetUrl && (
                      <>
                        {" / "}
                        <a href={r.targetUrl} target="_blank" rel="noreferrer" className="text-rose-600 underline">
                          開く
                        </a>
                      </>
                    )}
                    {" / "}
                    通報者: {r.reporterEmail || "—"}
                    {" / "}
                    {new Date(r.createdAt).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {r.status === "PENDING" ? (
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      onClick={() => resolve(r.id, "RESOLVED")}
                      disabled={busy === r.id}
                      className="rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      対応済み
                    </button>
                    <button
                      onClick={() => resolve(r.id, "DISMISSED")}
                      disabled={busy === r.id}
                      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      却下
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => resolve(r.id, "PENDING")}
                    disabled={busy === r.id}
                    className="shrink-0 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    再オープン
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-rose-50 text-rose-700 ring-rose-200",
    RESOLVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    DISMISSED: "bg-gray-100 text-gray-500 ring-gray-200",
  };
  return (
    <span className={`mt-0.5 inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${map[status] || map.PENDING}`}>
      {status}
    </span>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const guard = await requireAdminPage(ctx);
  if ("redirect" in guard) return { redirect: guard.redirect };
  if ("notFound" in guard) return { notFound: true };

  const status = typeof ctx.query.status === "string" ? ctx.query.status : "";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [reports, pending, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
      include: { reporter: { select: { email: true } } },
    }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.report.count(),
  ]);

  return {
    props: {
      rows: reports.map((r) => ({
        id: r.id,
        reason: r.reason,
        details: r.details,
        targetType: r.targetType,
        targetId: r.targetId,
        targetUrl: r.targetUrl,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        resolvedAt: r.resolvedAt?.toISOString() ?? null,
        reporterEmail: r.reporter?.email ?? null,
      })),
      pending,
      total,
      filter: { status },
    },
  };
};
