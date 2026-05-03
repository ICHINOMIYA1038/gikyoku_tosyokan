import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import {
  FaCalendarAlt,
  FaCopy,
  FaCheck,
  FaPlus,
  FaTimes,
  FaTheaterMasks,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// ---------- Types ----------

interface Milestone {
  id: string;
  name: string;
  weekIndex: number; // 0-based from start
}

interface WeekSchedule {
  weekNumber: number;
  label: string;
  phase: string;
  dateRange: string;
  tasks: string[];
  tips: string;
  milestones: string[];
}

// ---------- Constants ----------

const MILESTONE_PRESETS = [
  "衣装合わせ",
  "小道具準備",
  "チラシ配布",
  "音響・照明打ち合わせ",
  "舞台セット搬入",
  "メイクリハーサル",
  "フライヤー入稿",
  "チケット販売開始",
];

const DAILY_MENU = [
  { name: "発声練習", minutes: 10, description: "腹式呼吸、滑舌、母音法など" },
  {
    name: "ウォームアップ",
    minutes: 10,
    description: "ストレッチ、体ほぐし、空間把握",
  },
  {
    name: "エチュード / 即興",
    minutes: 15,
    description: "テーマ即興、感情表現、関係性構築",
  },
  {
    name: "シーン稽古",
    minutes: 60,
    description: "場面ごとの演出確認、動線、セリフ合わせ",
  },
  {
    name: "振り返り",
    minutes: 10,
    description: "良かった点・改善点の共有、次回の目標設定",
  },
];

// ---------- Phase definitions ----------

function getPhases(totalWeeks: number) {
  if (totalWeeks <= 4) {
    return [
      { phase: "読み合わせ", weeks: 1 },
      { phase: "立ち稽古", weeks: 1 },
      { phase: "通し稽古", weeks: 1 },
      { phase: "ゲネプロ・本番", weeks: 1 },
    ];
  }
  if (totalWeeks <= 6) {
    return [
      { phase: "読み合わせ（台本読み）", weeks: 1 },
      { phase: "立ち稽古（ブロッキング）", weeks: 2 },
      { phase: "通し稽古", weeks: 2 },
      { phase: "ゲネプロ・本番", weeks: 1 },
    ];
  }
  if (totalWeeks <= 8) {
    return [
      { phase: "読み合わせ（台本読み）", weeks: 2 },
      { phase: "立ち稽古（ブロッキング）", weeks: 2 },
      { phase: "通し稽古", weeks: 2 },
      { phase: "ゲネプロ・リハーサル", weeks: 1 },
      { phase: "本番", weeks: 1 },
    ];
  }
  // 9-12 weeks
  const extraWeeks = totalWeeks - 8;
  const readWeeks = 2 + Math.floor(extraWeeks / 3);
  const blockWeeks = 2 + Math.floor((extraWeeks - Math.floor(extraWeeks / 3)) / 2);
  const runWeeks = totalWeeks - readWeeks - blockWeeks - 2;
  return [
    { phase: "読み合わせ（台本読み）", weeks: readWeeks },
    { phase: "立ち稽古（ブロッキング）", weeks: blockWeeks },
    { phase: "通し稽古", weeks: runWeeks },
    { phase: "ゲネプロ・リハーサル", weeks: 1 },
    { phase: "本番", weeks: 1 },
  ];
}

const PHASE_TASKS: Record<string, string[]> = {
  "読み合わせ（台本読み）": [
    "台本の通読・役の把握",
    "キャラクター分析・人物関係の整理",
    "テーマ・演出方針の共有",
    "セリフの暗記開始",
  ],
  "読み合わせ": [
    "台本の通読・セリフ暗記",
    "キャラクター分析・演出方針確認",
  ],
  "立ち稽古（ブロッキング）": [
    "動線（ブロッキング）の決定",
    "場面転換の段取り確認",
    "セリフと動きの連動練習",
    "小道具を使った稽古開始",
  ],
  "立ち稽古": [
    "動線の決定・セリフと動きの連動",
    "場面転換の段取り確認",
  ],
  "通し稽古": [
    "全編通しでの稽古",
    "テンポ・間の調整",
    "音響・照明のきっかけ確認",
    "衣装・小道具の最終確認",
  ],
  "ゲネプロ・リハーサル": [
    "本番同様の通し稽古（ゲネプロ）",
    "音響・照明・舞台転換の最終チェック",
    "タイムキーピング",
    "緊急時の対応確認",
  ],
  "ゲネプロ・本番": [
    "本番同様の通し稽古",
    "音響・照明の最終チェック",
    "本番！",
  ],
  "本番": [
    "開場準備・最終確認",
    "本番上演",
    "片付け・打ち上げ",
  ],
};

const PHASE_TIPS: Record<string, string> = {
  "読み合わせ（台本読み）":
    "この段階では台本を深く理解することが大切。役者同士で自由に意見交換しましょう。",
  "読み合わせ":
    "台本を深く理解し、セリフの暗記を進めましょう。",
  "立ち稽古（ブロッキング）":
    "動きが決まらないうちはセリフが不安定になりがち。焦らず一場面ずつ固めましょう。",
  "立ち稽古":
    "動きとセリフを一場面ずつ固めていきましょう。",
  "通し稽古":
    "通し稽古では止めずに最後まで。気になった点はメモして稽古後にまとめて修正。",
  "ゲネプロ・リハーサル":
    "本番と全く同じ条件で行いましょう。ミスがあっても止めずに続けること。",
  "ゲネプロ・本番":
    "本番と同じ条件で通し、ミスがあっても止めない。本番は楽しんで！",
  "本番":
    "緊張は当然のこと。仲間を信じて、楽しんで演じましょう！",
};

const PHASE_COLORS: Record<string, string> = {
  "読み合わせ（台本読み）": "bg-blue-50 border-blue-300",
  "読み合わせ": "bg-blue-50 border-blue-300",
  "立ち稽古（ブロッキング）": "bg-yellow-50 border-yellow-300",
  "立ち稽古": "bg-yellow-50 border-yellow-300",
  "通し稽古": "bg-green-50 border-green-300",
  "ゲネプロ・リハーサル": "bg-orange-50 border-orange-300",
  "ゲネプロ・本番": "bg-orange-50 border-orange-300",
  "本番": "bg-red-50 border-red-300",
};

const PHASE_BADGE_COLORS: Record<string, string> = {
  "読み合わせ（台本読み）": "bg-blue-100 text-blue-800",
  "読み合わせ": "bg-blue-100 text-blue-800",
  "立ち稽古（ブロッキング）": "bg-yellow-100 text-yellow-800",
  "立ち稽古": "bg-yellow-100 text-yellow-800",
  "通し稽古": "bg-green-100 text-green-800",
  "ゲネプロ・リハーサル": "bg-orange-100 text-orange-800",
  "ゲネプロ・本番": "bg-orange-100 text-orange-800",
  "本番": "bg-red-100 text-red-800",
};

// ---------- Helpers ----------

function formatDate(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const day = dayNames[date.getDay()];
  return `${m}/${d}(${day})`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toInputDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ---------- Component ----------

export default function ScheduleGenerator() {
  // Default: 8 weeks from today
  const defaultPerformanceDate = addDays(new Date(), 56);
  const [performanceDate, setPerformanceDate] = useState(
    toInputDateString(defaultPerformanceDate)
  );
  const [totalWeeks, setTotalWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneWeek, setNewMilestoneWeek] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showDailyMenu, setShowDailyMenu] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const schedule = useMemo((): WeekSchedule[] => {
    const perfDate = new Date(performanceDate + "T00:00:00");
    if (isNaN(perfDate.getTime())) return [];

    const phases = getPhases(totalWeeks);
    const startDate = addDays(perfDate, -(totalWeeks * 7) + 1);
    const result: WeekSchedule[] = [];

    let weekIndex = 0;
    for (const p of phases) {
      for (let w = 0; w < p.weeks; w++) {
        const weekStart = addDays(startDate, weekIndex * 7);
        const weekEnd = addDays(weekStart, 6);
        const weekMilestones = milestones
          .filter((m) => m.weekIndex === weekIndex)
          .map((m) => m.name);

        result.push({
          weekNumber: weekIndex + 1,
          label: `第${weekIndex + 1}週`,
          phase: p.phase,
          dateRange: `${formatDate(weekStart)} 〜 ${formatDate(weekEnd)}`,
          tasks: PHASE_TASKS[p.phase] || [],
          tips: PHASE_TIPS[p.phase] || "",
          milestones: weekMilestones,
        });
        weekIndex++;
      }
    }
    return result;
  }, [performanceDate, totalWeeks, milestones]);

  const addMilestone = useCallback(() => {
    if (!newMilestoneName.trim()) return;
    const id = `ms-${Date.now()}`;
    setMilestones((prev) => [
      ...prev,
      { id, name: newMilestoneName.trim(), weekIndex: newMilestoneWeek - 1 },
    ]);
    setNewMilestoneName("");
  }, [newMilestoneName, newMilestoneWeek]);

  const addPresetMilestone = useCallback(
    (name: string) => {
      const id = `ms-${Date.now()}-${Math.random()}`;
      // Place at a reasonable default week
      const defaultWeek = Math.max(1, totalWeeks - 2);
      setMilestones((prev) => [
        ...prev,
        { id, name, weekIndex: defaultWeek - 1 },
      ]);
    },
    [totalWeeks]
  );

  const removeMilestone = useCallback((id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const handleCopyToClipboard = useCallback(async () => {
    if (schedule.length === 0) return;
    const lines: string[] = [];
    lines.push("=== 文化祭演劇スケジュール ===");
    lines.push(`本番日: ${performanceDate}`);
    lines.push(`準備期間: ${totalWeeks}週間 / 週${daysPerWeek}日稽古`);
    lines.push("");

    for (const week of schedule) {
      lines.push(`■ ${week.label}【${week.phase}】`);
      lines.push(`  ${week.dateRange}`);
      for (const task of week.tasks) {
        lines.push(`  ・${task}`);
      }
      if (week.milestones.length > 0) {
        for (const ms of week.milestones) {
          lines.push(`  ★ ${ms}`);
        }
      }
      lines.push(`  💡 ${week.tips}`);
      lines.push("");
    }

    lines.push("--- 1日の稽古メニュー（目安） ---");
    for (const item of DAILY_MENU) {
      lines.push(`${item.name}: ${item.minutes}分 … ${item.description}`);
    }
    lines.push("");
    lines.push("作成: 戯曲図書館 https://gikyokutosyokan.com/tools/schedule-generator");

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = lines.join("\n");
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [schedule, performanceDate, totalWeeks, daysPerWeek]);

  const totalMinutes = DAILY_MENU.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <Layout>
      <Seo
        pageTitle="文化祭の演劇スケジュール自動作成"
        pageDescription="文化祭や学園祭の演劇に向けた稽古スケジュールを自動生成。本番日から逆算して、読み合わせ・立ち稽古・通し稽古・ゲネプロまでの週別計画を作成できます。"
        pagePath="/tools/schedule-generator"
        pageKeywords={[
          "文化祭",
          "演劇",
          "スケジュール",
          "稽古",
          "リハーサル",
          "学園祭",
          "高校演劇",
          "練習計画",
        ]}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 mb-2">
            <FaTheaterMasks />
            <span>演劇ツール</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            文化祭演劇スケジュール表ジェネレーター
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            本番日から逆算して、週ごとの稽古スケジュールを自動作成します
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-gray-600" />
            基本設定
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Performance Date */}
            <div>
              <label
                htmlFor="perfDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                本番日
              </label>
              <input
                id="perfDate"
                type="date"
                value={performanceDate}
                onChange={(e) => setPerformanceDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Total Weeks */}
            <div>
              <label
                htmlFor="totalWeeks"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                準備期間（週）
              </label>
              <select
                id="totalWeeks"
                value={totalWeeks}
                onChange={(e) => setTotalWeeks(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {Array.from({ length: 9 }, (_, i) => i + 4).map((w) => (
                  <option key={w} value={w}>
                    {w}週間
                  </option>
                ))}
              </select>
            </div>

            {/* Days Per Week */}
            <div>
              <label
                htmlFor="daysPerWeek"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                稽古日数 / 週
              </label>
              <select
                id="daysPerWeek"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {[2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    週{d}日
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            合計稽古日数の目安:{" "}
            <span className="font-bold text-gray-800">
              約{totalWeeks * daysPerWeek}日
            </span>
            {"　"}| 1日あたり{" "}
            <span className="font-bold text-gray-800">{totalMinutes}分</span> の
            稽古メニュー
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
          <button
            onClick={() => setShowMilestoneForm(!showMilestoneForm)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaPlus className="text-gray-600 text-sm" />
              マイルストーンを追加（任意）
            </h2>
            {showMilestoneForm ? (
              <FaChevronUp className="text-gray-400" />
            ) : (
              <FaChevronDown className="text-gray-400" />
            )}
          </button>

          {showMilestoneForm && (
            <div className="mt-4">
              {/* Preset buttons */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">
                  よく使うマイルストーン（クリックで追加）
                </p>
                <div className="flex flex-wrap gap-2">
                  {MILESTONE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => addPresetMilestone(preset)}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom milestone */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newMilestoneName}
                  onChange={(e) => setNewMilestoneName(e.target.value)}
                  placeholder="マイルストーン名"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addMilestone();
                  }}
                />
                <select
                  value={newMilestoneWeek}
                  onChange={(e) => setNewMilestoneWeek(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(
                    (w) => (
                      <option key={w} value={w}>
                        第{w}週
                      </option>
                    )
                  )}
                </select>
                <button
                  onClick={addMilestone}
                  disabled={!newMilestoneName.trim()}
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  追加
                </button>
              </div>

              {/* Current milestones */}
              {milestones.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {milestones.map((ms) => (
                    <span
                      key={ms.id}
                      className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-3 py-1"
                    >
                      第{ms.weekIndex + 1}週: {ms.name}
                      <button
                        onClick={() => removeMilestone(ms.id)}
                        className="ml-1 text-purple-400 hover:text-purple-700"
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Generated Schedule */}
        {schedule.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">スケジュール</h2>
              <button
                onClick={handleCopyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <FaCheck className="text-green-500" />
                    コピーしました
                  </>
                ) : (
                  <>
                    <FaCopy />
                    テキストをコピー
                  </>
                )}
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {schedule.map((week, index) => {
                const isLast = index === schedule.length - 1;
                const colorClass =
                  PHASE_COLORS[week.phase] || "bg-gray-50 border-gray-300";
                const badgeClass =
                  PHASE_BADGE_COLORS[week.phase] || "bg-gray-100 text-gray-800";

                return (
                  <div key={week.weekNumber} className="relative flex">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center mr-4 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center z-10">
                        {week.weekNumber}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 bg-gray-300 flex-1 min-h-[16px]" />
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className={`flex-1 mb-4 rounded-lg border-l-4 p-4 ${colorClass}`}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-bold text-sm">
                          {week.label}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}
                        >
                          {week.phase}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        {week.dateRange} ・ 週{daysPerWeek}日稽古
                      </p>

                      <ul className="space-y-1 mb-2">
                        {week.tasks.map((task, ti) => (
                          <li
                            key={ti}
                            className="text-sm text-gray-700 flex items-start gap-1.5"
                          >
                            <span className="text-gray-400 mt-0.5 shrink-0">
                              ・
                            </span>
                            {task}
                          </li>
                        ))}
                      </ul>

                      {/* Milestones */}
                      {week.milestones.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {week.milestones.map((ms, mi) => (
                            <span
                              key={mi}
                              className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 rounded-full px-2.5 py-0.5 font-medium"
                            >
                              ★ {ms}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-500 italic">
                        {week.tips}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Daily Rehearsal Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
          <button
            onClick={() => setShowDailyMenu(!showDailyMenu)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-bold">1日の稽古メニュー（目安）</h2>
            {showDailyMenu ? (
              <FaChevronUp className="text-gray-400" />
            ) : (
              <FaChevronDown className="text-gray-400" />
            )}
          </button>

          {showDailyMenu && (
            <div className="mt-4">
              <div className="space-y-3">
                {DAILY_MENU.map((item, i) => {
                  // Compute cumulative time for visual bar
                  const totalSoFar = DAILY_MENU.slice(0, i + 1).reduce(
                    (s, m) => s + m.minutes,
                    0
                  );
                  const pct = (totalSoFar / totalMinutes) * 100;

                  return (
                    <div key={i} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {item.name}
                        </span>
                        <span className="text-sm font-bold text-gray-600">
                          {item.minutes}分
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                        <div
                          className="h-2 rounded-full bg-gray-400 transition-all"
                          style={{
                            width: `${(item.minutes / totalMinutes) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
                合計: <span className="font-bold">{totalMinutes}分</span>（約
                {Math.floor(totalMinutes / 60)}時間
                {totalMinutes % 60 > 0 ? `${totalMinutes % 60}分` : ""}）
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-8">
          <h2 className="text-lg font-bold mb-3">
            文化祭演劇を成功させるコツ
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5 shrink-0">1.</span>
              <span>
                <strong>早めの台本決定</strong>が最重要。
                準備期間の1週目には台本が確定していることが理想です。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5 shrink-0">2.</span>
              <span>
                <strong>毎回の稽古に目標</strong>を設定しましょう。
                「今日は第2場を完成させる」など具体的に。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5 shrink-0">3.</span>
              <span>
                <strong>裏方の準備は稽古と並行</strong>で。
                音響・照明・衣装・小道具は早めに担当を決めましょう。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5 shrink-0">4.</span>
              <span>
                <strong>通し稽古は録画</strong>するのがおすすめ。
                客観的に見返すことで改善点が見つかります。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5 shrink-0">5.</span>
              <span>
                台本探しは{" "}
                <Link href="/" className="text-blue-600 hover:underline">
                  戯曲図書館のトップページ
                </Link>{" "}
                から。人数・上演時間で検索できます。
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
