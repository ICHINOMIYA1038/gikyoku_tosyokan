// 掲示板やコメントの日付表示。サーバーの TZ は UTC なので、日付は日本時間で組み立てる

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function toJst(value: string | Date) {
  const d = new Date(new Date(value).getTime() + JST_OFFSET_MS);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, day: d.getUTCDate(), w: WEEKDAYS[d.getUTCDay()] };
}

export function timeAgo(value: string | Date, now: Date = new Date()) {
  const diff = now.getTime() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  const { y, m, day } = toJst(value);
  return `${y}/${m}/${day}`;
}

// 公演日の表示。年は今年と違うときだけ返す
export function performanceDateParts(value: string | Date, now: Date = new Date()) {
  const { y, m, day, w } = toJst(value);
  return { monthDay: `${m}月${day}日`, weekday: w, year: y !== toJst(now).y ? `${y}年` : null };
}

// フォームの datetime-local（"2026-11-05T19:00"）や date（"2026-11-05"）はタイムゾーンを持たないので、日本時間として読む。
// サーバーは UTC で動くので、そのまま new Date() すると9時間ずれる
export function parseJstInput(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00+09:00`);
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) return new Date(`${value}+09:00`);
  return new Date(value);
}

// 「2026年11月5日（木）19:00」の形。時刻が 0:00 ちょうどのときは日付だけ返す（日付だけで入力された告知のため）
export function formatJstDateTime(value: string | Date, withTime = true) {
  const d = new Date(new Date(value).getTime() + JST_OFFSET_MS);
  const date = `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日（${WEEKDAYS[d.getUTCDay()]}）`;
  const h = d.getUTCHours(), m = d.getUTCMinutes();
  if (!withTime || (h === 0 && m === 0)) return date;
  return `${date}${h}:${String(m).padStart(2, "0")}`;
}
