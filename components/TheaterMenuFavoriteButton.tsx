import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { trackTheaterMenuEvent } from "@/lib/gtag";

export function TheaterMenuFavoriteButton({ menuId }: { menuId: number }) {
  const { data: session } = useSession();
  const [fav, setFav] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch("/api/theater-menu/favorite")
      .then((r) => r.json())
      .then((d) => setFav((d.menuIds || []).includes(menuId)))
      .catch(() => setFav(false));
  }, [session, menuId]);

  if (!session) {
    return (
      <Link
        href={`/auth/signin?callbackUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/theater-menu")}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-rose-300 hover:text-rose-600 transition"
      >
        <Heart className="w-3.5 h-3.5" />
        ログインしてお気に入り
      </Link>
    );
  }

  const toggle = async () => {
    if (fav === null || busy) return;
    setBusy(true);
    if (fav) {
      const r = await fetch(`/api/theater-menu/favorite?menuId=${menuId}`, { method: "DELETE" });
      if (r.ok) setFav(false);
    } else {
      const r = await fetch("/api/theater-menu/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId }),
      });
      if (r.ok) {
        setFav(true);
        trackTheaterMenuEvent("favorite_add", String(menuId));
      }
    }
    setBusy(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={fav === null || busy}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
        fav
          ? "bg-rose-50 border-rose-300 text-rose-700"
          : "bg-white border-gray-300 text-gray-600 hover:border-rose-300 hover:text-rose-600"
      }`}
    >
      <Heart className={`w-3.5 h-3.5 ${fav ? "fill-rose-500" : ""}`} />
      {fav ? "お気に入り済み" : "お気に入り"}
    </button>
  );
}
