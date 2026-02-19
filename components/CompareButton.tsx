import React, { useState, useEffect } from "react";
import { FaBalanceScale } from "react-icons/fa";
import { isInCompare, toggleCompare } from "@/lib/favorites";

interface CompareButtonProps {
  postId: number;
  size?: "sm" | "md";
  variant?: "default" | "floating";
}

const CompareButton: React.FC<CompareButtonProps> = ({ postId, size = "md", variant = "default" }) => {
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    setInCompare(isInCompare(postId));

    const handler = () => setInCompare(isInCompare(postId));
    window.addEventListener("compare-changed", handler);
    return () => window.removeEventListener("compare-changed", handler);
  }, [postId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleCompare(postId);
    if (result.error) {
      alert(result.error);
    }
  };

  // フローティングアクション用スタイル（詳細ページ右下）
  if (variant === "floating") {
    return (
      <button
        onClick={handleClick}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
          inCompare
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-white border-2 border-blue-300 text-blue-400 hover:bg-blue-50 hover:text-blue-500"
        }`}
        aria-label={inCompare ? "比較から削除" : "比較に追加"}
      >
        <FaBalanceScale className="text-lg" />
      </button>
    );
  }

  // カード・一覧用スタイル（デフォルト）
  const iconClass = size === "sm" ? "text-sm" : "text-base";
  const isSmall = size === "sm";

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 ${
        isSmall ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      } rounded-full shadow-sm transition-all ${
        inCompare
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
      }`}
      aria-label={inCompare ? "比較から削除" : "比較に追加"}
    >
      <FaBalanceScale className={iconClass} />
      <span>{inCompare ? "比較中" : "比較"}</span>
    </button>
  );
};

export default CompareButton;
