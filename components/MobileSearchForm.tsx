import React, { SetStateAction, useState, useEffect } from "react";
import { FaSearch, FaTimes, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";
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
    label: "少人数\n(〜5人)",
    icon: "👥",
    params: { minTotalCount: "", maxTotalCount: "5" }
  },
  {
    label: "中人数\n(6〜10人)",
    icon: "👥👥",
    params: { minTotalCount: "6", maxTotalCount: "10" }
  },
  {
    label: "短時間\n(〜30分)",
    icon: "⏱️",
    params: { minPlaytime: "0", maxPlaytime: "30" }
  },
  {
    label: "標準時間\n(30〜60分)",
    icon: "⏰",
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
  const [isInitialized, setIsInitialized] = useState(false);
  
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
    
    if (router.query.minPlaytime) {
      setMinPlaytime(router.query.minPlaytime as string);
      hasParams = true;
    }
    if (router.query.maxPlaytime) {
      setMaxPlaytime(router.query.maxPlaytime as string);
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
    
    // パラメータがある場合は初期化完了として検索実行
    if (hasParams && !isInitialized) {
      setIsInitialized(true);
      setTimeout(() => {
        handleSubmit();
      }, 100);
    }
  }, [router.isReady, router.query, isInitialized]);

  useEffect(() => {
    // URLパラメータがない場合のみ初回検索を実行
    if (!router.query.minPlaytime && !router.query.maxPlaytime && !router.query.keyword && !router.query.category) {
      handleSubmit();
    }
  }, []);

  useEffect(() => {
    handleSubmit();
  }, [page, sort_by, sortDirection, selectedTags]);

  const handleSubmit = async () => {
    setData([]);
    const query = new URLSearchParams(searchParams).toString();

    try {
      const response = await fetch(`/api/search?${query}`);
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
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
          onClick={() => setIsOpen(true)}
          className="bg-theater-primary-300 text-white p-4 rounded-full shadow-lg hover:bg-theater-primary-400 transition-all transform hover:scale-110"
          aria-label="詳細検索を開く"
        >
          <FaSearch size={24} />
          {hasActiveFilters() && (
            <span className="absolute -top-1 -right-1 bg-theater-accent-yellow text-theater-neutral-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              !
            </span>
          )}
        </button>
      </div>

      {/* モバイル検索パネル */}
      <div className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}>
        <div className="bg-white h-full overflow-y-auto">
          {/* ヘッダー */}
          <div className="sticky top-0 bg-theater-primary-300 text-white p-4 flex items-center justify-between shadow-md">
            <h2 className="text-lg font-bold">脚本を検索</h2>
            <button onClick={() => setIsOpen(false)} aria-label="閉じる">
              <FaTimes size={24} />
            </button>
          </div>

          {/* キーワード検索（常に表示） */}
          <div className="p-4 bg-gray-50">
            <div className="relative">
              <input
                type="text"
                placeholder="作品名・作者名で検索"
                className="w-full p-3 pr-10 rounded-lg border border-theater-neutral-300 focus:border-theater-primary-400 focus:outline-none"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* クイック選択プリセット */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-bold text-gray-700 mb-3">クイック選択</h3>
            <div className="grid grid-cols-4 gap-2">
              {quickPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-3 bg-white border border-theater-neutral-300 rounded-lg hover:bg-theater-primary-50 hover:border-theater-primary-400 transition-colors text-center"
                >
                  <div className="text-2xl mb-1">{preset.icon}</div>
                  <div className="text-xs whitespace-pre-line">{preset.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* アコーディオン形式のフィルター */}
          <div className="p-4">
            {/* 人数フィルター */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("people")}
                className="w-full flex items-center justify-between p-3 bg-theater-neutral-100 rounded-lg hover:bg-theater-neutral-200 transition-colors"
              >
                <span className="font-bold flex items-center">
                  <FaFilter className="mr-2" />
                  人数で絞り込む
                </span>
                {expandedSections.includes("people") ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.includes("people") && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-theater-neutral-200">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">男性人数</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          className="flex-1 p-2 border rounded"
                          placeholder="最小"
                          value={minMaleCount}
                          onChange={(e) => setMinMaleCount(e.target.value)}
                        />
                        <span>〜</span>
                        <input
                          type="number"
                          className="flex-1 p-2 border rounded"
                          placeholder="最大"
                          value={maxMaleCount}
                          onChange={(e) => setMaxMaleCount(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">女性人数</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          className="flex-1 p-2 border rounded"
                          placeholder="最小"
                          value={minFemaleCount}
                          onChange={(e) => setMinFemaleCount(e.target.value)}
                        />
                        <span>〜</span>
                        <input
                          type="number"
                          className="flex-1 p-2 border rounded"
                          placeholder="最大"
                          value={maxFemaleCount}
                          onChange={(e) => setMaxFemaleCount(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">総人数</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          className="flex-1 p-2 border rounded"
                          placeholder="最小"
                          value={minTotalCount}
                          onChange={(e) => setMinTotalCount(e.target.value)}
                        />
                        <span>〜</span>
                        <input
                          type="number"
                          className="flex-1 p-2 border rounded"
                          placeholder="最大"
                          value={maxTotalCount}
                          onChange={(e) => setMaxTotalCount(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 上演時間フィルター */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("time")}
                className="w-full flex items-center justify-between p-3 bg-theater-neutral-100 rounded-lg hover:bg-theater-neutral-200 transition-colors"
              >
                <span className="font-bold flex items-center">
                  <FaFilter className="mr-2" />
                  上演時間で絞り込む
                </span>
                {expandedSections.includes("time") ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {expandedSections.includes("time") && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-theater-neutral-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="999"
                      placeholder="0分"
                      value={minPlaytime}
                      onChange={(e) => setMinPlaytime(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <span>〜</span>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      placeholder="上限なし"
                      value={maxPlaytime}
                      onChange={(e) => setMaxPlaytime(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* カテゴリーフィルター */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("category")}
                className="w-full flex items-center justify-between p-3 bg-theater-neutral-100 rounded-lg hover:bg-theater-neutral-200 transition-colors"
              >
                <span className="font-bold flex items-center">
                  <FaFilter className="mr-2" />
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
                <div className="mt-3 p-3 bg-white rounded-lg border border-theater-neutral-200">
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
          <div className="sticky bottom-0 p-4 bg-white border-t shadow-lg">
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 p-3 bg-theater-neutral-200 text-theater-neutral-700 rounded-lg hover:bg-theater-neutral-300 transition-colors"
              >
                リセット
              </button>
              <button
                onClick={handleSearch}
                className="flex-1 p-3 bg-theater-secondary-600 text-white rounded-lg hover:bg-theater-secondary-700 transition-colors font-bold"
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