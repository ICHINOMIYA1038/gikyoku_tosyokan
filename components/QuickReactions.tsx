import React, { useState, useEffect } from "react";

const REACTIONS = [
  { key: "泣けた", emoji: "😢" },
  { key: "笑えた", emoji: "😂" },
  { key: "考えさせられた", emoji: "🤔" },
  { key: "感動した", emoji: "✨" },
  { key: "演じたい", emoji: "🎭" },
  { key: "おすすめ", emoji: "👍" },
];

const QuickReactions = ({ postId }: { postId: number }) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [animating, setAnimating] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/reactions?postId=${postId}`)
      .then((r) => r.json())
      .then(setCounts)
      .catch(() => {});

    try {
      const stored = localStorage.getItem(`reactions_${postId}`);
      if (stored) setReacted(new Set(JSON.parse(stored)));
    } catch {}
  }, [postId]);

  const handleReact = async (reaction: string) => {
    if (reacted.has(reaction)) return;

    setAnimating(reaction);
    setTimeout(() => setAnimating(null), 600);

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

  return (
    <div className="flex flex-wrap items-center gap-1.5 my-4">
      {REACTIONS.map((r) => {
        const isReacted = reacted.has(r.key);
        const count = counts[r.key] || 0;
        const isAnimating = animating === r.key;
        return (
          <button
            key={r.key}
            onClick={() => handleReact(r.key)}
            disabled={isReacted}
            title={r.key}
            className={`
              inline-flex items-center gap-1 h-8 px-2.5 rounded-md text-xs
              transition-all duration-200
              ${isAnimating ? "scale-110" : "scale-100"}
              ${isReacted
                ? "bg-theater-primary-50 text-theater-primary-700 font-bold"
                : "bg-gray-50 hover:bg-gray-100 text-gray-500 cursor-pointer"
              }
            `}
          >
            <span className={`text-sm ${isAnimating ? "animate-bounce" : ""}`}>{r.emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default QuickReactions;
