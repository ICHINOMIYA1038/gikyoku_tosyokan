import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import { useSession } from "next-auth/react";
import {
  FaCalendarAlt,
  FaCopy,
  FaCheck,
  FaPlus,
  FaTimes,
  FaTheaterMasks,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaTrash,
} from "react-icons/fa";

// ---------- Types ----------

interface Milestone {
  id: string;
  name: string;
  weekIndex: number;
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

interface SavedSchedule {
  id: number;
  name: string;
  data: string;
  updatedAt: string;
}

interface ScheduleConfig {
  performanceDate: string;
  totalWeeks: number;
  daysPerWeek: number;
  milestones: Milestone[];
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
  const extraWeeks = totalWeeks - 8;
  const readWeeks = 2 + Math.floor(extraWeeks / 3);
  const blockWeeks =
    2 + Math.floor((extraWeeks - Math.floor(extraWeeks / 3)) / 2);
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
  "本番": ["開場準備・最終確認", "本番上演", "片付け・打ち上げ"],
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
  "本番": "緊張は当然のこと。仲間を信じて、楽しんで演じましょう！",
};

// Simplified: left border color per phase, muted tones
const PHASE_BORDER: Record<string, string> = {
  "読み合わせ（台本読み）": "border-l-blue-400",
  "読み合わせ": "border-l-blue-400",
  "立ち稽古（ブロッキング）": "border-l-amber-400",
  "立ち稽古": "border-l-amber-400",
  "通し稽古": "border-l-emerald-400",
  "ゲネプロ・リハーサル": "border-l-orange-400",
  "ゲネプロ・本番": "border-l-orange-400",
  "本番": "border-l-red-400",
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
  const { data: session } = useSession();
  const router = useRouter();
  const defaultPerformanceDate = addDays(new Date(), 56);

  const [performanceDate, setPerformanceDate] = useState(
    toInputDateString(defaultPerformanceDate)
  );
  const [totalWeeks, setTotalWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [copied, setCopied] = useState(false);

  // Collapsed sections
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDailyMenu, setShowDailyMenu] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Milestone form
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneWeek, setNewMilestoneWeek] = useState(1);

  // Save/load state
  const [savedSchedules, setSavedSchedules] = useState<SavedSchedule[]>([]);
  const [saveName, setSaveName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load saved schedules on mount (if logged in)
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/tool-data?toolType=schedule")
      .then((r) => r.json())
      .then((data) => {
        if (data.items) setSavedSchedules(data.items);
      })
      .catch(() => {});
  }, [session]);

  // Auto-load from ?load=ID query parameter
  useEffect(() => {
    const loadId = router.query.load;
    if (!loadId || !session?.user) return;
    fetch(`/api/tool-data?toolType=schedule`)
      .then((r) => r.json())
      .then((data) => {
        const items = data.items || [];
        const target = items.find((item: any) => item.id === Number(loadId));
        if (target) {
          const config: ScheduleConfig =
            typeof target.data === "string" ? JSON.parse(target.data) : target.data;
          setPerformanceDate(config.performanceDate);
          setTotalWeeks(config.totalWeeks);
          setDaysPerWeek(config.daysPerWeek);
          setMilestones(config.milestones || []);
        }
      })
      .catch(() => {});
  }, [router.query.load, session]);

  // Generate schedule (always, no button needed)
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

  const handleSave = useCallback(async () => {
    if (!saveName.trim()) return;
    const config: ScheduleConfig = {
      performanceDate,
      totalWeeks,
      daysPerWeek,
      milestones,
    };
    try {
      const res = await fetch("/api/tool-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: "schedule",
          name: saveName.trim(),
          data: config,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setSaveStatus(json.action === "updated" ? "更新しました" : "保存しました");
        setSaveName("");
        setShowSaveForm(false);
        // Refresh list
        const listRes = await fetch("/api/tool-data?toolType=schedule");
        const listData = await listRes.json();
        if (listData.items) setSavedSchedules(listData.items);
      } else {
        setSaveStatus("保存に失敗しました");
      }
    } catch {
      setSaveStatus("保存に失敗しました");
    }
    setTimeout(() => setSaveStatus(null), 2000);
  }, [saveName, performanceDate, totalWeeks, daysPerWeek, milestones]);

  const handleLoad = useCallback((item: SavedSchedule) => {
    try {
      const config: ScheduleConfig =
        typeof item.data === "string" ? JSON.parse(item.data) : item.data;
      setPerformanceDate(config.performanceDate);
      setTotalWeeks(config.totalWeeks);
      setDaysPerWeek(config.daysPerWeek);
      setMilestones(config.milestones || []);
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await fetch(`/api/tool-data?id=${id}`, { method: "DELETE" });
      setSavedSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    }
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
    lines.push(
      "作成: 戯曲図書館 https://gikyokutosyokan.com/tools/schedule-generator"
    );

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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

  // Group consecutive weeks by phase for cleaner timeline
  const phaseGroups = useMemo(() => {
    const groups: { phase: string; weeks: WeekSchedule[] }[] = [];
    for (const week of schedule) {
      const last = groups[groups.length - 1];
      if (last && last.phase === week.phase) {
        last.weeks.push(week);
      } else {
        groups.push({ phase: week.phase, weeks: [week] });
      }
    }
    return groups;
  }, [schedule]);

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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-2">
            <FaTheaterMasks />
            <span>演劇ツール</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            演劇スケジュール作成
          </h1>
          <p className="text-gray-500 text-sm">
            本番日を選ぶだけで稽古スケジュールを自動生成
          </p>
        </div>

        {/* Main input: just the date */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <label
            htmlFor="perfDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <FaCalendarAlt className="inline mr-1.5 text-gray-400" />
            本番日を選択
          </label>
          <input
            id="perfDate"
            type="date"
            value={performanceDate}
            onChange={(e) => setPerformanceDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="mt-2 text-xs text-gray-400">
            {totalWeeks}週間 / 週{daysPerWeek}日 = 約
            {totalWeeks * daysPerWeek}日の稽古
          </p>

          {/* Advanced settings (collapsed) */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            詳細設定
            {showAdvanced ? (
              <FaChevronUp className="text-[10px]" />
            ) : (
              <FaChevronDown className="text-[10px]" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="totalWeeks"
                  className="block text-xs text-gray-500 mb-1"
                >
                  準備期間
                </label>
                <select
                  id="totalWeeks"
                  value={totalWeeks}
                  onChange={(e) => setTotalWeeks(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 9 }, (_, i) => i + 4).map((w) => (
                    <option key={w} value={w}>
                      {w}週間
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="daysPerWeek"
                  className="block text-xs text-gray-500 mb-1"
                >
                  稽古日数 / 週
                </label>
                <select
                  id="daysPerWeek"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2, 3, 4, 5].map((d) => (
                    <option key={d} value={d}>
                      週{d}日
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Save / Load (logged in) */}
        {session?.user ? (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {/* Save button */}
            {!showSaveForm ? (
              <button
                onClick={() => setShowSaveForm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <FaSave />
                保存
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="スケジュール名"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 w-40"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />
                <button
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  className="px-3 py-1.5 text-xs bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-40 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowSaveForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  キャンセル
                </button>
              </div>
            )}

            {/* Saved schedules dropdown */}
            {savedSchedules.length > 0 && (
              <div className="relative group">
                <select
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (idx >= 0) handleLoad(savedSchedules[idx]);
                    e.target.value = "-1";
                  }}
                  defaultValue="-1"
                  className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none bg-white text-gray-600 cursor-pointer"
                >
                  <option value="-1" disabled>
                    保存済み ({savedSchedules.length})
                  </option>
                  {savedSchedules.map((s, i) => (
                    <option key={s.id} value={i}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Delete saved */}
            {savedSchedules.length > 0 && (
              <div className="flex gap-1 ml-auto">
                {savedSchedules.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleDelete(s.id)}
                    className="text-[10px] text-gray-300 hover:text-red-400 transition-colors"
                    title={`「${s.name}」を削除`}
                  >
                    <FaTrash />
                  </button>
                ))}
              </div>
            )}

            {saveStatus && (
              <span className="text-xs text-green-600">{saveStatus}</span>
            )}
          </div>
        ) : (
          <p className="mb-6 text-xs text-gray-400">
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              ログイン
            </Link>
            するとスケジュールを保存できます
          </p>
        )}

        {/* Timeline */}
        {schedule.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">
                スケジュール
              </h2>
              <button
                onClick={handleCopyToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              >
                {copied ? (
                  <>
                    <FaCheck className="text-green-500" />
                    コピー済み
                  </>
                ) : (
                  <>
                    <FaCopy />
                    コピー
                  </>
                )}
              </button>
            </div>

            {/* Clean timeline grouped by phase */}
            <div className="space-y-1">
              {phaseGroups.map((group, gi) => {
                const borderColor =
                  PHASE_BORDER[group.phase] || "border-l-gray-300";
                return (
                  <div key={gi}>
                    {/* Phase header */}
                    <div className="flex items-center gap-2 pt-3 pb-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {group.phase}
                      </span>
                      <div className="flex-1 border-t border-gray-100" />
                    </div>

                    {/* Weeks in this phase */}
                    <div className="space-y-2">
                      {group.weeks.map((week) => (
                        <div
                          key={week.weekNumber}
                          className={`border-l-4 ${borderColor} bg-white rounded-r-lg p-3 shadow-sm`}
                        >
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-sm font-medium text-gray-800">
                              {week.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {week.dateRange}
                            </span>
                          </div>
                          <ul className="space-y-0.5">
                            {week.tasks.map((task, ti) => (
                              <li
                                key={ti}
                                className="text-sm text-gray-600 pl-2"
                              >
                                - {task}
                              </li>
                            ))}
                          </ul>
                          {week.milestones.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {week.milestones.map((ms, mi) => (
                                <span
                                  key={mi}
                                  className="text-xs text-purple-600 bg-purple-50 rounded px-2 py-0.5"
                                >
                                  {ms}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="mt-1.5 text-xs text-gray-400">
                            {week.tips}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Milestones (collapsible, at bottom) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <button
            onClick={() => setShowMilestones(!showMilestones)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <FaPlus className="text-gray-400 text-xs" />
              マイルストーンを追加
              {milestones.length > 0 && (
                <span className="text-xs text-gray-400">
                  ({milestones.length})
                </span>
              )}
            </span>
            {showMilestones ? (
              <FaChevronUp className="text-gray-300 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-300 text-xs" />
            )}
          </button>

          {showMilestones && (
            <div className="mt-4">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {MILESTONE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => addPresetMilestone(preset)}
                    className="text-xs px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newMilestoneName}
                  onChange={(e) => setNewMilestoneName(e.target.value)}
                  placeholder="マイルストーン名"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addMilestone();
                  }}
                />
                <select
                  value={newMilestoneWeek}
                  onChange={(e) => setNewMilestoneWeek(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 disabled:opacity-40 transition-colors"
                >
                  追加
                </button>
              </div>

              {milestones.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {milestones.map((ms) => (
                    <span
                      key={ms.id}
                      className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 border border-purple-100 rounded px-2.5 py-1"
                    >
                      第{ms.weekIndex + 1}週: {ms.name}
                      <button
                        onClick={() => removeMilestone(ms.id)}
                        className="ml-0.5 text-purple-300 hover:text-purple-600"
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

        {/* Daily menu (collapsed) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <button
            onClick={() => setShowDailyMenu(!showDailyMenu)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-medium text-gray-700">
              1日の稽古メニュー（{totalMinutes}分）
            </span>
            {showDailyMenu ? (
              <FaChevronUp className="text-gray-300 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-300 text-xs" />
            )}
          </button>

          {showDailyMenu && (
            <div className="mt-4 space-y-2">
              {DAILY_MENU.map((item, i) => (
                <div
                  key={i}
                  className="flex items-baseline justify-between py-1 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {item.description}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 shrink-0 ml-3">
                    {item.minutes}分
                  </span>
                </div>
              ))}
              <div className="pt-2 text-xs text-gray-400 text-center">
                合計 {totalMinutes}分（約{Math.floor(totalMinutes / 60)}時間
                {totalMinutes % 60 > 0 ? `${totalMinutes % 60}分` : ""}）
              </div>
            </div>
          )}
        </div>

        {/* Tips (collapsed) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-medium text-gray-700">
              成功のコツ
            </span>
            {showTips ? (
              <FaChevronUp className="text-gray-300 text-xs" />
            ) : (
              <FaChevronDown className="text-gray-300 text-xs" />
            )}
          </button>

          {showTips && (
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <strong>1.</strong> 早めの台本決定が最重要。1週目には確定を。
              </li>
              <li>
                <strong>2.</strong>{" "}
                毎回の稽古に具体的な目標を設定しましょう。
              </li>
              <li>
                <strong>3.</strong>{" "}
                裏方の準備（音響・照明・衣装）は稽古と並行で。
              </li>
              <li>
                <strong>4.</strong>{" "}
                通し稽古は録画がおすすめ。客観的に改善点を発見できます。
              </li>
              <li>
                台本探しは{" "}
                <Link href="/" className="text-blue-500 hover:underline">
                  戯曲図書館
                </Link>{" "}
                から。人数・上演時間で検索できます。
              </li>
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
