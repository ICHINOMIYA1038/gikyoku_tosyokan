import React, { SetStateAction, useState, useEffect } from "react";
import TagSelector from "./TagSelecter";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FaSearch, FaTag, FaUsers, FaClock, FaFilter } from "react-icons/fa";

const getCategories = async (): Promise<any> => {
  const res = await fetch("/api/categories");
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
};

export default function SearchForm({
  setData,
  page,
  setPage,
  sort_by,
  sortDirection,
  onSearch,
}: any) {
  const router = useRouter();
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
  const [activeTab, setActiveTab] = useState<string>("search");
  const per = 8;
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
    categories: Array.isArray(selectedTags)
      ? selectedTags.join(",")
      : selectedTags,
    sortDirection,
    sort_by,
  };

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery(
    ["categories"],
    getCategories
  );

  // 初期化フラグ
  const [isInitialized, setIsInitialized] = useState(false);

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

    // パラメータがある場合は初期化完了として検索実行
    if (hasParams && !isInitialized) {
      setIsInitialized(true);
      // 少し遅延させて状態の更新を待つ
      setTimeout(() => {
        handleSubmit();
      }, 100);
    }
  }, [router.isReady, router.query, isInitialized]);

  useEffect(() => {
    // URLパラメータがない場合のみ初回検索を実行
    if (!router.query.minPlaytime && !router.query.maxPlaytime && !router.query.keyword && !router.query.category && !router.query.minTotalCount && !router.query.maxTotalCount && !router.query.minMaleCount && !router.query.maxMaleCount && !router.query.minFemaleCount && !router.query.maxFemaleCount) {
      handleSubmit();
    }
  }, []);

  useEffect(() => {
    onSearch();
    handleSubmit();
  }, [page]);

  useEffect(() => {
    setPage(1);
    handleSubmit();
  }, [sort_by, sortDirection]);

  useEffect(() => {
    handleSubmit();
  }, [selectedTags]);

  const handleSubmit = async () => {
    setData([]);

    const query = new URLSearchParams(searchParams).toString();

    // URLバーにパラメータを反映
    const urlParams = new URLSearchParams();
    if (keyword) urlParams.set("keyword", keyword);
    if (minTotalCount) urlParams.set("minTotalCount", minTotalCount);
    if (maxTotalCount) urlParams.set("maxTotalCount", maxTotalCount);
    if (minMaleCount) urlParams.set("minMaleCount", minMaleCount);
    if (maxMaleCount) urlParams.set("maxMaleCount", maxMaleCount);
    if (minFemaleCount) urlParams.set("minFemaleCount", minFemaleCount);
    if (maxFemaleCount) urlParams.set("maxFemaleCount", maxFemaleCount);
    if (minPlaytime) urlParams.set("minPlaytime", minPlaytime);
    if (maxPlaytime) urlParams.set("maxPlaytime", maxPlaytime);
    if (selectedTags.length > 0) urlParams.set("categories", selectedTags.join(","));
    const urlQuery = urlParams.toString();
    router.push(urlQuery ? `/?${urlQuery}` : "/", undefined, { shallow: true });

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* タブヘッダー */}
      <div className="flex border-b border-gray-100">
        <button
          className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "search"
              ? "text-pink-600 bg-white border-b-2 border-pink-500"
              : "text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("search")}
        >
          <FaSearch />
          詳細検索
        </button>
        <button
          className={`flex-1 py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === "categories"
              ? "text-pink-600 bg-white border-b-2 border-pink-500"
              : "text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          <FaTag />
          カテゴリーから探す
        </button>
      </div>

      <div className="p-6">
        {activeTab === "search" && (
          <div className="space-y-6">
            {/* キーワード検索 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">キーワード</label>
              <div className="relative">
                <input
                  className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-300 transition-all outline-none"
                  placeholder="作品名、作者名など..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (page != 1) {
                            setPage(1);
                          } else {
                            handleSubmit();
                            onSearch();
                          }
                    }
                  }}
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 人数条件 */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 font-bold border-b border-gray-200 pb-2 mb-2">
                  <FaUsers className="text-blue-500" />
                  <span>人数条件</span>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">総人数</label>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-full p-2 bg-white border border-gray-200 rounded text-center focus:border-pink-300 outline-none"
                      type="number"
                      placeholder="下限"
                      value={minTotalCount}
                      onChange={(e) => setMinTotalCount(e.target.value)}
                    />
                    <span className="text-gray-400">〜</span>
                    <input
                      className="w-full p-2 bg-white border border-gray-200 rounded text-center focus:border-pink-300 outline-none"
                      type="number"
                      placeholder="上限"
                      value={maxTotalCount}
                      onChange={(e) => setMaxTotalCount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">男性</label>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-full p-2 bg-white border border-gray-200 rounded text-center focus:border-pink-300 outline-none"
                      type="number"
                      placeholder="0"
                      value={minMaleCount}
                      onChange={(e) => setMinMaleCount(e.target.value)}
                    />
                    <span className="text-gray-400">〜</span>
                    <input
                      className="w-full p-2 bg-white border border-gray-200 rounded text-center focus:border-pink-300 outline-none"
                      type="number"
                      placeholder="上限なし"
                      value={maxMaleCount}
                      onChange={(e) => setMaxMaleCount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">女性</label>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-full p-2 bg-white border border-gray-200 rounded text-center focus:border-pink-300 outline-none"
                      type="number"
                      placeholder="0"
                      value={minFemaleCount}
                      onChange={(e) => setMinFemaleCount(e.target.value)}
                    />
                    <span className="text-gray-400">〜</span>
                    <input
                      className="w-full p-2 bg-white border border-gray-200 rounded text-center focus:border-pink-300 outline-none"
                      type="number"
                      placeholder="上限なし"
                      value={maxFemaleCount}
                      onChange={(e) => setMaxFemaleCount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 上演時間 */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100 h-fit">
                <div className="flex items-center gap-2 text-gray-700 font-bold border-b border-gray-200 pb-2 mb-2">
                  <FaClock className="text-green-500" />
                  <span>上演時間（分）</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    className="w-full p-2 bg-white border border-gray-200 rounded text-center focus:border-pink-300 outline-none"
                    type="number"
                    min="0"
                    max="999"
                    placeholder="0"
                    value={minPlaytime}
                    onChange={(e) => setMinPlaytime(e.target.value)}
                  />
                  <span className="text-gray-400">〜</span>
                  <input
                    className="w-full p-2 bg-white border border-gray-200 rounded text-center focus:border-pink-300 outline-none"
                    type="number"
                    min="0"
                    max="999"
                    placeholder="上限なし"
                    value={maxPlaytime}
                    onChange={(e) => setMaxPlaytime(e.target.value)}
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => {
                      if (page != 1) {
                        setPage(1);
                      } else {
                        handleSubmit();
                        onSearch();
                      }
                    }}
                  >
                    <FaSearch />
                    この条件で検索する
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="w-full">
            {categoriesLoading ? (
              <div className="text-center py-8 text-gray-500">カテゴリーを読み込み中...</div>
            ) : categoriesError ? (
              <div className="text-center py-8 text-red-500">カテゴリーの読み込みに失敗しました</div>
            ) : (
              <TagSelector
                category_ids={categories}
                selectedTags={selectedTags}
                setSelectedTags={(tags) => {
                  setSelectedTags(tags);
                }}
              />
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-100">
               <button
                  className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => {
                    if (page != 1) {
                      setPage(1);
                    } else {
                      handleSubmit();
                      onSearch();
                    }
                  }}
                >
                  <FaSearch />
                  選択したカテゴリーで検索
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}