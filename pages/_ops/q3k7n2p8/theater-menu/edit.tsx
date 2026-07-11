import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { AdminLayout, ADMIN_BASE } from "@/components/AdminLayout";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

type Cat = { id: number; name: string; slug: string };
type Menu = {
  id: number;
  slug: string;
  categoryId: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  images: string[];
  tags: string[];
  duration: number | null;
  minPeople: number | null;
  maxPeople: number | null;
  difficulty: number | null;
  published: boolean;
  order: number;
  aliases: string[];
  learningObjectives: string[];
  ageGroup: string | null;
  materials: string[];
  spaceRequirement: string | null;
  hasPhysicalContact: boolean | null;
  sideCoaching: string | null;
  reflectionQuestions: string[];
  videoUrl: string | null;
  credit: string | null;
  sourceUrl: string | null;
  relatedSlugs: string[];
};

type Props = { categories: Cat[]; menu: Menu | null };

export default function EditMenu({ categories, menu }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Menu>(
    menu || {
      id: 0,
      slug: "",
      categoryId: categories[0]?.id || 0,
      title: "",
      summary: "",
      content: "",
      imageUrl: null,
      images: [],
      tags: [],
      duration: null,
      minPeople: null,
      maxPeople: null,
      difficulty: null,
      published: true,
      order: 0,
      aliases: [],
      learningObjectives: [],
      ageGroup: null,
      materials: [],
      spaceRequirement: null,
      hasPhysicalContact: null,
      sideCoaching: null,
      reflectionQuestions: [],
      videoUrl: null,
      credit: null,
      sourceUrl: null,
      relatedSlugs: [],
    }
  );
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Menu>(k: K, v: Menu[K]) => setForm({ ...form, [k]: v });

  const save = async () => {
    setSaving(true);
    const r = await fetch(`/api/_ops/q3k7n2p8/theater-menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "menu",
        id: form.id || undefined,
        slug: form.slug,
        categoryId: form.categoryId,
        title: form.title,
        summary: form.summary,
        content: form.content,
        imageUrl: form.imageUrl,
        images: form.images,
        tags: form.tags,
        duration: form.duration,
        minPeople: form.minPeople,
        maxPeople: form.maxPeople,
        difficulty: form.difficulty,
        published: form.published,
        order: form.order,
        aliases: form.aliases,
        learningObjectives: form.learningObjectives,
        ageGroup: form.ageGroup,
        materials: form.materials,
        spaceRequirement: form.spaceRequirement,
        hasPhysicalContact: form.hasPhysicalContact,
        sideCoaching: form.sideCoaching,
        reflectionQuestions: form.reflectionQuestions,
        videoUrl: form.videoUrl,
        credit: form.credit,
        sourceUrl: form.sourceUrl,
        relatedSlugs: form.relatedSlugs,
      }),
    });
    setSaving(false);
    if (r.ok) {
      router.push(`${ADMIN_BASE}/theater-menu`);
    } else {
      alert("保存に失敗しました");
    }
  };

  const remove = async () => {
    if (!form.id) return;
    if (!confirm("削除しますか？")) return;
    const r = await fetch(`/api/_ops/q3k7n2p8/theater-menu?kind=menu&id=${form.id}`, {
      method: "DELETE",
    });
    if (r.ok) router.push(`${ADMIN_BASE}/theater-menu`);
    else alert("削除に失敗しました");
  };

  return (
    <AdminLayout title={form.id ? "メニュー編集" : "新規メニュー"}>
      <p className="text-xs text-gray-500 mb-4">
        <a href={`${ADMIN_BASE}/theater-menu`} className="text-rose-600 hover:underline">← 一覧に戻る</a>
      </p>

      <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-xs text-gray-600">
            slug
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </label>
          <label className="text-xs text-gray-600">
            カテゴリ
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={form.categoryId}
              onChange={(e) => set("categoryId", Number(e.target.value))}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="text-xs text-gray-600">
          タイトル
          <input
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </label>

        <label className="text-xs text-gray-600">
          要約 (一覧・SEO用)
          <textarea
            rows={2}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            value={form.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </label>

        <label className="text-xs text-gray-600">
          本文 (Markdown)
          <textarea
            rows={18}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-xs text-gray-600">
            アイキャッチURL
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={form.imageUrl || ""}
              onChange={(e) => set("imageUrl", e.target.value || null)}
            />
          </label>
          <label className="text-xs text-gray-600">
            追加画像URL (改行区切り)
            <textarea
              rows={3}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={form.images.join("\n")}
              onChange={(e) => set("images", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
            />
          </label>
        </div>

        <label className="text-xs text-gray-600">
          タグ (カンマ区切り)
          <input
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            value={form.tags.join(", ")}
            onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-4">
          <label className="text-xs text-gray-600">
            所要時間(分)
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={form.duration ?? ""}
              onChange={(e) => set("duration", e.target.value ? Number(e.target.value) : null)}
            />
          </label>
          <label className="text-xs text-gray-600">
            最小人数
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={form.minPeople ?? ""}
              onChange={(e) => set("minPeople", e.target.value ? Number(e.target.value) : null)}
            />
          </label>
          <label className="text-xs text-gray-600">
            最大人数
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={form.maxPeople ?? ""}
              onChange={(e) => set("maxPeople", e.target.value ? Number(e.target.value) : null)}
            />
          </label>
          <label className="text-xs text-gray-600">
            難易度 1-5
            <input
              type="number"
              min={1}
              max={5}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              value={form.difficulty ?? ""}
              onChange={(e) => set("difficulty", e.target.value ? Number(e.target.value) : null)}
            />
          </label>
        </div>

        <details className="rounded border border-gray-200 p-3">
          <summary className="text-xs font-semibold text-gray-700 cursor-pointer">拡張メタデータ (SEO・詳細説明用)</summary>
          <div className="mt-3 grid gap-3">
            <label className="text-xs text-gray-600">
              別名 (改行区切り)
              <textarea
                rows={2}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={form.aliases.join("\n")}
                onChange={(e) => set("aliases", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              />
            </label>
            <label className="text-xs text-gray-600">
              学習目標 (改行区切り、Google HowTo で使われる)
              <textarea
                rows={3}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={form.learningObjectives.join("\n")}
                onChange={(e) => set("learningObjectives", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-gray-600">
                対象年齢
                <input
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  placeholder="例: 中学生〜大人"
                  value={form.ageGroup ?? ""}
                  onChange={(e) => set("ageGroup", e.target.value || null)}
                />
              </label>
              <label className="text-xs text-gray-600">
                必要なスペース
                <input
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  placeholder="例: 10畳以上"
                  value={form.spaceRequirement ?? ""}
                  onChange={(e) => set("spaceRequirement", e.target.value || null)}
                />
              </label>
            </div>
            <label className="text-xs text-gray-600">
              必要な道具・小道具 (改行区切り)
              <textarea
                rows={2}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={form.materials.join("\n")}
                onChange={(e) => set("materials", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              />
            </label>
            <label className="text-xs text-gray-600">
              身体接触
              <select
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={form.hasPhysicalContact === null ? "unset" : String(form.hasPhysicalContact)}
                onChange={(e) => {
                  const v = e.target.value;
                  set("hasPhysicalContact", v === "unset" ? null : v === "true");
                }}
              >
                <option value="unset">未設定</option>
                <option value="true">あり (警告表示)</option>
                <option value="false">なし</option>
              </select>
            </label>
            <label className="text-xs text-gray-600">
              Side Coaching (進行役の声かけ例)
              <textarea
                rows={2}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={form.sideCoaching ?? ""}
                onChange={(e) => set("sideCoaching", e.target.value || null)}
              />
            </label>
            <label className="text-xs text-gray-600">
              振り返り質問 (改行区切り)
              <textarea
                rows={3}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                value={form.reflectionQuestions.join("\n")}
                onChange={(e) => set("reflectionQuestions", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-gray-600">
                動画URL
                <input
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  placeholder="https://youtube.com/..."
                  value={form.videoUrl ?? ""}
                  onChange={(e) => set("videoUrl", e.target.value || null)}
                />
              </label>
              <label className="text-xs text-gray-600">
                考案者・出典 (クレジット)
                <input
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  placeholder="例: Konstantin Stanislavski"
                  value={form.credit ?? ""}
                  onChange={(e) => set("credit", e.target.value || null)}
                />
              </label>
            </div>
            <label className="text-xs text-gray-600">
              参考リンク
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://..."
                value={form.sourceUrl ?? ""}
                onChange={(e) => set("sourceUrl", e.target.value || null)}
              />
            </label>
            <label className="text-xs text-gray-600">
              関連メニューのslug (カンマ区切り、順序が表示順)
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
                placeholder="例: yes-and, one-word-scene, montage"
                value={form.relatedSlugs.join(", ")}
                onChange={(e) => set("relatedSlugs", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </label>
          </div>
        </details>

        <div className="flex items-center gap-4">
          <label className="text-xs text-gray-600 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            公開する
          </label>
          <label className="text-xs text-gray-600 inline-flex items-center gap-2">
            並び順
            <input
              type="number"
              className="w-20 rounded border border-gray-300 px-2 py-1"
              value={form.order}
              onChange={(e) => set("order", Number(e.target.value))}
            />
          </label>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            {form.id > 0 && (
              <button
                onClick={remove}
                className="text-xs text-red-600 hover:underline"
              >
                削除
              </button>
            )}
          </div>
          <button
            onClick={save}
            disabled={saving || !form.slug || !form.title}
            className="rounded bg-rose-600 px-5 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const guard = await requireAdminPage(ctx);
  if ("redirect" in guard) return { redirect: guard.redirect };
  if ("notFound" in guard) return { notFound: true };

  const id = ctx.query.id ? Number(ctx.query.id) : null;
  const [cats, menu] = await Promise.all([
    prisma.theaterMenuCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
    id
      ? prisma.theaterMenu.findUnique({ where: { id } })
      : Promise.resolve(null),
  ]);

  return {
    props: {
      categories: cats,
      menu: menu
        ? {
            id: menu.id,
            slug: menu.slug,
            categoryId: menu.categoryId,
            title: menu.title,
            summary: menu.summary,
            content: menu.content,
            imageUrl: menu.imageUrl,
            images: menu.images,
            tags: menu.tags,
            duration: menu.duration,
            minPeople: menu.minPeople,
            maxPeople: menu.maxPeople,
            difficulty: menu.difficulty,
            published: menu.published,
            order: menu.order,
            aliases: menu.aliases,
            learningObjectives: menu.learningObjectives,
            ageGroup: menu.ageGroup,
            materials: menu.materials,
            spaceRequirement: menu.spaceRequirement,
            hasPhysicalContact: menu.hasPhysicalContact,
            sideCoaching: menu.sideCoaching,
            reflectionQuestions: menu.reflectionQuestions,
            videoUrl: menu.videoUrl,
            credit: menu.credit,
            sourceUrl: menu.sourceUrl,
            relatedSlugs: menu.relatedSlugs,
          }
        : null,
    },
  };
};
