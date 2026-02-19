import React, { useState } from "react";
import { FaLink, FaCheck } from "react-icons/fa";
import {
  TwitterShareButton,
  LineShareButton,
  TwitterIcon,
  LineIcon,
} from "react-share";

interface ShareSearchButtonProps {
  searchParams?: URLSearchParams;
}

function buildDescription(params: URLSearchParams): string {
  const parts: string[] = [];

  const minTotal = params.get("minTotalCount");
  const maxTotal = params.get("maxTotalCount");
  if (minTotal && maxTotal) {
    parts.push(`${minTotal}〜${maxTotal}人`);
  } else if (minTotal) {
    parts.push(`${minTotal}人以上`);
  } else if (maxTotal) {
    parts.push(`${maxTotal}人以下`);
  }

  const minPlay = params.get("minPlaytime");
  const maxPlay = params.get("maxPlaytime");
  if (minPlay && minPlay !== "0" && maxPlay && maxPlay !== "999") {
    parts.push(`${minPlay}〜${maxPlay}分`);
  } else if (minPlay && minPlay !== "0") {
    parts.push(`${minPlay}分以上`);
  } else if (maxPlay && maxPlay !== "999") {
    parts.push(`${maxPlay}分以内`);
  }

  const keyword = params.get("keyword");
  if (keyword) {
    parts.push(`「${keyword}」`);
  }

  if (parts.length === 0) return "戯曲図書館で脚本を探しています";
  return `${parts.join("で")}の脚本を探しています`;
}

const ShareSearchButton: React.FC<ShareSearchButtonProps> = () => {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  };

  const getDescription = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return buildDescription(params);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = getUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="URLをコピー"
      >
        {copied ? (
          <>
            <FaCheck className="text-green-500" />
            <span>コピーしました</span>
          </>
        ) : (
          <>
            <FaLink />
            <span>URLをコピー</span>
          </>
        )}
      </button>
      <TwitterShareButton url={getUrl()} title={getDescription()}>
        <TwitterIcon size={28} round />
      </TwitterShareButton>
      <LineShareButton url={getUrl()} title={getDescription()}>
        <LineIcon size={28} round />
      </LineShareButton>
    </div>
  );
};

export default ShareSearchButton;
