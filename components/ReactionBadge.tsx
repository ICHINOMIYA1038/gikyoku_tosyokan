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
  const [reactions, setReactions] = useState<[string, number][]>([]);

  useEffect(() => {
    fetch(`/api/reactions?postId=${postId}`)
      .then((r) => r.json())
      .then((counts: Record<string, number>) => {
        const sorted = Object.entries(counts)
          .filter(([, c]) => c > 0)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        setReactions(sorted);
      })
      .catch(() => {});
  }, [postId]);

  if (reactions.length === 0) return null;

  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      {reactions.map(([key, count]) => (
        <span key={key} className="inline-flex items-center gap-0.5" title={key}>
          <span>{REACTION_EMOJI[key] || ""}</span>
          <span className="text-xs">{count}</span>
        </span>
      ))}
    </div>
  );
};

export default ReactionBadge;
