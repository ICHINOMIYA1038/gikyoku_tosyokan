import React, { SetStateAction, useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import TagSelector from "./TagSelecter";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface QuickPreset {
  label: string;
  icon: string;
  params: {
    minTotalCount?: string;
    maxTotalCount?: string;
    minPlaytime?: string;
    maxPlaytime?: string;
  };
}

const quickPresets: QuickPreset[] = [
  {
    label: "〜5人",
    icon: "",
    params: { minTotalCount: "", maxTotalCount: "5" }
  },
  {
    label: "6〜10人",
    icon: "",
    params: { minTotalCount: "6", maxTotalCount: "10" }
  },
  {
    label: "〜30分",
    icon: "",
    params: { minPlaytime: "0", maxPlaytime: "30" }
  },
  {
    label: "30〜60分",
    icon: "",
    params: { minPlaytime: "30", maxPlaytime: "60" }
  }
];

const getCategories = async (): Promise<any> => {
  const res = await fetch("/api/categories");
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
};

type RangeRowProps = {
  label?: string;
  minVal: string;
  maxVal: string;
  setMin: (v: string) => void;
  setMax: (v: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
};

function RangeRow({ label, minVal, maxVal, setMin, setMax, minPlaceholder = "最小", maxPlaceholder = "最大" }: RangeRowProps) {
  const inputCls = "min-w-0 w-full p-2 border border-theater-neutral-300 rounded text-base focus:border-theater-primary-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  return (
    <div>
      {label && <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input
          type="number" inputMode="numeric" pattern="[0-9]*"
          className={inputCls}
          placeholder={minPlaceholder}
          value={minVal}
          onChange={(e) => setMin(e.target.value)}
        />
        <span className="text-gray-500 text-sm">〜</span>
        <input
          type="number" inputMode="numeric" pattern="[0-9]*"
          className={inputCls}
          placeholder={maxPlaceholder}
          value={maxVal}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function MobileSearchForm({
  setData,
  page,
  setPage,
  sort_by,
  sortDirection,
  onSearch,
}: any) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [minMaleCount, setMinMaleCount] = useState<string>("");
  const [maxMaleCount, setMaxMaleCount] = useState<string>("");
  const [minFemaleCount, setMinFemaleCount] = useState<string>("");
  const [maxFemaleCount, setMaxFemaleCount] = useState<string>("");
  const [minTotalCount, setMinTotalCount] = useState<string>("");
  const [maxTotalCount, setMaxTotalCount] = useState<string>("");
  const [minPlaytime, setMinPlaytime] = useState<string>("");
  const [maxPlaytime, setMaxPlaytime] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  
  // アコーディオン状態管理
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const per = 8;

  const { data: categories, isLoading: categoriesLoading } = useQuery(
    ["categories"],
    getCategories
  );

  const searchParams: Record<string, string> = {
    keyword: keyword,
    minMaleCount: minMaleCount,
    maxMaleCount: maxMaleCount,
    minFemaleCount: minFemaleCount,
    maxFemaleCount: maxFemaleCount,
    minTotalCount: minTotalCount,
    maxTotalCount: maxTotalCount,
    minPlaytime: minPlaytime || "0",
    maxPlaytime: maxPlaytime || "999",
    page: page.toString(),
    per: per.toString(),
    categories: Array.isArray(selectedTags) ? selectedTags.join(",") : selectedTags,
    sortDirection,
    sort_by,
  };

  // URLパラメータから初期値を設定
  useEffect(() => {
    if (!router.isReady) return;
    
    let hasParams = false;
    
    // URL の条件を、検索に直接渡す値としても集める
    const URL_KEYS = ["minPlaytime", "maxPlaytime", "minTotalCount", "maxTotalCount", "minMaleCount", "maxMaleCount", "minFemaleCount", "maxFemaleCount", "keyword"];
    const overrides: Record<string, string> = {};
    URL_KEYS.forEach((key) => {
      if (router.query[key]) overrides[key] = String(router.query[key]);
    });
    if (router.query.category) overrides.categories = String(parseInt(router.query.category as string));
    // URL に条件があるときは、URL にない条件を空に戻す（チップは「その条件だけ」で探すリンクなので）
    const hasUrlParams = Object.keys(overrides).length > 0;
    if (hasUrlParams) {
      const CLEAR: Record<string, [string, (v: string) => void]> = {
        minPlaytime: ["0", setMinPlaytime],
        maxPlaytime: ["999", setMaxPlaytime],
        minTotalCount: ["", setMinTotalCount],
        maxTotalCount: ["", setMaxTotalCount],
        minMaleCount: ["", setMinMaleCount],
        maxMaleCount: ["", setMaxMaleCount],
        minFemaleCount: ["", setMinFemaleCount],
        maxFemaleCount: ["", setMaxFemaleCount],
        keyword: ["", setKeyword],
      };
      Object.entries(CLEAR).forEach(([key, [empty, setter]]) => {
        if (!(key in overrides)) {
          overrides[key] = empty;
          setter(key === "minPlaytime" || key === "maxPlaytime" ? "" : empty);
        }
      });
      if (!router.query.category) {
        overrides.categories = "";
        setSelectedTags([]);
      }
    }

    if (router.query.minPlaytime) {
      setMinPlaytime(router.query.minPlaytime as string);
      hasParams = true;
    }
    if (router.query.maxPlaytime) {
      setMaxPlaytime(router.query.maxPlaytime as string);
      hasParams = true;
    }
    if (router.query.minTotalCount) {
      setMinTotalCount(router.query.minTotalCount as string);
      hasParams = true;
    }
    if (router.query.maxTotalCount) {
      setMaxTotalCount(router.query.maxTotalCount as string);
      hasParams = true;
    }
    if (router.query.minMaleCount) {
      setMinMaleCount(router.query.minMaleCount as string);
      hasParams = true;
    }
    if (router.query.maxMaleCount) {
      setMaxMaleCount(router.query.maxMaleCount as string);
      hasParams = true;
    }
    if (router.query.minFemaleCount) {
      setMinFemaleCount(router.query.minFemaleCount as string);
      hasParams = true;
    }
    if (router.query.maxFemaleCount) {
      setMaxFemaleCount(router.query.maxFemaleCount as string);
      hasParams = true;
    }
    if (router.query.keyword) {
      setKeyword(router.query.keyword as string);
      hasParams = true;
    }
    if (router.query.category) {
      const categoryId = parseInt(router.query.category as string);
      setSelectedTags([categoryId]);
      hasParams = true;
    }

    // setState はこの処理の中ではまだ反映されないので、URL の値を直接渡して検索する。
    // 同じページでチップを押して URL が変わったときも、ここで検索し直す
    if (hasParams) {
      handleSubmit(overrides);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    // URLパラメータがない場合のみ初回検索を実行
    if (!router.query.minPlaytime && !router.query.maxPlaytime && !router.query.keyword && !router.query.category && !router.query.minTotalCount && !router.query.maxTotalCount && !router.query.minMaleCount && !router.query.maxMaleCount && !router.query.minFemaleCount && !router.query.maxFemaleCount) {
      handleSubmit();
    }
  }, []);

  useEffect(() => {
    handleSubmit();
  }, [page, sort_by, sortDirection, selectedTags]);

  // 検索は同時に何本も走るので、最後に始めたものの結果だけを反映する（古い結果での上書きを防ぐ）
  const latestRequest = useRef(0);

  const handleSubmit = async (overrides: Record<string, string> = {}) => {
    const requestId = ++latestRequest.current;
    setData([]);
    const query = new URLSearchParams({ ...searchParams, ...overrides }).toString();

    try {
      const response = await fetch(`/api/search?${query}`);
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      if (requestId !== latestRequest.current) return;
      setData(data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleSearch = () => {
    if (page !== 1) {
      setPage(1);
    } else {
      handleSubmit();
      onSearch();
    }
    setIsOpen(false);
  };

  const applyPreset = (preset: QuickPreset) => {
    if (preset.params.minTotalCount !== undefined) setMinTotalCount(preset.params.minTotalCount);
    if (preset.params.maxTotalCount !== undefined) setMaxTotalCount(preset.params.maxTotalCount);
    if (preset.params.minPlaytime !== undefined) setMinPlaytime(preset.params.minPlaytime);
    if (preset.params.maxPlaytime !== undefined) setMaxPlaytime(preset.params.maxPlaytime);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const resetFilters = () => {
    setKeyword("");
    setMinMaleCount("");
    setMaxMaleCount("");
    setMinFemaleCount("");
    setMaxFemaleCount("");
    setMinTotalCount("");
    setMaxTotalCount("");
    setMinPlaytime("");
    setMaxPlaytime("");
    setSelectedTags([]);
  };

  const hasActiveFilters = () => {
    return keyword || minMaleCount || maxMaleCount || minFemaleCount || 
           maxFemaleCount || minTotalCount || maxTotalCount || 
           minPlaytime !== "" || maxPlaytime !== "" || selectedTags.length > 0;
  };

  return (
    <>
      {/* フローティング検索ボタン（モバイルのみ、フッターメニューの上に配置） */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gray-900 text-white text-sm font-bold shadow-lg"
          aria-label="詳細検索を開く"
          aria-expanded={isOpen}
          aria-controls="mobile-search-panel"
        >
          <FaSearch size={14} />
          絞り込み
          {hasActiveFilters() && <span className="w-2 h-2 rounded-full bg-theater-primary-400" aria-label="条件を指定中" />}
        </button>
      </div>

      {/* モバイル検索パネル */}
      <div id="mobile-search-panel" className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 overflow-hidden ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`} aria-hidden={!isOpen}>
        <div className="bg-white h-full w-full overflow-y-auto overflow-x-hidden">
          {/* ヘッダー */}
          <div className="sticky top-0 bg-white text-gray-900 px-4 h-14 flex items-center justify-between border-b border-[#D9D5CF] z-10">
            <h2 className="text-lg font-bold my-0">絞り込み</h2>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="閉じる">
              <FaTimes size={24} />
            </button>
          </div>

          {/* キーワード検索（常に表示） */}
          <div className="p-4">
            <div className="relative">
              <input
                type="search"
                placeholder="作品名・作者名で検索"
                className="w-full h-11 px-3 pr-10 rounded border border-[#D9D5CF] focus:border-theater-primary-600 focus:outline-none"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="作品名・作者名で検索"
                enterKeyHint="search"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* クイック選択プリセット */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-0">よく使われる条件</h3>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((preset, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="h-9 px-4 bg-white border border-gray-300 rounded-full text-sm text-gray-800 active:border-theater-primary-600"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* アコーディオン形式のフィルター */}
          <div className="p-4">
            {/* 人数フィルター */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => toggleSection("people")}
                className="w-full flex items-center justify-between py-3 border-b border-[#D9D5CF] text-gray-900"
                aria-expanded={expandedSections.includes("people")}
                aria-controls="mobile-search-people"
              >
                <span className="font-bold flex items-center">
                  
                  人数で絞り込む
                </span>
                {expandedSections.includes("people") ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.includes("people") && (
                <div id="mobile-search-people" className="mt-3 p-3 bg-white rounded-lg border border-theater-neutral-200">
                  <div className="space-y-4">
                    <RangeRow label="男性人数" minVal={minMaleCount} maxVal={maxMaleCount} setMin={setMinMaleCount} setMax={setMaxMaleCount} />
                    <RangeRow label="女性人数" minVal={minFemaleCount} maxVal={maxFemaleCount} setMin={setMinFemaleCount} setMax={setMaxFemaleCount} />
                    <RangeRow label="総人数" minVal={minTotalCount} maxVal={maxTotalCount} setMin={setMinTotalCount} setMax={setMaxTotalCount} />
                  </div>
                </div>
              )}
            </div>

            {/* 上演時間フィルター */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => toggleSection("time")}
                className="w-full flex items-center justify-between py-3 border-b border-[#D9D5CF] text-gray-900"
                aria-expanded={expandedSections.includes("time")}
                aria-controls="mobile-search-time"
              >
                <span className="font-bold flex items-center">
                  
                  上演時間で絞り込む
                </span>
                {expandedSections.includes("time") ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.includes("time") && (
                <div id="mobile-search-time" className="mt-3 p-3 bg-white rounded-lg border border-theater-neutral-200">
                  <RangeRow
                    minVal={minPlaytime} maxVal={maxPlaytime}
                    setMin={setMinPlaytime} setMax={setMaxPlaytime}
                    minPlaceholder="0分" maxPlaceholder="上限なし"
                  />
                </div>
              )}
            </div>

            {/* カテゴリーフィルター */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => toggleSection("category")}
                className="w-full flex items-center justify-between py-3 border-b border-[#D9D5CF] text-gray-900"
                aria-expanded={expandedSections.includes("category")}
                aria-controls="mobile-search-category"
              >
                <span className="font-bold flex items-center">
                  
                  カテゴリーで絞り込む
                  {selectedTags.length > 0 && (
                    <span className="ml-2 bg-theater-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      {selectedTags.length}
                    </span>
                  )}
                </span>
                {expandedSections.includes("category") ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.includes("category") && (
                <div id="mobile-search-category" className="mt-3 p-3 bg-white rounded-lg border border-theater-neutral-200">
                  {categoriesLoading ? (
                    <p className="text-center text-gray-500">読み込み中...</p>
                  ) : (
                    <TagSelector
                      category_ids={categories}
                      selectedTags={selectedTags}
                      setSelectedTags={setSelectedTags}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="sticky bottom-0 p-4 bg-white border-t border-[#D9D5CF]">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 h-12 bg-white border border-gray-300 text-gray-800 rounded"
              >
                リセット
              </button>
              <button
                type="button"
                onClick={handleSearch}
                className="flex-1 h-12 bg-theater-primary-600 text-white rounded font-bold"
              >
                検索する
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* デスクトップ用（既存のSearchFormをそのまま使用） */}
      <div className="hidden md:block">
        {/* ここに既存のSearchFormの内容を配置するか、別コンポーネントとして呼び出す */}
      </div>
    </>
  );
}