import React, { useState, useMemo, useCallback } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import ToolsSidebar from "@/components/ToolsSidebar";
import {
  FaUsers,
  FaTheaterMasks,
  FaCalendarDay,
  FaPlus,
  FaTimes,
  FaMagic,
  FaCopy,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";

// ---------- Types ----------

interface CastMember {
  id: string;
  name: string;
}

interface Scene {
  id: string;
  name: string;
  castIds: string[];
  targetCount: number;
}

interface ScheduleEntry {
  sceneId: string;
  presentCastIds: string[];
  absentCastIds: string[];
  coverage: number;
}

interface DaySchedule {
  date: string;
  entries: ScheduleEntry[];
}

interface OptimizationResult {
  schedule: DaySchedule[];
  unmet: { sceneId: string; assigned: number; target: number }[];
}

// ---------- Utils ----------

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function expandDateRange(start: string, end: string): string[] {
  if (!start || !end) return [];
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return [];
  const days: string[] = [];
  const cursor = new Date(s);
  while (cursor <= e) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    days.push(`${y}-${m}-${d}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${Number(m)}/${Number(d)}(${weekday})`;
}

function coverageMark(coverage: number): { mark: string; color: string; label: string } {
  if (coverage >= 0.999) return { mark: "◎", color: "text-emerald-600", label: "全員出席" };
  if (coverage >= 0.75) return { mark: "○", color: "text-blue-600", label: "ほぼ揃う" };
  if (coverage >= 0.5) return { mark: "△", color: "text-amber-600", label: "半数以上" };
  return { mark: "×", color: "text-rose-600", label: "出席少" };
}

// ---------- Optimizer ----------

function optimize(
  scenes: Scene[],
  days: string[],
  ngMap: Record<string, Set<string>>, // castId -> set of NG dates
  maxScenesPerDay: number,
): OptimizationResult {
  if (scenes.length === 0 || days.length === 0) {
    return { schedule: days.map((d) => ({ date: d, entries: [] })), unmet: [] };
  }

  type Candidate = {
    sceneId: string;
    date: string;
    coverage: number;
    presentCastIds: string[];
    absentCastIds: string[];
  };

  const candidates: Candidate[] = [];
  for (const scene of scenes) {
    if (scene.castIds.length === 0) continue;
    for (const date of days) {
      const present: string[] = [];
      const absent: string[] = [];
      for (const cid of scene.castIds) {
        const ng = ngMap[cid];
        if (ng && ng.has(date)) absent.push(cid);
        else present.push(cid);
      }
      candidates.push({
        sceneId: scene.id,
        date,
        coverage: present.length / scene.castIds.length,
        presentCastIds: present,
        absentCastIds: absent,
      });
    }
  }

  // Sort by coverage desc, then by date asc for stable spread
  candidates.sort((a, b) => {
    if (b.coverage !== a.coverage) return b.coverage - a.coverage;
    return a.date.localeCompare(b.date);
  });

  const assignedCount: Record<string, number> = {};
  const dayUsage: Record<string, number> = {};
  const dayHasScene: Record<string, Set<string>> = {};
  const scheduleMap: Record<string, ScheduleEntry[]> = {};
  for (const d of days) {
    scheduleMap[d] = [];
    dayUsage[d] = 0;
    dayHasScene[d] = new Set();
  }

  for (const c of candidates) {
    const scene = scenes.find((s) => s.id === c.sceneId);
    if (!scene) continue;
    const cnt = assignedCount[c.sceneId] ?? 0;
    if (cnt >= scene.targetCount) continue;
    if (dayUsage[c.date] >= maxScenesPerDay) continue;
    if (dayHasScene[c.date].has(c.sceneId)) continue; // same scene not twice on same day
    if (c.coverage === 0) continue; // no point rehearsing with nobody

    scheduleMap[c.date].push({
      sceneId: c.sceneId,
      presentCastIds: c.presentCastIds,
      absentCastIds: c.absentCastIds,
      coverage: c.coverage,
    });
    assignedCount[c.sceneId] = cnt + 1;
    dayUsage[c.date] += 1;
    dayHasScene[c.date].add(c.sceneId);
  }

  const schedule: DaySchedule[] = days.map((d) => ({
    date: d,
    entries: scheduleMap[d].sort((a, b) => b.coverage - a.coverage),
  }));

  const unmet = scenes
    .map((s) => ({
      sceneId: s.id,
      assigned: assignedCount[s.id] ?? 0,
      target: s.targetCount,
    }))
    .filter((s) => s.assigned < s.target);

  return { schedule, unmet };
}

// ---------- Component ----------

const DEFAULT_CAST: CastMember[] = [
  { id: uid(), name: "山田" },
  { id: uid(), name: "鈴木" },
  { id: uid(), name: "佐藤" },
];

export default function RehearsalOptimizer() {
  const [cast, setCast] = useState<CastMember[]>(DEFAULT_CAST);
  const [scenes, setScenes] = useState<Scene[]>([
    { id: uid(), name: "第1場", castIds: [DEFAULT_CAST[0].id, DEFAULT_CAST[1].id], targetCount: 3 },
    { id: uid(), name: "第2場", castIds: [DEFAULT_CAST[1].id, DEFAULT_CAST[2].id], targetCount: 3 },
  ]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ngMap, setNgMap] = useState<Record<string, Set<string>>>({});
  const [maxScenesPerDay, setMaxScenesPerDay] = useState(3);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const days = useMemo(() => expandDateRange(startDate, endDate), [startDate, endDate]);

  const castNameMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of cast) m[c.id] = c.name;
    return m;
  }, [cast]);

  const sceneNameMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of scenes) m[s.id] = s.name;
    return m;
  }, [scenes]);

  // ---- Cast handlers ----
  const addCast = () => setCast((prev) => [...prev, { id: uid(), name: "" }]);
  const updateCastName = (id: string, name: string) =>
    setCast((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  const removeCast = (id: string) => {
    setCast((prev) => prev.filter((c) => c.id !== id));
    setScenes((prev) =>
      prev.map((s) => ({ ...s, castIds: s.castIds.filter((cid) => cid !== id) })),
    );
    setNgMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // ---- Scene handlers ----
  const addScene = () =>
    setScenes((prev) => [...prev, { id: uid(), name: "", castIds: [], targetCount: 3 }]);
  const updateScene = (id: string, patch: Partial<Scene>) =>
    setScenes((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const toggleSceneCast = (sceneId: string, castId: string) =>
    setScenes((prev) =>
      prev.map((s) => {
        if (s.id !== sceneId) return s;
        const has = s.castIds.includes(castId);
        return {
          ...s,
          castIds: has ? s.castIds.filter((c) => c !== castId) : [...s.castIds, castId],
        };
      }),
    );
  const removeScene = (id: string) => setScenes((prev) => prev.filter((s) => s.id !== id));

  // ---- NG day handlers ----
  const toggleNg = (castId: string, date: string) =>
    setNgMap((prev) => {
      const set = new Set(prev[castId] ?? []);
      if (set.has(date)) set.delete(date);
      else set.add(date);
      return { ...prev, [castId]: set };
    });

  // ---- Run ----
  const runOptimize = useCallback(() => {
    const cleaned = scenes
      .filter((s) => s.name.trim() && s.castIds.length > 0)
      .map((s) => ({ ...s, targetCount: Math.max(1, s.targetCount) }));
    setResult(optimize(cleaned, days, ngMap, Math.max(1, maxScenesPerDay)));
  }, [scenes, days, ngMap, maxScenesPerDay]);

  const copyResult = useCallback(() => {
    if (!result) return;
    const lines: string[] = ["稽古スケジュール（最適化結果）", ""];
    for (const day of result.schedule) {
      if (day.entries.length === 0) continue;
      lines.push(`■ ${formatDate(day.date)}`);
      for (const e of day.entries) {
        const m = coverageMark(e.coverage);
        const present = e.presentCastIds.map((id) => castNameMap[id]).join(", ");
        const absent = e.absentCastIds.map((id) => castNameMap[id]).join(", ");
        lines.push(`  ${m.mark} ${sceneNameMap[e.sceneId]}　出席: ${present}${absent ? `／欠席: ${absent}` : ""}`);
      }
      lines.push("");
    }
    if (result.unmet.length > 0) {
      lines.push("【未達シーン】");
      for (const u of result.unmet) {
        lines.push(`  - ${sceneNameMap[u.sceneId]}: ${u.assigned}/${u.target} 回`);
      }
      lines.push("");
    }
    lines.push("生成: 戯曲図書館 稽古効率最適化ツール");
    lines.push("https://gikyokutosyokan.com/tools/rehearsal-optimizer");
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result, castNameMap, sceneNameMap]);

  const totalAssignments = useMemo(() => {
    if (!result) return 0;
    return result.schedule.reduce((acc, d) => acc + d.entries.length, 0);
  }, [result]);

  const totalTarget = useMemo(
    () => scenes.reduce((acc, s) => acc + (s.castIds.length > 0 && s.name.trim() ? s.targetCount : 0), 0),
    [scenes],
  );

  return (
    <Layout>
      <Seo
        pageTitle="稽古効率最適化ツール — 出演者の都合から最適な稽古スケジュールを自動生成"
        pageDescription="出演者・シーン・各メンバーのNG日を入力すると、出席率が最大になるように稽古スケジュールを自動最適化。少人数シーンを同日にまとめるなど、限られた稽古時間を有効活用できます。"
        pagePath="/tools/rehearsal-optimizer"
        pageKeywords={[
          "稽古",
          "稽古スケジュール",
          "稽古効率",
          "演劇",
          "シーン稽古",
          "出席最適化",
          "演劇ツール",
        ]}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <ToolsSidebar currentTool="rehearsal-optimizer" />
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                稽古効率最適化ツール
              </h1>
              <p className="text-gray-600">
                出演者・シーン・各メンバーのNG日から、出席率の高い稽古スケジュールを自動で組み立てます。
              </p>
            </div>

            {/* Usage guide */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h2 className="font-bold text-purple-900 mb-2 text-sm flex items-center gap-2">
                <FaInfoCircle /> 使い方
              </h2>
              <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                <li>出演者を登録</li>
                <li>シーンを登録し、各シーンの出演者と目標稽古回数を設定</li>
                <li>稽古候補日（期間）と各メンバーのNG日を指定</li>
                <li>「最適化を実行」を押すと、出席率が最大化されるスケジュールが出力されます</li>
              </ol>
            </div>

            {/* Cast section */}
            <section className="mb-8">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaUsers className="text-purple-500" /> 1. 出演者
              </h2>
              <div className="space-y-2">
                {cast.map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCastName(c.id, e.target.value)}
                      placeholder="出演者名"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      onClick={() => removeCast(c.id)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      aria-label="出演者を削除"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addCast}
                className="mt-3 inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                <FaPlus /> 出演者を追加
              </button>
            </section>

            {/* Scenes section */}
            <section className="mb-8">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaTheaterMasks className="text-indigo-500" /> 2. シーン
              </h2>
              <div className="space-y-3">
                {scenes.map((s) => (
                  <div key={s.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => updateScene(s.id, { name: e.target.value })}
                        placeholder="シーン名（例: 第1場、冒頭）"
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <label className="text-xs text-gray-500 whitespace-nowrap">
                        目標
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={s.targetCount}
                          onChange={(e) =>
                            updateScene(s.id, { targetCount: Number(e.target.value) || 1 })
                          }
                          className="ml-1 w-14 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        回
                      </label>
                      <button
                        onClick={() => removeScene(s.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                        aria-label="シーンを削除"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cast.length === 0 && (
                        <span className="text-xs text-gray-400">先に出演者を登録してください</span>
                      )}
                      {cast.map((c) => {
                        const active = s.castIds.includes(c.id);
                        return (
                          <button
                            key={c.id}
                            onClick={() => toggleSceneCast(s.id, c.id)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                              active
                                ? "bg-indigo-500 text-white border-indigo-500"
                                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                            }`}
                          >
                            {c.name || "（名前未入力）"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={addScene}
                className="mt-3 inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <FaPlus /> シーンを追加
              </button>
            </section>

            {/* Date range section */}
            <section className="mb-8">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaCalendarDay className="text-emerald-500" /> 3. 稽古候補期間 & NG日
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <label className="text-sm text-gray-700">
                  開始
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  終了
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  1日あたり最大シーン数
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxScenesPerDay}
                    onChange={(e) => setMaxScenesPerDay(Number(e.target.value) || 1)}
                    className="ml-2 w-16 border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </label>
              </div>

              {days.length > 0 && cast.length > 0 && (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left font-medium text-gray-600 sticky left-0 bg-gray-50 z-10">
                          出演者 \ 日付
                        </th>
                        {days.map((d) => (
                          <th key={d} className="px-2 py-2 text-center font-medium text-gray-600 whitespace-nowrap">
                            {formatDate(d)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cast.map((c) => (
                        <tr key={c.id} className="border-t border-gray-200">
                          <td className="px-2 py-1.5 font-medium text-gray-800 sticky left-0 bg-white whitespace-nowrap">
                            {c.name || "（名前未入力）"}
                          </td>
                          {days.map((d) => {
                            const ng = ngMap[c.id]?.has(d) ?? false;
                            return (
                              <td key={d} className="px-1 py-1 text-center">
                                <button
                                  onClick={() => toggleNg(c.id, d)}
                                  className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                                    ng
                                      ? "bg-rose-500 text-white"
                                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  }`}
                                  aria-label={ng ? "NGを解除" : "NGに設定"}
                                >
                                  {ng ? "×" : "○"}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {(days.length === 0 || cast.length === 0) && (
                <p className="text-sm text-gray-500">
                  期間と出演者を入力するとNG日カレンダーが表示されます。
                </p>
              )}
            </section>

            {/* Run button */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={runOptimize}
                disabled={days.length === 0 || scenes.length === 0 || cast.length === 0}
                className="inline-flex items-center gap-2 bg-purple-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FaMagic /> 最適化を実行
              </button>
              {result && (
                <button
                  onClick={copyResult}
                  className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
                  {copied ? "コピーしました" : "結果をコピー"}
                </button>
              )}
              {result && (
                <span className="text-sm text-gray-500">
                  割当: {totalAssignments} / 目標: {totalTarget} 回
                </span>
              )}
            </div>

            {/* Result */}
            {result && (
              <section className="mb-8">
                <h2 className="font-bold text-gray-900 mb-3">最適化結果</h2>

                {result.unmet.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-amber-900 font-medium mb-2">
                      以下のシーンは目標回数に達しませんでした
                    </p>
                    <ul className="text-sm text-amber-800 list-disc list-inside space-y-0.5">
                      {result.unmet.map((u) => (
                        <li key={u.sceneId}>
                          {sceneNameMap[u.sceneId]}: {u.assigned} / {u.target} 回
                          <span className="text-xs text-amber-600 ml-2">
                            （NG日が多いか、1日の最大シーン数の制約による）
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  {result.schedule.map((day) => (
                    <div
                      key={day.date}
                      className={`border rounded-lg p-3 ${
                        day.entries.length === 0
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="font-bold text-gray-800 mb-2 text-sm">
                        {formatDate(day.date)}
                        {day.entries.length === 0 && (
                          <span className="ml-2 text-xs text-gray-400 font-normal">休稽古</span>
                        )}
                      </div>
                      {day.entries.length > 0 && (
                        <div className="space-y-1.5">
                          {day.entries.map((e, idx) => {
                            const m = coverageMark(e.coverage);
                            return (
                              <div
                                key={idx}
                                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm"
                              >
                                <span className={`font-bold text-lg ${m.color}`}>{m.mark}</span>
                                <span className="font-medium text-gray-900">
                                  {sceneNameMap[e.sceneId]}
                                </span>
                                <span className="text-xs text-gray-500">
                                  出席率 {Math.round(e.coverage * 100)}%
                                </span>
                                <span className="text-xs text-gray-700">
                                  出席: {e.presentCastIds.map((id) => castNameMap[id]).join(", ")}
                                </span>
                                {e.absentCastIds.length > 0 && (
                                  <span className="text-xs text-rose-600">
                                    欠席: {e.absentCastIds.map((id) => castNameMap[id]).join(", ")}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="text-xs text-gray-400 mt-8">
              ※
              本ツールは入力情報をブラウザ内でのみ処理します。サーバーに送信・保存されることはありません。
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
