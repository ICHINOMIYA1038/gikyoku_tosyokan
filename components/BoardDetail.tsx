import React, { useState } from "react";

// 掲示板の詳細ページで使う部品

export type InfoRow = { label: string; value: React.ReactNode };

// 公演日時・会場などの表。値が長くても折り返せるよう、見出しと値の2列にする
export function InfoTable({ rows }: { rows: InfoRow[] }) {
  const shown = rows.filter((r) => r.value !== null && r.value !== undefined && r.value !== "");
  if (shown.length === 0) return null;
  return (
    <dl className="border-t border-[#D9D5CF]">
      {shown.map((r) => (
        <div key={r.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 py-3 px-1 border-b border-[#D9D5CF]">
          <dt className="text-sm text-gray-600">{r.label}</dt>
          <dd className="text-base text-gray-900 break-words">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// 共有。外部の共有ボタン（丸いアイコン）は使わず、文字のリンクとURLのコピーにする
export function ShareLinks({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const link = "inline-flex items-center h-10 px-3 rounded border border-[#D9D5CF] text-sm text-gray-800 hover:bg-[#F4F2EE]";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600 mr-1">共有する</span>
      <a className={link} target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}>
        X
      </a>
      <a className={link} target="_blank" rel="noopener noreferrer" href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`}>
        LINE
      </a>
      <button type="button" className={link} onClick={copy}>
        {copied ? "コピーしました" : "URLをコピー"}
      </button>
    </div>
  );
}

// 全体の h2 の余白と大きさ（globals.css）を打ち消す
export const DETAIL_SECTION_TITLE = "!my-0 !pb-0 !text-lg !font-bold !text-gray-900";
