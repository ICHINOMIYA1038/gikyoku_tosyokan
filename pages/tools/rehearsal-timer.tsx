import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import ToolsSidebar from "@/components/ToolsSidebar";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaUndo,
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaSave,
  FaMoon,
  FaSun,
  FaEdit,
  FaCheck,
  FaCloud,
} from "react-icons/fa";
import { useToolData, SavedToolItem } from "@/lib/useToolData";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Segment {
  id: string;
  name: string;
  durationMin: number;
}

interface PresetMenu {
  label: string;
  segments: Omit<Segment, "id">[];
}

// ---------------------------------------------------------------------------
// Preset data
// ---------------------------------------------------------------------------

const PRESETS: PresetMenu[] = [
  {
    label: "基本稽古メニュー",
    segments: [
      { name: "発声", durationMin: 10 },
      { name: "ストレッチ", durationMin: 5 },
      { name: "エチュード", durationMin: 15 },
      { name: "シーン稽古", durationMin: 60 },
      { name: "振り返り", durationMin: 10 },
    ],
  },
  {
    label: "短縮稽古",
    segments: [
      { name: "発声", durationMin: 5 },
      { name: "シーン稽古", durationMin: 45 },
      { name: "通し", durationMin: 30 },
    ],
  },
  {
    label: "通し稽古",
    segments: [
      { name: "ウォーミングアップ", durationMin: 10 },
      { name: "通し", durationMin: 90 },
      { name: "ダメ出し", durationMin: 20 },
    ],
  },
  {
    label: "ゲネプロ",
    segments: [
      { name: "最終確認", durationMin: 15 },
      { name: "本番通り", durationMin: 120 },
      { name: "反省会", durationMin: 15 },
    ],
  },
];

const STORAGE_KEY = "rehearsal-timer-custom-menus";
const DARK_KEY = "rehearsal-timer-dark";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function toSegments(items: Omit<Segment, "id">[]): Segment[] {
  return items.map((s) => ({ ...s, id: uid() }));
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function totalMinutes(segments: Segment[]): number {
  return segments.reduce((sum, s) => sum + s.durationMin, 0);
}

// ---------------------------------------------------------------------------
// Web Audio beep
// ---------------------------------------------------------------------------

function playBeep() {
  try {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.5;
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    // Play a second beep after a short pause
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.value = 1100;
    gain2.gain.value = 0.5;
    osc2.start(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.7);
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // Audio not available
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RehearsalTimer() {
  const router = useRouter();

  // -- State ----------------------------------------------------------------

  const [segments, setSegments] = useState<Segment[]>(() =>
    toSegments(PRESETS[0].segments)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [remainSec, setRemainSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [dark, setDark] = useState(false);

  // Custom menu persistence
  const [savedMenus, setSavedMenus] = useState<
    { label: string; segments: Omit<Segment, "id">[] }[]
  >([]);
  const [saveMenuName, setSaveMenuName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Custom segment editor
  const [editingCustom, setEditingCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customMin, setCustomMin] = useState(10);

  // Cloud save
  const toolData = useToolData("timer");
  const [showCloudSaveInput, setShowCloudSaveInput] = useState(false);
  const [cloudSaveName, setCloudSaveName] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // -- Load persisted data --------------------------------------------------

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedMenus(JSON.parse(raw));
    } catch {}
    try {
      const d = localStorage.getItem(DARK_KEY);
      if (d === "true") setDark(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DARK_KEY, String(dark));
    } catch {}
  }, [dark]);

  // Auto-load from ?load=ID query parameter
  useEffect(() => {
    const loadId = router.query.load;
    if (!loadId || !toolData.isLoggedIn) return;
    fetch(`/api/tool-data?toolType=timer`)
      .then((r) => r.json())
      .then((data) => {
        const items = data.items || [];
        const target = items.find((item: any) => item.id === Number(loadId));
        if (target) {
          const parsed = typeof target.data === "string" ? JSON.parse(target.data) : target.data;
          if (parsed?.segments) {
            const segs = toSegments(parsed.segments);
            setSegments(segs);
            setRunning(false);
            setStarted(false);
            setCurrentIdx(0);
            if (segs.length > 0) setRemainSec(segs[0].durationMin * 60);
            setEditingCustom(false);
          }
        }
      })
      .catch(() => {});
  }, [router.query.load, toolData.isLoggedIn]);

  // -- Timer logic ----------------------------------------------------------

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Tick
  useEffect(() => {
    if (!running) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemainSec((prev) => {
        if (prev <= 1) {
          // Segment finished
          playBeep();
          setCurrentIdx((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx >= segments.length) {
              // All done
              setRunning(false);
              setStarted(false);
              return idx;
            }
            setRemainSec(segments[nextIdx].durationMin * 60);
            return nextIdx;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [running, segments, clearTimer]);

  // -- Actions --------------------------------------------------------------

  const handleStart = () => {
    if (segments.length === 0) return;
    if (!started) {
      setCurrentIdx(0);
      setRemainSec(segments[0].durationMin * 60);
      setStarted(true);
    }
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleSkip = () => {
    if (currentIdx + 1 >= segments.length) {
      setRunning(false);
      setStarted(false);
      return;
    }
    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);
    setRemainSec(segments[nextIdx].durationMin * 60);
  };

  const handleReset = () => {
    setRunning(false);
    setStarted(false);
    setCurrentIdx(0);
    if (segments.length > 0) {
      setRemainSec(segments[0].durationMin * 60);
    }
  };

  const loadPreset = (preset: PresetMenu) => {
    const segs = toSegments(preset.segments);
    setSegments(segs);
    setRunning(false);
    setStarted(false);
    setCurrentIdx(0);
    setRemainSec(segs[0].durationMin * 60);
    setEditingCustom(false);
  };

  const loadSavedMenu = (menu: { label: string; segments: Omit<Segment, "id">[] }) => {
    const segs = toSegments(menu.segments);
    setSegments(segs);
    setRunning(false);
    setStarted(false);
    setCurrentIdx(0);
    setRemainSec(segs[0].durationMin * 60);
    setEditingCustom(false);
  };

  // -- Custom menu editing --------------------------------------------------

  const addCustomSegment = () => {
    if (!customName.trim() || customMin < 1) return;
    const seg: Segment = { id: uid(), name: customName.trim(), durationMin: customMin };
    const newSegs = [...segments, seg];
    setSegments(newSegs);
    setCustomName("");
    setCustomMin(10);
    if (!started) {
      setRemainSec(newSegs[0].durationMin * 60);
    }
  };

  const removeSegment = (id: string) => {
    const newSegs = segments.filter((s) => s.id !== id);
    setSegments(newSegs);
    if (!started && newSegs.length > 0) {
      setCurrentIdx(0);
      setRemainSec(newSegs[0].durationMin * 60);
    }
  };

  const moveSegment = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= segments.length) return;
    const copy = [...segments];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setSegments(copy);
    if (!started) {
      setCurrentIdx(0);
      setRemainSec(copy[0].durationMin * 60);
    }
  };

  const saveCurrentMenu = () => {
    if (!saveMenuName.trim()) return;
    const newMenu = {
      label: saveMenuName.trim(),
      segments: segments.map(({ name, durationMin }) => ({ name, durationMin })),
    };
    const updated = [...savedMenus, newMenu];
    setSavedMenus(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setSaveMenuName("");
    setShowSaveInput(false);
  };

  const deleteSavedMenu = (idx: number) => {
    const updated = savedMenus.filter((_, i) => i !== idx);
    setSavedMenus(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  // -- Cloud save/load -------------------------------------------------------

  const saveCurrentMenuCloud = async () => {
    if (!cloudSaveName.trim()) return;
    const data = {
      segments: segments.map(({ name, durationMin }) => ({ name, durationMin })),
    };
    const ok = await toolData.saveItem(cloudSaveName.trim(), data);
    if (ok) {
      setCloudSaveName("");
      setShowCloudSaveInput(false);
    }
  };

  const loadCloudMenu = (item: SavedToolItem) => {
    if (item.data?.segments) {
      const segs = toSegments(item.data.segments);
      setSegments(segs);
      setRunning(false);
      setStarted(false);
      setCurrentIdx(0);
      if (segs.length > 0) setRemainSec(segs[0].durationMin * 60);
      setEditingCustom(false);
    }
  };

  // -- Derived values -------------------------------------------------------

  const currentSegment = segments[currentIdx];
  const segmentTotalSec = currentSegment ? currentSegment.durationMin * 60 : 0;
  const segmentProgress =
    segmentTotalSec > 0 ? ((segmentTotalSec - remainSec) / segmentTotalSec) * 100 : 0;

  // Overall progress
  const totalSec = segments.reduce((s, seg) => s + seg.durationMin * 60, 0);
  const elapsedBeforeCurrent = segments
    .slice(0, currentIdx)
    .reduce((s, seg) => s + seg.durationMin * 60, 0);
  const overallElapsed = elapsedBeforeCurrent + (segmentTotalSec - remainSec);
  const overallProgress = totalSec > 0 ? (overallElapsed / totalSec) * 100 : 0;

  const nextSegment = currentIdx + 1 < segments.length ? segments[currentIdx + 1] : null;

  // -- Theme classes --------------------------------------------------------

  const bg = dark ? "bg-gray-950" : "bg-white";
  const text = dark ? "text-gray-100" : "text-gray-900";
  const card = dark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const accent = "text-orange-500";
  const btnPrimary = "bg-orange-500 hover:bg-orange-600 text-white";
  const btnSecondary = dark
    ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
    : "bg-gray-200 hover:bg-gray-300 text-gray-800";

  // -- Render ---------------------------------------------------------------

  return (
    <Layout>
      <Seo
        pageTitle="稽古タイマー — 演劇の稽古進行管理ツール"
        pageDescription="演劇の稽古で使えるタイマーツール。プリセットメニューやカスタムメニューで稽古の時間管理ができます。発声・エチュード・シーン稽古・通し稽古など、セグメントごとにカウントダウン。"
        pagePath="/tools/rehearsal-timer"
        pageKeywords="稽古タイマー,演劇,稽古,リハーサル,タイマー,時間管理,通し稽古,ゲネプロ"
      />

      <div className={`min-h-screen ${bg} ${text} transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <ToolsSidebar currentTool="rehearsal-timer" />
            <main className="flex-1 min-w-0 max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">稽古タイマー</h1>
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-full ${btnSecondary} transition-colors`}
              aria-label={dark ? "ライトモード" : "ダークモード"}
            >
              {dark ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* ---- Preset selection ---- */}
          <section className="mb-6">
            <h2 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${muted}`}>
              プリセットメニュー
            </h2>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => loadPreset(p)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${card} hover:border-orange-400`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Saved custom menus */}
            {savedMenus.length > 0 && (
              <div className="mt-3">
                <h3 className={`text-xs font-semibold uppercase tracking-wide mb-1 ${muted}`}>
                  保存済みメニュー
                </h3>
                <div className="flex flex-wrap gap-2">
                  {savedMenus.map((m, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <button
                        onClick={() => loadSavedMenu(m)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${card} hover:border-orange-400`}
                      >
                        {m.label}
                      </button>
                      <button
                        onClick={() => deleteSavedMenu(i)}
                        className="text-red-400 hover:text-red-300 text-xs p-1"
                        aria-label="削除"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ---- Cloud-saved menus (logged in) ---- */}
          {!toolData.isLoading && (
            <section className="mb-6">
              {toolData.isLoggedIn ? (
                <div className={`rounded-xl border p-4 ${card}`}>
                  <button
                    onClick={() => setShowCloudSaveInput((v) => !v)}
                    className="flex items-center gap-2 text-sm font-semibold w-full"
                  >
                    <FaCloud className={accent} />
                    <span>マイデータ {toolData.items.length > 0 && `(${toolData.items.length})`}</span>
                    <svg
                      className={`w-3.5 h-3.5 ml-auto transition-transform ${showCloudSaveInput ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showCloudSaveInput && (
                    <div className="mt-3 space-y-3">
                      {/* Save current menu to cloud */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cloudSaveName}
                          onChange={(e) => setCloudSaveName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveCurrentMenuCloud()}
                          placeholder="メニュー名を入力"
                          className={`flex-1 px-3 py-1.5 rounded-md border text-sm ${
                            dark
                              ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                        <button
                          onClick={saveCurrentMenuCloud}
                          disabled={toolData.saving || !cloudSaveName.trim()}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium ${btnPrimary} disabled:opacity-40 transition-colors`}
                        >
                          {toolData.saving ? "保存中..." : "保存"}
                        </button>
                      </div>

                      {toolData.error && (
                        <p className="text-xs text-red-400">{toolData.error}</p>
                      )}

                      {/* Cloud-saved items */}
                      {toolData.fetching ? (
                        <p className={`text-xs ${muted}`}>読み込み中...</p>
                      ) : toolData.items.length === 0 ? (
                        <p className={`text-xs ${muted}`}>保存済みメニューはありません</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {toolData.items.map((item) => {
                            const segCount = item.data?.segments?.length ?? 0;
                            const total = item.data?.segments?.reduce((s: number, seg: any) => s + (seg.durationMin || 0), 0) ?? 0;
                            return (
                              <div key={item.id} className="flex items-center gap-1">
                                <button
                                  onClick={() => loadCloudMenu(item)}
                                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${card} hover:border-orange-400`}
                                  title={`${segCount}セグメント・${total}分`}
                                >
                                  <FaCloud className="inline mr-1 text-xs opacity-50" />
                                  {item.name}
                                </button>
                                <button
                                  onClick={() => toolData.deleteItem(item.id)}
                                  className="text-red-400 hover:text-red-300 text-xs p-1"
                                  aria-label="削除"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className={`text-xs ${muted}`}>
                  <Link href="/api/auth/signin" className="text-orange-500 hover:underline">
                    ログイン
                  </Link>
                  するとメニューをクラウドに保存できます
                </p>
              )}
            </section>
          )}

          {/* ---- Timer display ---- */}
          <section className={`rounded-xl border p-6 md:p-10 mb-6 text-center ${card}`}>
            {/* Current segment label */}
            <p className={`text-lg md:text-xl font-semibold mb-1 ${accent}`}>
              {currentSegment ? currentSegment.name : "---"}
            </p>
            <p className={`text-xs mb-4 ${muted}`}>
              {started
                ? `${currentIdx + 1} / ${segments.length} セグメント`
                : `全${segments.length}セグメント・合計${totalMinutes(segments)}分`}
            </p>

            {/* Big countdown */}
            <div
              className="font-mono font-bold leading-none mb-4"
              style={{ fontSize: "clamp(3rem, 12vw, 7rem)" }}
            >
              {formatTime(started ? remainSec : segments.length > 0 ? segments[0].durationMin * 60 : 0)}
            </div>

            {/* Segment progress */}
            <div className="w-full h-3 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${started ? segmentProgress : 0}%` }}
              />
            </div>
            <p className={`text-xs mb-4 ${muted}`}>セグメント進捗</p>

            {/* Overall progress */}
            <div className="w-full h-2 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${started ? overallProgress : 0}%` }}
              />
            </div>
            <p className={`text-xs mb-6 ${muted}`}>全体進捗</p>

            {/* Controls */}
            <div className="flex justify-center gap-3 flex-wrap">
              {!running ? (
                <button
                  onClick={handleStart}
                  disabled={segments.length === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg ${btnPrimary} disabled:opacity-40 transition-colors`}
                >
                  <FaPlay /> {started ? "再開" : "スタート"}
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg ${btnSecondary} transition-colors`}
                >
                  <FaPause /> 一時停止
                </button>
              )}
              <button
                onClick={handleSkip}
                disabled={!started || currentIdx + 1 >= segments.length}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${btnSecondary} disabled:opacity-40 transition-colors`}
              >
                <FaStepForward /> スキップ
              </button>
              <button
                onClick={handleReset}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${btnSecondary} transition-colors`}
              >
                <FaUndo /> リセット
              </button>
            </div>

            {/* Next up */}
            {started && nextSegment && (
              <p className={`mt-4 text-sm ${muted}`}>
                次: <span className="font-medium">{nextSegment.name}</span> ({nextSegment.durationMin}分)
              </p>
            )}
            {started && !nextSegment && currentIdx === segments.length - 1 && (
              <p className={`mt-4 text-sm ${muted}`}>これが最後のセグメントです</p>
            )}
          </section>

          {/* ---- Segment list / Editor ---- */}
          <section className={`rounded-xl border p-4 md:p-6 mb-6 ${card}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">メニュー構成</h2>
              <button
                onClick={() => setEditingCustom(!editingCustom)}
                className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md ${btnSecondary} transition-colors`}
              >
                {editingCustom ? <FaCheck /> : <FaEdit />}
                {editingCustom ? "完了" : "編集"}
              </button>
            </div>

            {/* Segment list */}
            <ul className="space-y-2 mb-4">
              {segments.map((seg, idx) => (
                <li
                  key={seg.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                    started && idx === currentIdx
                      ? "border-orange-500 bg-orange-500/10"
                      : started && idx < currentIdx
                      ? `border-transparent opacity-50`
                      : `border-transparent ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                        started && idx === currentIdx
                          ? "bg-orange-500 text-white"
                          : started && idx < currentIdx
                          ? "bg-green-500 text-white"
                          : dark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-medium">{seg.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${muted}`}>{seg.durationMin}分</span>
                    {editingCustom && !started && (
                      <>
                        <button
                          onClick={() => moveSegment(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 disabled:opacity-30"
                          aria-label="上に移動"
                        >
                          <FaArrowUp className="text-xs" />
                        </button>
                        <button
                          onClick={() => moveSegment(idx, 1)}
                          disabled={idx === segments.length - 1}
                          className="p-1 disabled:opacity-30"
                          aria-label="下に移動"
                        >
                          <FaArrowDown className="text-xs" />
                        </button>
                        <button
                          onClick={() => removeSegment(seg.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          aria-label="削除"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Add segment form */}
            {editingCustom && !started && (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="セグメント名"
                  className={`flex-1 px-3 py-2 rounded-md border text-sm ${
                    dark
                      ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={customMin}
                    onChange={(e) => setCustomMin(Math.max(1, Number(e.target.value)))}
                    className={`w-20 px-3 py-2 rounded-md border text-sm text-center ${
                      dark
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <span className={`text-sm ${muted}`}>分</span>
                </div>
                <button
                  onClick={addCustomSegment}
                  className={`flex items-center justify-center gap-1 px-4 py-2 rounded-md text-sm font-medium ${btnPrimary} transition-colors`}
                >
                  <FaPlus /> 追加
                </button>
              </div>
            )}
          </section>

          {/* ---- Save menu ---- */}
          <section className="mb-8">
            {!showSaveInput ? (
              <button
                onClick={() => setShowSaveInput(true)}
                disabled={segments.length === 0}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md ${btnSecondary} disabled:opacity-40 transition-colors`}
              >
                <FaSave /> 現在のメニューを保存
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={saveMenuName}
                  onChange={(e) => setSaveMenuName(e.target.value)}
                  placeholder="メニュー名を入力"
                  className={`flex-1 px-3 py-2 rounded-md border text-sm ${
                    dark
                      ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                  onKeyDown={(e) => e.key === "Enter" && saveCurrentMenu()}
                />
                <button
                  onClick={saveCurrentMenu}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${btnPrimary} transition-colors`}
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setShowSaveInput(false);
                    setSaveMenuName("");
                  }}
                  className={`px-3 py-2 rounded-md text-sm ${btnSecondary} transition-colors`}
                >
                  キャンセル
                </button>
              </div>
            )}
          </section>

          {/* ---- How to use ---- */}
          <section className={`rounded-xl border p-4 md:p-6 ${card}`}>
            <h2 className="font-bold text-lg mb-3">使い方</h2>
            <ol className={`list-decimal list-inside space-y-1 text-sm ${muted}`}>
              <li>プリセットメニューを選ぶか、編集ボタンでカスタムメニューを作成</li>
              <li>「スタート」ボタンで稽古開始。セグメントごとにカウントダウン</li>
              <li>セグメント終了時にビープ音でお知らせ</li>
              <li>一時停止・スキップ・リセットで柔軟に進行管理</li>
              <li>よく使うメニューは名前をつけて保存（ブラウザに記録）</li>
              <li>稽古場での視認性を上げるにはダークモードがおすすめ</li>
            </ol>
          </section>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
