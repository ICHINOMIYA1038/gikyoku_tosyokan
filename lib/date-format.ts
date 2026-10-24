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
