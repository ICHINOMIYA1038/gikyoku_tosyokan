import { useState, useMemo } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";

export type FilterState = {
  minPeople: number | null;
  maxDuration: number | null;
  maxDifficulty: number | null;
  noContact: boolean;
  tag: string | null;
  q: string; // フリーテキスト検索
};

export const EMPTY_FILTER: FilterState = {
  minPeople: null,
  maxDuration: null,
  maxDifficulty: null,
  noContact: false,
  tag: null,
  q: "",
};

export function useMenuFilter<
  T extends {
    title: string;
    summary: string;
    duration: number | null;
    minPeople: number | null;
    maxPeople: number | null;
    difficulty: number | null;
    hasPhysicalContact?: boolean | null;
    tags: string[];
  }
>(all: T[]) {
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);

  const filtered = useMemo(() => {
    const q = filter.q.trim().toLowerCase();
    return all.filter((m) => {
      if (filter.minPeople != null) {
        if (m.minPeople != null && m.minPeople > filter.minPeople) return false;
        if (m.maxPeople != null && m.maxPeople < filter.minPeople) return false;
      }
      if (filter.maxDuration != null && m.duration != null && m.duration > filter.maxDuration) return false;
      if (filter.maxDifficulty != null && m.difficulty != null && m.difficulty > filter.maxDifficulty) return false;
      if (filter.noContact && m.hasPhysicalContact === true) return false;
      if (filter.tag && !m.tags.includes(filter.tag)) return false;
      if (q) {
        const hay = `${m.title} ${m.summary} ${m.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [all, filter]);

  const isActive =
    filter.minPeople != null ||
    filter.maxDuration != null ||
    filter.maxDifficulty != null ||
    filter.noContact ||
    filter.tag != null ||
    filter.q.trim() !== "";

  return { filter, setFilter, filtered, isActive };
}

export function FilterBar({
  filter,
  setFilter,
  totalCount,
  filteredCount,
  availableTags,
}: {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  availableTags: string[];
}) {
  const [open, setOpen] = useState(false);
  const isActive =
    filter.minPeople != null ||
    filter.maxDuration != null ||
    filter.maxDifficulty != null ||
    filter.noContact ||
    filter.tag != null;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="relative flex-1 min-w-[12rem]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filter.q}
            onChange={(e) => setFilter({ ...filter, q: e.target.value })}
            placeholder="メニューを検索 (キーワード、タグ)"
            className="w-full rounded-full border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-xs focus:border-rose-300 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition shrink-0 ${
            isActive
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          絞り込み
          {isActive && (
            <span className="rounded-full bg-white/30 px-1.5 text-[10px]">ON</span>
          )}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">
          {isActive ? `${filteredCount} / ${totalCount} 件` : `${totalCount} 件`}
        </span>
        {isActive && (
          <button
            onClick={() => setFilter(EMPTY_FILTER)}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-rose-600"
          >
            <X className="w-3 h-3" /> クリア
          </button>
        )}
      </div>

      {open && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 space-y-4 md:max-h-none max-h-[70vh] overflow-y-auto">
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1.5">参加人数</p>
            <div className="flex flex-wrap gap-1.5">
              {[null, 1, 2, 5, 10, 20].map((n) => (
                <button
                  key={n ?? "none"}
                  onClick={() => setFilter({ ...filter, minPeople: n })}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    filter.minPeople === n
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {n == null ? "指定なし" : `${n}人${n === 20 ? "以上" : ""}`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1.5">所要時間 (以下)</p>
            <div className="flex flex-wrap gap-1.5">
              {[null, 5, 10, 15, 30, 60].map((n) => (
                <button
                  key={n ?? "none"}
                  onClick={() => setFilter({ ...filter, maxDuration: n })}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    filter.maxDuration === n
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {n == null ? "指定なし" : `${n}分`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-700 mb-1.5">難易度 (以下)</p>
            <div className="flex flex-wrap gap-1.5">
              {[null, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n ?? "none"}
                  onClick={() => setFilter({ ...filter, maxDifficulty: n })}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    filter.maxDifficulty === n
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {n == null ? "指定なし" : "★".repeat(n)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-700 inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={filter.noContact}
                onChange={(e) => setFilter({ ...filter, noContact: e.target.checked })}
              />
              身体接触なしのみ
            </label>
          </div>

          {availableTags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1.5">タグ</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilter({ ...filter, tag: null })}
                  className={`px-2.5 py-0.5 text-[11px] rounded border ${
                    filter.tag === null
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  すべて
                </button>
                {availableTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter({ ...filter, tag: t })}
                    className={`px-2.5 py-0.5 text-[11px] rounded border ${
                      filter.tag === t
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
