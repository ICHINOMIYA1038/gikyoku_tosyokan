import { GetStaticProps } from "next";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { POOLS, AXIS_LABELS, type Axis, type Pool, type PoolKey } from "@/lib/etude-pools";
import { playDiceRoll, playClick } from "@/lib/theater-menu-sfx";
import {
  Dice6, Lock, Unlock, Copy, UserCog, BookOpen, Volume2, VolumeX,
} from "lucide-react";

type Props = { categories: SidebarCategory[] };

const AXES: Axis[] = ["places", "relations", "purposes", "obstacles", "constraints"];

export default function EtudeGenerator({ categories }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [poolKey, setPoolKey] = useState<PoolKey>("modern");
  const [muted, setMuted] = useState(false);
  const [locks, setLocks] = useState<Record<Axis, boolean>>({
    places: false, relations: false, purposes: false, obstacles: false, constraints: false,
  });
  const [values, setValues] = useState<Record<Axis, string>>({
    places: "", relations: "", purposes: "", obstacles: "", constraints: "",
  });
  const [mounted, setMounted] = useState(false);
  const [savingToPlan, setSavingToPlan] = useState(false);
  const [savedPlan, setSavedPlan] = useState<{ id: string; title: string } | null>(null);

  const activePool: Pool = POOLS[poolKey].pool;

  const sfx = (fn: () => void) => { if (!muted) fn(); };

  useEffect(() => {
    const preset = (router.query.pool as string) || "modern";
    if (POOLS[preset as PoolKey]) setPoolKey(preset as PoolKey);
  }, [router.query.pool]);

  useEffect(() => {
    setValues(randomizeAll(activePool));
    setMounted(true);
  }, [activePool]);

  const rollAll = useCallback(() => {
    sfx(playDiceRoll);
    setValues((prev) => {
      const next: Record<Axis, string> = { ...prev };
      AXES.forEach((k) => {
        if (!locks[k]) next[k] = pick(activePool[k], prev[k]);
      });
      return next;
    });
  }, [locks, activePool, muted]);

  const rollOne = (k: Axis) => {
    sfx(playDiceRoll);
    setValues((prev) => ({ ...prev, [k]: pick(activePool[k], prev[k]) }));
  };
  const toggleLock = (k: Axis) => {
    sfx(playClick);
    setLocks((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const copyPrompt = async () => {
    sfx(playClick);
    const text = AXES.map((k) => `${AXIS_LABELS[k]}: ${values[k]}`).join("\n");
    const full = `【今日のエチュード (${POOLS[poolKey].name})】\n${text}\n\n生成: 戯曲図書館 演劇メニュー辞典`;
    try {
      await navigator.clipboard.writeText(full);
      alert("お題をコピーしました");
    } catch {
      prompt("お題:", full);
    }
  };

  const saveToPlan = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }
    setSavingToPlan(true);
    const promptText = AXES.map((k) => `${AXIS_LABELS[k]}: ${values[k]}`).join(" / ");
    const plansRes = await fetch("/api/theater-menu/plans");
    const { plans } = await plansRes.json();
    let planId: string;
    if (plans && plans.length > 0) {
      planId = plans[0].id;
    } else {
      const created = await fetch("/api/theater-menu/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "エチュードお題ノート" }),
      }).then((r) => r.json());
      planId = created.plan.id;
    }
    const curRes = await fetch(`/api/theater-menu/plans/${planId}`);
    const cur = await curRes.json();
    const holderRes = await fetch("/api/theater-menu?category=etude");
    const holderData = await holderRes.json();
    const holderId = holderData.menus?.[0]?.id;
    if (!holderId) {
      alert("エチュードメニューが見つかりません");
      setSavingToPlan(false);
      return;
    }
    const items = [
      ...(cur.plan?.items || []).map((it: any) => ({
        menuId: it.menuId, customDuration: it.customDuration, notes: it.notes,
      })),
      { menuId: holderId, customDuration: null, notes: `[お題 ${POOLS[poolKey].name}] ${promptText}` },
    ];
    await fetch(`/api/theater-menu/plans/${planId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setSavingToPlan(false);
    setSavedPlan({ id: planId, title: cur.plan?.title || "プラン" });
  };

  return (
    <Layout>
      <Seo
        pageTitle="エチュード即興ジェネレーター — 演劇メニュー辞典"
        pageDescription="場所×関係×目的×障害×制約を無限に組み合わせてエチュードのお題を生成。ジャンル切替可能。"
        pagePath="/theater-menu/etude-generator"
      />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <span>エチュードジェネレーター</span>
        </nav>

        <div className="md:flex md:gap-6">
          <TheaterMenuSidebar categories={categories} />

          <main className="flex-1 min-w-0 mt-6 md:mt-0">
            {/* エディトリアル風ヘッダー */}
            <header className="mb-6 pb-5 border-b border-gray-200">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-[10px] font-semibold text-rose-600 tracking-widest uppercase mb-1.5">
                    Etude Prompt Generator
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    エチュードお題ジェネレーター
                  </h1>
                </div>
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 shrink-0"
                  title={muted ? "音ON" : "音OFF"}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                場所・関係性・目的・障害・制約の5要素をランダムに組み合わせ、稽古や俳優訓練のためのお題を生成します。要素ごとにロック/再抽選が可能。
              </p>
            </header>

            {/* ジャンル切替 */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">
                Genre
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(POOLS) as PoolKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => { sfx(playClick); setPoolKey(k); }}
                    className={`px-3 py-1.5 text-xs rounded transition ${
                      poolKey === k
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {POOLS[k].name}
                  </button>
                ))}
              </div>
            </div>

            {/* お題カード */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
              {AXES.map((k, idx) => (
                <div key={k} className="group">
                  <div className="flex items-stretch">
                    <div className="w-16 md:w-20 shrink-0 flex flex-col items-center justify-center py-4 border-r border-gray-100 bg-gray-50/50">
                      <span className="text-[10px] text-gray-400 font-mono">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[11px] text-gray-600 font-medium tracking-wider mt-1">
                        {AXIS_LABELS[k]}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center px-5 py-4 md:py-5">
                      <p className="text-base md:text-xl font-serif font-medium text-gray-900 leading-snug flex-1 tracking-tight">
                        {mounted ? values[k] : "…"}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 pr-2 shrink-0">
                      <button
                        onClick={() => rollOne(k)}
                        disabled={locks[k]}
                        className="p-2 rounded text-gray-300 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300 transition"
                        title="この要素だけ再抽選"
                      >
                        <Dice6 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleLock(k)}
                        className={`p-2 rounded transition ${
                          locks[k]
                            ? "text-rose-600 bg-rose-50"
                            : "text-gray-300 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        title={locks[k] ? "ロック解除" : "ロック"}
                      >
                        {locks[k] ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={rollAll}
                className="flex-1 min-w-[12rem] inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white py-3 text-sm font-medium hover:bg-black transition"
              >
                <Dice6 className="w-4 h-4" />
                すべて振り直す
              </button>
              <button
                onClick={copyPrompt}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                コピー
              </button>
              <button
                onClick={saveToPlan}
                disabled={savingToPlan}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {savingToPlan ? "保存中" : "プランに追加"}
              </button>
              <Link
                href="/theater-menu/role-picker"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <UserCog className="w-3.5 h-3.5" />
                役を振る
              </Link>
            </div>

            {savedPlan && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 flex items-center gap-2">
                ✓ 「{savedPlan.title}」に追加しました。
                <Link href={`/theater-menu/plans/${savedPlan.id}`} className="underline font-medium">
                  プランを開く
                </Link>
              </div>
            )}

            <div className="mt-8 text-xs text-gray-500 leading-relaxed space-y-1">
              <p><span className="text-gray-400">TIP.</span> ジャンル切替で世界観を統一するだけで稽古の質感が変わります</p>
              <p><span className="text-gray-400">TIP.</span> 「制約」があるほど演技の芯が立ちます</p>
              <p><span className="text-gray-400">TIP.</span> 観客役は「関係性」だけ伏せて後で当ててもらう遊びもできます</p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

function pick<T>(arr: T[], exclude?: T): T {
  if (arr.length === 1) return arr[0];
  let out: T = arr[Math.floor(Math.random() * arr.length)];
  let tries = 0;
  while (out === exclude && tries < 10) {
    out = arr[Math.floor(Math.random() * arr.length)];
    tries++;
  }
  return out;
}

function randomizeAll(pool: Pool): Record<Axis, string> {
  return {
    places: pick(pool.places),
    relations: pick(pool.relations),
    purposes: pick(pool.purposes),
    obstacles: pick(pool.obstacles),
    constraints: pick(pool.constraints),
  };
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const cats = await prisma.theaterMenuCategory.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: { _count: { select: { menus: { where: { published: true } } } } },
  });
  return {
    props: {
      categories: cats.map((c) => ({
        slug: c.slug,
        name: c.name,
        count: c._count.menus,
        icon: c.icon,
      })),
    },
    revalidate: 300,
  };
};
