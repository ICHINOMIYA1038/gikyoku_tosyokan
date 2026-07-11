import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout, ADMIN_BASE } from "@/components/AdminLayout";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Cat = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
};

export default function CategoryManage({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const save = async (existing?: Cat) => {
    setSaving(true);
    const payload = existing
      ? { kind: "category", id: existing.id, slug: existing.slug, name: existing.name, description: existing.description, icon: existing.icon, order: existing.order }
      : { kind: "category", slug, name, description, icon, order };
    const r = await fetch(`/api/_ops/q3k7n2p8/theater-menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (r.ok) router.replace(router.asPath);
    else alert("保存に失敗しました");
  };

  const remove = async (id: number) => {
    if (!confirm("削除しますか？(メニューが紐づいていると失敗します)")) return;
    const r = await fetch(`/api/_ops/q3k7n2p8/theater-menu?kind=category&id=${id}`, {
      method: "DELETE",
    });
    if (r.ok) router.replace(router.asPath);
    else alert("削除に失敗しました");
  };

  return (
    <AdminLayout title="演劇メニュー / カテゴリ管理">
      <p className="text-xs text-gray-500 mb-4">
        <a href={`${ADMIN_BASE}/theater-menu`} className="text-rose-600 hover:underline">← メニュー一覧に戻る</a>
      </p>

      <div className="rounded-lg border border-gray-200 bg-white p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">新しいカテゴリ</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="slug (例: voice-training)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="表示名 (例: 発声練習)" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="アイコン (mic/sparkles/gamepad/script)" value={icon} onChange={(e) => setIcon(e.target.value)} />
          <input type="number" className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="並び順" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
          <textarea className="rounded border border-gray-300 px-3 py-2 text-sm sm:col-span-2" rows={2} placeholder="説明" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button
          onClick={() => save()}
          disabled={saving || !slug || !name}
          className="mt-3 rounded bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-50"
        >
          追加
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">slug</th>
              <th className="px-3 py-2 text-left">名前</th>
              <th className="px-3 py-2 text-left">アイコン</th>
              <th className="px-3 py-2 text-left">順</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-3 py-2 text-xs text-gray-500 font-mono">{c.slug}</td>
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{c.icon}</td>
                <td className="px-3 py-2 text-xs">{c.order}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => remove(c.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<{ categories: Cat[] }> = async (ctx) => {
  const guard = await requireAdminPage(ctx);
  if ("redirect" in guard) return { redirect: guard.redirect };
  if ("notFound" in guard) return { notFound: true };
  const cats = await prisma.theaterMenuCategory.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return { props: { categories: cats.map((c) => ({ ...c, createdAt: undefined, updatedAt: undefined })) as any } };
};
