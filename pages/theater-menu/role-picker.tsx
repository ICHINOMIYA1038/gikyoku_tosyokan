import { GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { prisma } from "@/lib/prisma";
import { TheaterMenuSidebar, SidebarCategory } from "@/components/TheaterMenuSidebar";
import { ROLE_ATTRIBUTES } from "@/lib/etude-pools";
import { playShuffle, playClick } from "@/lib/theater-menu-sfx";
import QRCode from "qrcode";
import {
  Shuffle, Users, Trash2, UserPlus, User, QrCode, Volume2, VolumeX,
} from "lucide-react";

type Mode = "roles" | "groups";
type Props = { categories: SidebarCategory[] };
const STORAGE_KEY = "theater-menu-role-participants";
const DEFAULT_PARTICIPANTS = ["参加者1", "参加者2", "参加者3", "参加者4", "参加者5", "参加者6"];

export default function RolePicker({ categories }: Props) {
  const [participants, setParticipants] = useState<string[]>(DEFAULT_PARTICIPANTS);
  const [rawInput, setRawInput] = useState("");
  const [mode, setMode] = useState<Mode>("roles");
  const [rolesText, setRolesText] = useState("A, B, C");
  const [groupSize, setGroupSize] = useState(2);
  const [seed, setSeed] = useState(0);
  const [attachAttrs, setAttachAttrs] = useState(false);
  const [muted, setMuted] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // localStorage load — mount 後の1回だけ
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setParticipants(parsed);
        }
      }
    } catch {}
    setMounted(true);
  }, []);

  // localStorage save (mount後のみ)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
    } catch {}
  }, [participants, mounted]);

  const roles = rolesText.split(/[,、\n]+/).map((s) => s.trim()).filter(Boolean);
  const sfx = (fn: () => void) => { if (!muted) fn(); };

  const shuffled = useMemo(() => {
    void seed;
    // SSR時はshuffleしない (Math.randomでhydration mismatchするため)
    if (!mounted) return [...participants];
    return shuffle([...participants]);
  }, [participants, seed, mounted]);

  const roleAssignment = useMemo(() => {
    if (roles.length === 0) return [];
    void seed;
    return shuffled.map((name, i) => {
      const role = roles[i % roles.length];
      return {
        name,
        role,
        personality: attachAttrs ? pickOne(ROLE_ATTRIBUTES.personalities) : null,
        desire: attachAttrs ? pickOne(ROLE_ATTRIBUTES.desires) : null,
      };
    });
  }, [shuffled, roles, attachAttrs, seed]);

  const groups = useMemo(() => {
    if (groupSize < 1) return [];
    const g: string[][] = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      g.push(shuffled.slice(i, i + groupSize));
    }
    if (g.length >= 2 && g[g.length - 1].length < Math.floor(groupSize / 2) + 1 && groupSize > 1) {
      const last = g.pop()!;
      g[g.length - 1].push(...last);
    }
    return g;
  }, [shuffled, groupSize]);

  const addParticipant = () => {
    if (!rawInput.trim()) return;
    sfx(playClick);
    const names = rawInput.split(/[,、\n]+/).map((s) => s.trim()).filter(Boolean);
    setParticipants([...participants, ...names]);
    setRawInput("");
  };
  const removeParticipant = (i: number) => setParticipants(participants.filter((_, idx) => idx !== i));
  const clearAll = () => {
    if (confirm("参加者リストをすべて削除しますか?")) setParticipants([]);
  };
  const doShuffle = () => { sfx(playShuffle); setSeed(seed + 1); };

  const openQr = async () => {
    sfx(playClick);
    let text = "";
    if (mode === "roles") {
      text = roleAssignment.map((r) =>
        attachAttrs ? `${r.name}: ${r.role} (${r.personality} / ${r.desire})` : `${r.name}: ${r.role}`
      ).join("\n");
    } else {
      text = groups.map((g, i) => `グループ${i + 1}: ${g.join("、")}`).join("\n");
    }
    const encoded = typeof window !== "undefined" ? btoa(unescape(encodeURIComponent(text))) : "";
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/theater-menu/share?d=${encoded}`;
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 512, margin: 2, color: { dark: "#111827", light: "#ffffff" },
      });
      setQrDataUrl(dataUrl);
      setQrOpen(true);
    } catch {
      alert("QR生成に失敗しました");
    }
  };

  return (
    <Layout>
      <Seo
        pageTitle="役割割り振りツール — 演劇メニュー辞典"
        pageDescription="参加者名を入力してシャッフルで役割配布・グループ分け。役の性格まで抽選、QRで即共有。"
        pagePath="/theater-menu/role-picker"
      />
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">ホーム</Link>
          <span className="mx-2">/</span>
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <span>役割割り振り</span>
        </nav>

        <div className="md:flex md:gap-6">
          <TheaterMenuSidebar categories={categories} />

          <main className="flex-1 min-w-0 mt-6 md:mt-0">
            <header className="mb-6 pb-5 border-b border-gray-200">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-[10px] font-semibold text-rose-600 tracking-widest uppercase mb-1.5">
                    Role Picker
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    役割割り振りツール
                  </h1>
                </div>
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 shrink-0"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                参加者を入力してシャッフル。役割配布・グループ分けが一瞬で決まります。エチュード用に役の性格・目的まで一気に抽選、QRで参加者へ配布も可能。
              </p>
            </header>

            <div className="grid gap-5 md:grid-cols-5">
              {/* 参加者 */}
              <section className="md:col-span-3 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-rose-500" />
                    参加者
                    <span className="text-gray-400 font-normal">({participants.length}人)</span>
                  </h2>
                  <div className="flex items-center gap-3">
                    {mounted && (
                      <span className="text-[10px] text-gray-400">履歴保存中</span>
                    )}
                    {participants.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-gray-400 hover:text-red-600"
                      >
                        全消去
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addParticipant()}
                    placeholder="名前をカンマ区切りで一括入力できます"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-300 focus:outline-none"
                  />
                  <button
                    onClick={addParticipant}
                    className="inline-flex items-center gap-1 rounded-lg bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    追加
                  </button>
                </div>
                {participants.length > 0 ? (
                  <ul className="grid gap-1 sm:grid-cols-2 max-h-80 overflow-auto">
                    {participants.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 group"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] text-gray-400 font-mono w-4 shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{p}</span>
                        </span>
                        <button
                          onClick={() => removeParticipant(i)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-xs text-gray-400 py-6 border border-dashed border-gray-200 rounded">
                    参加者を追加してください
                  </p>
                )}
              </section>

              {/* 設定 */}
              <section className="md:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  抽選モード
                </h2>
                <div className="flex gap-1 mb-4 p-1 rounded-lg bg-gray-100">
                  <button
                    onClick={() => { sfx(playClick); setMode("roles"); }}
                    className={`flex-1 py-1.5 text-xs rounded transition ${
                      mode === "roles" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500"
                    }`}
                  >
                    役割配布
                  </button>
                  <button
                    onClick={() => { sfx(playClick); setMode("groups"); }}
                    className={`flex-1 py-1.5 text-xs rounded transition ${
                      mode === "groups" ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500"
                    }`}
                  >
                    グループ分け
                  </button>
                </div>

                {mode === "roles" ? (
                  <div className="space-y-3">
                    <label className="text-xs text-gray-600 block">
                      役 (カンマ区切り)
                      <input
                        value={rolesText}
                        onChange={(e) => setRolesText(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-300 focus:outline-none"
                        placeholder="例: 主役, 相手役, 演出補佐"
                      />
                    </label>
                    <label className="text-xs text-gray-600 flex items-center gap-2 cursor-pointer p-2 rounded bg-gray-50">
                      <input
                        type="checkbox"
                        checked={attachAttrs}
                        onChange={(e) => setAttachAttrs(e.target.checked)}
                      />
                      役の性格・目的も一緒に抽選する
                    </label>
                  </div>
                ) : (
                  <label className="text-xs text-gray-600 block">
                    1グループあたりの人数
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={groupSize}
                        onChange={(e) => setGroupSize(Math.max(1, Number(e.target.value)))}
                        className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                      <span className="text-xs text-gray-500">
                        {participants.length > 0 && `→ ${Math.ceil(participants.length / groupSize)}グループ`}
                      </span>
                    </div>
                  </label>
                )}

                <button
                  onClick={doShuffle}
                  disabled={participants.length === 0}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-black disabled:opacity-30 disabled:hover:bg-gray-900 transition"
                >
                  <Shuffle className="w-4 h-4" />
                  シャッフル
                </button>
              </section>
            </div>

            {/* 結果 */}
            {participants.length > 0 && (
              <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h2 className="text-sm font-bold text-gray-900">結果</h2>
                  <button
                    onClick={openQr}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    QRで共有
                  </button>
                </div>
                {mode === "roles" ? (
                  roles.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4">役を入力してください</p>
                  ) : (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {roleAssignment.map((r, i) => (
                        <li key={i} className="rounded-lg border border-gray-100 px-4 py-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 truncate">{r.name}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-gray-900 text-white font-medium shrink-0">
                              {r.role}
                            </span>
                          </div>
                          {attachAttrs && r.personality && (
                            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                              <span className="text-gray-400">性格</span> {r.personality} <br />
                              <span className="text-gray-400">目的</span> {r.desire}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {groups.map((g, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-3">
                        <p className="text-xs font-bold text-gray-900 mb-2 pb-1.5 border-b border-gray-100">
                          グループ {i + 1}
                          <span className="ml-1 text-gray-400 font-normal">({g.length}人)</span>
                        </p>
                        <ul className="space-y-1">
                          {g.map((n, j) => (
                            <li key={j} className="text-sm text-gray-800 flex items-center gap-1.5">
                              <User className="w-3 h-3 text-gray-400" />
                              {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            <div className="mt-8 text-xs text-gray-500 leading-relaxed space-y-1">
              <p><span className="text-gray-400">TIP.</span> 参加者リストは自動保存され、次回開いたときに復元されます</p>
              <p><span className="text-gray-400">TIP.</span> 役の性格・目的も抽選すればエチュード用にそのまま使えます</p>
              <p><span className="text-gray-400">TIP.</span> QRで稽古場の全員に結果を配布できます</p>
            </div>
          </main>
        </div>
      </div>

      {qrOpen && (
        <div
          onClick={() => setQrOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-base font-bold text-gray-900 mb-1">QRコードで共有</h3>
            <p className="text-xs text-gray-500 mb-4">スマホで読み取ると結果ページが開きます</p>
            {qrDataUrl && (
              <img src={qrDataUrl} alt="QR" className="w-full max-w-xs mx-auto rounded-lg" />
            )}
            <button
              onClick={() => setQrOpen(false)}
              className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
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
    revalidate: 600,
  };
};
