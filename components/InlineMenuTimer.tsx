import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Bell } from "lucide-react";
import { trackTheaterMenuEvent } from "@/lib/gtag";
import { playTimerEnd } from "@/lib/theater-menu-sfx";

export function InlineMenuTimer({ minutes }: { minutes: number }) {
  const totalSec = minutes * 60;
  const [remaining, setRemaining] = useState(totalSec);
  const [running, setRunning] = useState(false);
  const [notified, setNotified] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (remaining === 0 && running && !notified) {
      setRunning(false);
      setNotified(true);
      playTimerEnd();
      // ブラウザ通知 (許可されていれば)
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification("メニュー終了", { body: `${minutes}分経ちました` });
      }
    }
  }, [remaining, running, notified, minutes]);

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const pct = totalSec > 0 ? ((totalSec - remaining) / totalSec) * 100 : 0;

  const start = () => {
    if (remaining === 0) setRemaining(totalSec);
    setRunning(true);
    setNotified(false);
    trackTheaterMenuEvent("timer_start", String(minutes));
    // 通知パーミッションを要求
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };
  const reset = () => {
    setRunning(false);
    setRemaining(totalSec);
    setNotified(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-rose-700 flex items-center gap-1">
          <Bell className="w-3.5 h-3.5" /> 稽古タイマー
        </p>
        <p className="text-xs text-gray-500">目安 {minutes}分</p>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <p className="text-4xl md:text-5xl font-mono font-bold text-gray-900 tabular-nums">
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </p>
        <div className="flex gap-2">
          {!running ? (
            <button
              onClick={start}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 text-white px-4 py-2 text-sm hover:bg-rose-700"
            >
              <Play className="w-3.5 h-3.5" />
              {remaining === 0 ? "もう一度" : remaining < totalSec ? "再開" : "スタート"}
            </button>
          ) : (
            <button
              onClick={() => setRunning(false)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black"
            >
              <Pause className="w-3.5 h-3.5" />
              一時停止
            </button>
          )}
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {notified && (
        <p className="mt-2 text-xs text-emerald-700 font-medium">
          ⏰ 時間になりました
        </p>
      )}
    </div>
  );
}
