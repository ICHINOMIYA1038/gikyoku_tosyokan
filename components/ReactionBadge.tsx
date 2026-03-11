import React, { useState, useEffect } from "react";

const REACTION_EMOJI: Record<string, string> = {
  "泣けた": "😢",
  "笑えた": "😂",
  "考えさせられた": "🤔",
  "感動した": "✨",
  "演じたい": "🎭",
  "おすすめ": "👍",
};

const ReactionBadge = ({ postId }: { postId: number }) => {
  const [topReaction, setTopReaction] = useState<{ key: string; count: number } | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetch(`/api/reactions?postId=${postId}`)
      .then((r) => r.json())
      .then((counts: Record<string, number>) => {
        const total = Object.values(counts).reduce((s, c) => s + c, 0);
        setTotalCount(total);
        if (total === 0) return;
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        setTopReaction({ key: top[0], count: top[1] });
      })
      .catch(() => {});
  }, [postId]);

  if (!topReaction || totalCount === 0) return null;

  const emoji = REACTION_EMOJI[topReaction.key] || "";

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-sm">
      <span>{emoji}</span>
      <span className="text-amber-700 font-medium">
        「{topReaction.key}」{topReaction.count > 1 ? ` × ${topReaction.count}` : ""}
      </span>
      {totalCount > topReaction.count && (
        <span className="text-amber-500 text-xs">他{totalCount - topReaction.count}件</span>
      )}
    </div>
  );
};

export default ReactionBadge;
