import React from "react";

const URL_PATTERN = /(https?:\/\/[^\s<>「」『』（）()、。]+)/g;

// 投稿の本文。改行を保ち、URL だけをリンクにする（利用者の書いたリンクなので nofollow ugc）
export default function LinkifiedText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(URL_PATTERN);
  return (
    <p className={`whitespace-pre-wrap break-words ${className ?? ""}`}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="nofollow ugc noopener noreferrer" className="text-theater-primary-700 underline underline-offset-2 break-all">
            {part}
          </a>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </p>
  );
}
