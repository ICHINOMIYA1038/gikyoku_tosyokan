import React, { useState, useEffect } from "react";

const REACTIONS = [
  { key: "泣けた", emoji: "😢", label: "泣けた" },
  { key: "笑えた", emoji: "😂", label: "笑えた" },
  { key: "考えさせられた", emoji: "🤔", label: "考えさせられた" },
  { key: "感動した", emoji: "✨", label: "感動した" },
  { key: "演じたい", emoji: "🎭", label: "演じたい" },
  { key: "おすすめ", emoji: "👍", label: "おすすめ" },
];

const QuickReactions = ({ postId }: { postId: number }) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [animating, setAnimating] = useState<string | null>(null);

  useEffect(() => {
    // Fetch counts
    fetch(`/api/reactions?postId=${postId}`)
      .then((r) => r.json())
      .then(setCounts)
      .catch(() => {});

    // Restore reacted state
    try {
      const stored = localStorage.getItem(`reactions_${postId}`);
      if (stored) setReacted(new Set(JSON.parse(stored)));
    } catch {}
  }, [postId]);

  const handleReact = async (reaction: string) => {
    if (reacted.has(reaction)) return;

    setAnimating(reaction);
    setTimeout(() => setAnimating(null), 600);

    // Optimistic update
    const newReacted = new Set(reacted);
    newReacted.add(reaction);
    setReacted(newReacted);
    setCounts((prev) => ({ ...prev, [reaction]: (prev[reaction] || 0) + 1 }));

    try {
      localStorage.setItem(`reactions_${postId}`, JSON.stringify(Array.from(newReacted)));
    } catch {}

    try {
      const res = await fetch("/api/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reaction }),
      });
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts);
      }
    } catch {}
  };

  const totalReactions = Object.values(counts).reduce((sum, c) => sum + c, 0);

  return (
    <div className="my-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-amber-500 rounded-full"></div>
        <h3 className="text-sm font-bold text-gray-700">この作品どうだった？</h3>
        {totalReactions > 0 && (
          <span className="text-xs text-gray-400">{totalReactions}件のリアクション</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((r) => {
          const isReacted = reacted.has(r.key);
          const count = counts[r.key] || 0;
          const isAnimating = animating === r.key;
          return (
            <button
              key={r.key}
              onClick={() => handleReact(r.key)}
              disabled={isReacted}
              className={`
                inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium
                transition-all duration-200 min-h-[40px] border
                ${isAnimating ? "scale-110" : "scale-100"}
                ${isReacted
                  ? "bg-amber-50 border-amber-300 text-amber-700 cursor-default"
                  : "bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50 active:bg-amber-100 cursor-pointer"
                }
              `}
            >
              <span className={`text-base ${isAnimating ? "animate-bounce" : ""}`}>{r.emoji}</span>
              <span className="text-xs">{r.label}</span>
              {count > 0 && (
                <span className={`text-xs font-bold ml-0.5 ${isReacted ? "text-amber-600" : "text-gray-400"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickReactions;
