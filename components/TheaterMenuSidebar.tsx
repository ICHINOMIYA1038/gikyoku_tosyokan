import Link from "next/link";
import { useRouter } from "next/router";
import {
  Mic,
  Sparkles,
  Gamepad2,
  ScrollText,
  Shuffle,
  BookOpen,
  Target,
  Activity,
  Layers,
  Flame,
  Puzzle,
  Heart,
  Dice6,
  UserCog,
} from "lucide-react";

export type SidebarCategory = {
  slug: string;
  name: string;
  count: number;
  icon?: string | null;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  mic: Mic,
  sparkles: Sparkles,
  gamepad: Gamepad2,
  script: ScrollText,
  target: Target,
  activity: Activity,
  layers: Layers,
  flame: Flame,
  puzzle: Puzzle,
  book: BookOpen,
};

export function TheaterMenuSidebar({ categories }: { categories: SidebarCategory[] }) {
  const router = useRouter();
  const currentSlug =
    typeof router.query.category === "string" ? router.query.category : null;

  return (
    <aside className="md:w-60 md:shrink-0">
      <div className="md:sticky md:top-4 space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <Link
              href="/theater-menu"
              className="flex items-center gap-2 text-sm font-bold text-gray-900"
            >
              <BookOpen className="w-4 h-4 text-rose-600" />
              演劇メニュー辞典
            </Link>
          </div>
          <ul>
            <li>
              <Link
                href="/theater-menu"
                className={`flex items-center justify-between px-4 py-2.5 text-sm transition ${
                  !currentSlug && router.pathname === "/theater-menu"
                    ? "bg-rose-50 text-rose-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>すべて</span>
              </Link>
            </li>
            {categories.map((c) => {
              const Icon = ICON_MAP[c.icon || ""] || null;
              const active = currentSlug === c.slug;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/theater-menu/${c.slug}`}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm border-t border-gray-100 transition ${
                      active
                        ? "bg-rose-50 text-rose-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4" />}
                      {c.name}
                    </span>
                    <span className="text-xs text-gray-400">{c.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-2">
          <Link
            href="/theater-menu/random"
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 hover:bg-rose-100 transition"
          >
            <Shuffle className="w-4 h-4" />
            ランダムに1つ引く
          </Link>
          <Link
            href="/theater-menu/etude-generator"
            className="flex items-center justify-center gap-2 rounded-xl border border-fuchsia-200 bg-gradient-to-r from-rose-50 to-fuchsia-50 px-4 py-2.5 text-xs font-medium text-fuchsia-700 hover:from-rose-100 hover:to-fuchsia-100 transition"
          >
            <Dice6 className="w-3.5 h-3.5" />
            エチュードお題ジェネレーター
          </Link>
          <Link
            href="/theater-menu/role-picker"
            className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2.5 text-xs font-medium text-indigo-700 hover:from-indigo-100 hover:to-purple-100 transition"
          >
            <UserCog className="w-3.5 h-3.5" />
            役割を割り振る
          </Link>
          <Link
            href="/theater-menu/favorites"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition"
          >
            <Heart className="w-3.5 h-3.5" />
            お気に入り
          </Link>
          <Link
            href="/theater-menu/plans"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            レッスンプラン
          </Link>
        </div>
      </div>
    </aside>
  );
}
