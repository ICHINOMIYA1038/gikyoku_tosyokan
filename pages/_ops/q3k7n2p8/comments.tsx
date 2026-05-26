import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Row = {
  type: "parent" | "child";
  id: number;
  content: string;
  author: string;
  userId: string | null;
  userEmail: string | null;
  date: string;
  postId?: number | null;
  postTitle?: string | null;
  parentId?: number | null;
  deleted: boolean;
};

type Props = {
  rows: Row[];
  total: number;
  filter: { q: string; show: string };
};

export default function AdminComments({ rows, total, filter }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (row: Row) => {
    const key = `${row.type}-${row.id}`;
    setBusy(key);
    try {
      const res = await fetch(`/api/_ops/q3k7n2p8/comments/toggle-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: row.type, id: row.id, deleted: !row.deleted }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "操作に失敗しました");
        return;
      }
      router.replace(router.asPath);
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminLayout title="コメント">
      <p className="mb-4 text-xs text-gray-500">
        親/子コメントを統合表示。全 <strong className="text-gray-900">{total}</strong> 件。
      </p>

      <form className="mb-4 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-3">
        <input
          name="q"
          defaultValue={filter.q}
          placeholder="本文 / 投稿者で検索"
          className="flex-1 min-w-[180px] rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        <select name="show" defaultValue={filter.show} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
          <option value="">表示中のみ</option>
          <option value="deleted">削除済みのみ</option>
          <option value="all">すべて</option>
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
          コメントがありません。
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <ul className="divide-y divide-gray-100">
            {rows.map((r) => {
              const key = `${r.type}-${r.id}`;
              return (
                <li key={key} className={`flex items-start gap-3 px-4 py-3 ${r.deleted ? "bg-gray-50" : ""}`}>
                  <span
                    className={`mt-0.5 inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      r.type === "parent" ? "bg-sky-50 text-sky-700" : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {r.type === "parent" ? "親" : "子"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${r.deleted ? "text-gray-400 line-through" : "text-gray-900"}`}>
                      {r.content}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500">
                      {r.author}
                      {r.userEmail && ` (${r.userEmail})`}
                      {r.postTitle && (
                        <>
                          {" / "}
                          記事: 「{r.postTitle}」
                        </>
                      )}
                      {" / "}
                      {new Date(r.date).toLocaleString("ja-JP", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => toggle(r)}
                    disabled={busy === key}
                    className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
                      r.deleted
                        ? "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                        : "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                    } disabled:opacity-50`}
                  >
                    {busy === key ? "..." : r.deleted ? "復元" : "削除"}
                  </button>
                </li>
              );
            })}
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

  const q = typeof ctx.query.q === "string" ? ctx.query.q.trim() : "";
  const show = typeof ctx.query.show === "string" ? ctx.query.show : "";

  const deletedFilter: { deleted?: boolean } =
    show === "deleted" ? { deleted: true } : show === "all" ? {} : { deleted: false };

  const textFilter: Record<string, unknown> = q
    ? { OR: [{ content: { contains: q, mode: "insensitive" } }, { author: { contains: q, mode: "insensitive" } }] }
    : {};

  const [parents, children, totalParent, totalChild] = await Promise.all([
    prisma.parentComment.findMany({
      where: { ...deletedFilter, ...textFilter },
      orderBy: { date: "desc" },
      take: 100,
      include: {
        post: { select: { id: true, title: true } },
        user: { select: { email: true } },
      },
    }),
    prisma.childComment.findMany({
      where: { ...deletedFilter, ...textFilter },
      orderBy: { date: "desc" },
      take: 100,
      include: {
        user: { select: { email: true } },
        parentComment: { select: { id: true, post: { select: { title: true } } } },
      },
    }),
    prisma.parentComment.count(),
    prisma.childComment.count(),
  ]);

  const rows: Row[] = [
    ...parents.map((p): Row => ({
      type: "parent",
      id: p.id,
      content: p.content,
      author: p.author,
      userId: p.userId,
      userEmail: p.user?.email ?? null,
      date: p.date.toISOString(),
      postId: p.post_id,
      postTitle: p.post?.title ?? null,
      deleted: p.deleted,
    })),
    ...children.map((c): Row => ({
      type: "child",
      id: c.id,
      content: c.content,
      author: c.author,
      userId: c.userId,
      userEmail: c.user?.email ?? null,
      date: c.date.toISOString(),
      parentId: c.parentCommentId,
      postTitle: c.parentComment?.post?.title ?? null,
      deleted: c.deleted,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    props: { rows, total: totalParent + totalChild, filter: { q, show } },
  };
};
