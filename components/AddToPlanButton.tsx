import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BookOpen, Check, Loader2 } from "lucide-react";

type Plan = { id: string; title: string };

export function AddToPlanButton({ menuId }: { menuId: number }) {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session || !open) return;
    fetch("/api/theater-menu/plans")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []));
  }, [session, open]);

  if (!session) return null;

  const addTo = async (planId: string) => {
    setBusyId(planId);
    // 現在のプランを取得 → items 末尾に追加 → PUT
    const cur = await fetch(`/api/theater-menu/plans/${planId}`).then((r) => r.json());
    const items = [
      ...(cur.plan?.items || []).map((it: any) => ({
        menuId: it.menuId,
        customDuration: it.customDuration,
        notes: it.notes,
      })),
      { menuId, customDuration: null, notes: null },
    ];
    const r = await fetch(`/api/theater-menu/plans/${planId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    setBusyId(null);
    if (r.ok) {
      setAdded(new Set(added).add(planId));
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-rose-300 hover:text-rose-600 transition"
      >
        <BookOpen className="w-3.5 h-3.5" />
        プランに追加
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg p-2">
          {plans.length === 0 ? (
            <p className="text-xs text-gray-500 p-2">
              プランがありません。
              <Link href="/theater-menu/plans" className="text-rose-600 hover:underline ml-1">
                作成する
              </Link>
            </p>
          ) : (
            <ul>
              {plans.map((p) => {
                const done = added.has(p.id);
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => addTo(p.id)}
                      disabled={busyId === p.id || done}
                      className={`w-full text-left rounded px-2 py-1.5 text-xs flex items-center justify-between ${
                        done ? "text-emerald-700" : "text-gray-700 hover:bg-rose-50"
                      }`}
                    >
                      <span>{p.title}</span>
                      {busyId === p.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : done ? (
                        <Check className="w-3 h-3" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
