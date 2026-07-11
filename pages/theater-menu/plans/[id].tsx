import { GetServerSideProps } from "next";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ArrowUp, ArrowDown, X, Save, Printer, Share2, Plus, Clock } from "lucide-react";

type MenuLite = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  duration: number | null;
  minPeople: number | null;
  maxPeople: number | null;
  difficulty: number | null;
  category: { slug: string; name: string };
};

type Item = {
  menuId: number;
  customDuration: number | null;
  notes: string | null;
  menu: MenuLite;
};

type Props = {
  isOwner: boolean;
  plan: {
    id: string;
    title: string;
    description: string | null;
    isPublic: boolean;
    userId: string;
  };
  items: Item[];
  allMenus: MenuLite[];
};

export default function PlanEditor({ isOwner, plan, items: initialItems, allMenus }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [title, setTitle] = useState(plan.title);
  const [description, setDescription] = useState(plan.description || "");
  const [isPublic, setIsPublic] = useState(plan.isPublic);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");

  const totalDuration = items.reduce(
    (sum, it) => sum + (it.customDuration ?? it.menu.duration ?? 0),
    0
  );

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    setDirty(true);
  };

  const remove = (i: number) => {
    setItems(items.filter((_, idx) => idx !== i));
    setDirty(true);
  };

  const addMenu = (menu: MenuLite) => {
    setItems([...items, { menuId: menu.id, customDuration: null, notes: null, menu }]);
    setDirty(true);
    setShowPicker(false);
    setPickerQuery("");
  };

  const updateItem = (i: number, patch: Partial<Item>) => {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    setItems(next);
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    const r = await fetch(`/api/theater-menu/plans/${plan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        isPublic,
        items: items.map((it) => ({
          menuId: it.menuId,
          customDuration: it.customDuration,
          notes: it.notes,
        })),
      }),
    });
    setSaving(false);
    if (r.ok) setDirty(false);
    else alert("保存に失敗しました");
  };

  const remove_plan = async () => {
    if (!confirm("このプランを削除しますか?")) return;
    const r = await fetch(`/api/theater-menu/plans/${plan.id}`, { method: "DELETE" });
    if (r.ok) router.push("/theater-menu/plans");
  };

  const share = async () => {
    if (!isPublic) {
      alert("共有するには公開設定をONにしてから保存してください");
      return;
    }
    const url = `${window.location.origin}/theater-menu/plans/${plan.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("共有URLをコピーしました");
    } catch {
      prompt("URL:", url);
    }
  };

  const availableToAdd = allMenus.filter((m) => {
    if (items.some((it) => it.menuId === m.id)) return false;
    if (!pickerQuery) return true;
    const q = pickerQuery.toLowerCase();
    return m.title.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q);
  });

  return (
    <Layout>
      <Seo
        pageTitle={`${title} — レッスンプラン`}
        pageDescription={description || "演劇レッスンプラン"}
        pagePath={`/theater-menu/plans/${plan.id}`}
      />
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 print:max-w-full">
        <nav className="text-xs text-gray-500 mb-4 print:hidden">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu/plans" className="hover:text-rose-600">レッスンプラン</Link>
          <span className="mx-2">/</span>
          <span>{plan.title}</span>
        </nav>

        <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-8 mb-6 print:border-none print:p-0">
          {isOwner ? (
            <>
              <input
                className="w-full text-2xl md:text-3xl font-bold text-gray-900 border-b border-transparent hover:border-gray-200 focus:border-rose-300 focus:outline-none pb-1 mb-3"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setDirty(true);
                }}
              />
              <textarea
                className="w-full text-sm text-gray-600 border border-transparent hover:border-gray-200 focus:border-rose-300 focus:outline-none rounded p-2 mb-4"
                rows={2}
                placeholder="このプランの目的・対象・全体の流れなど"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDirty(true);
                }}
              />
              <div className="flex flex-wrap items-center gap-3 print:hidden">
                <label className="text-xs text-gray-700 inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => {
                      setIsPublic(e.target.checked);
                      setDirty(true);
                    }}
                  />
                  URLで共有可能にする
                </label>
                <button
                  onClick={save}
                  disabled={saving || !dirty}
                  className="inline-flex items-center gap-1.5 rounded bg-rose-600 text-white px-4 py-1.5 text-sm hover:bg-rose-700 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "保存中" : dirty ? "保存" : "保存済み"}
                </button>
                <button
                  onClick={share}
                  className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  共有
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50"
                >
                  <Printer className="w-3.5 h-3.5" />
                  印刷
                </button>
                <button
                  onClick={remove_plan}
                  className="text-xs text-red-600 hover:underline ml-auto"
                >
                  プランを削除
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1>
              {description && (
                <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">{description}</p>
              )}
            </>
          )}

          <p className="mt-4 text-sm text-gray-600 flex items-center gap-1 print:mt-2">
            <Clock className="w-4 h-4" /> 合計 {totalDuration} 分 / {items.length} メニュー
          </p>
        </div>

        <ol className="space-y-3 mb-6">
          {items.map((it, i) => (
            <li
              key={`${it.menuId}-${i}`}
              className="rounded-lg border border-gray-200 bg-white p-4 print:break-inside-avoid"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white text-sm font-bold flex items-center justify-center shrink-0 print:bg-black">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-rose-600 font-medium">{it.menu.category.name}</p>
                  <Link
                    href={`/theater-menu/${it.menu.category.slug}/${it.menu.slug}`}
                    className="text-base font-bold text-gray-900 hover:text-rose-600"
                  >
                    {it.menu.title}
                  </Link>
                  <p className="text-xs text-gray-600 mt-1">{it.menu.summary}</p>
                  {isOwner ? (
                    <div className="mt-2 flex flex-wrap gap-2 items-center print:hidden">
                      <label className="text-xs text-gray-600 inline-flex items-center gap-1">
                        時間
                        <input
                          type="number"
                          className="w-16 rounded border border-gray-300 px-2 py-0.5 text-xs"
                          placeholder={String(it.menu.duration ?? "")}
                          value={it.customDuration ?? ""}
                          onChange={(e) =>
                            updateItem(i, {
                              customDuration: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                        />
                        分
                      </label>
                      <input
                        className="flex-1 min-w-[10rem] rounded border border-gray-300 px-2 py-0.5 text-xs"
                        placeholder="メモ (このプランでの狙い等)"
                        value={it.notes ?? ""}
                        onChange={(e) => updateItem(i, { notes: e.target.value })}
                      />
                    </div>
                  ) : (
                    it.notes && (
                      <p className="mt-2 text-xs text-gray-500 border-l-2 border-rose-200 pl-2">
                        {it.notes}
                      </p>
                    )
                  )}
                </div>
                <div className="text-xs text-gray-500 shrink-0 text-right">
                  <p>{it.customDuration ?? it.menu.duration ?? "?"}分</p>
                  {isOwner && (
                    <div className="mt-2 flex gap-1 print:hidden">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="p-1 text-gray-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === items.length - 1}
                        className="p-1 text-gray-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(i)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
              まだメニューが追加されていません
            </li>
          )}
        </ol>

        {isOwner && (
          <div className="print:hidden">
            {showPicker ? (
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    autoFocus
                    value={pickerQuery}
                    onChange={(e) => setPickerQuery(e.target.value)}
                    placeholder="メニューを検索"
                    className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm"
                  />
                  <button
                    onClick={() => setShowPicker(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    閉じる
                  </button>
                </div>
                <ul className="grid gap-1 max-h-80 overflow-auto">
                  {availableToAdd.map((m) => (
                    <li key={m.id}>
                      <button
                        onClick={() => addMenu(m)}
                        className="w-full text-left rounded px-3 py-2 text-sm hover:bg-rose-50 border border-transparent hover:border-rose-200 flex items-center justify-between"
                      >
                        <span>
                          <span className="text-xs text-rose-600 mr-2">
                            {m.category.name}
                          </span>
                          {m.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {m.duration ? `${m.duration}分` : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <button
                onClick={() => setShowPicker(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 hover:border-rose-300 hover:text-rose-600 w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                メニューを追加
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const id = String(ctx.params?.id);
  const plan = await prisma.lessonPlan.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { order: "asc" },
        include: {
          menu: {
            select: {
              id: true,
              slug: true,
              title: true,
              summary: true,
              duration: true,
              minPeople: true,
              maxPeople: true,
              difficulty: true,
              category: { select: { slug: true, name: true } },
            },
          },
        },
      },
    },
  });
  if (!plan) return { notFound: true };

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const isOwner = !!session && session.user.id === plan.userId;

  if (!plan.isPublic && !isOwner) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${encodeURIComponent(`/theater-menu/plans/${id}`)}`,
        permanent: false,
      },
    };
  }

  const allMenus = isOwner
    ? await prisma.theaterMenu.findMany({
        where: { published: true },
        orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          duration: true,
          minPeople: true,
          maxPeople: true,
          difficulty: true,
          category: { select: { slug: true, name: true } },
        },
      })
    : [];

  return {
    props: {
      isOwner,
      plan: {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        isPublic: plan.isPublic,
        userId: plan.userId,
      },
      items: plan.items.map((it) => ({
        menuId: it.menuId,
        customDuration: it.customDuration,
        notes: it.notes,
        menu: it.menu,
      })),
      allMenus,
    },
  };
};
