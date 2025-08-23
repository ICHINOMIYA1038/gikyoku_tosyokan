import React, { SetStateAction, useState, useEffect } from "react";
import TagSelector from "./TagSelecter";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const getPosts = async ({ queryKey }: any): Promise<any> => {
  if (queryKey === undefined || queryKey === null) {
    throw new Error("queryKey is undefined or null");
  }
  const res = await fetch(`/api/search/?${queryKey}`);
  return res.json();
};

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

  const query = new URLSearchParams(searchParams).toString();

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
    if (!router.query.minPlaytime && !router.query.maxPlaytime && !router.query.keyword && !router.query.category) {
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
    <div className="search-form mb-6">
      <div className="tabs flex">
        <button
          className={`tab ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
          style={{
            backgroundColor: activeTab === "search" ? "#4a9e5c" : "#e8f5e9",
            color: activeTab === "search" ? "white" : "#2e7d32",
            border: "1px solid #2e7d32",
            borderBottom: activeTab === "search" ? "none" : "1px solid #2e7d32",
            borderRadius: "8px 8px 0 0",
            padding: "12px 24px",
            marginRight: "5px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          検索
        </button>
        <button
          className={`tab ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
          style={{
            backgroundColor: activeTab === "categories" ? "#4a9e5c" : "#e8f5e9",
            color: activeTab === "categories" ? "white" : "#2e7d32",
            border: "1px solid #2e7d32",
            borderBottom: activeTab === "categories" ? "none" : "1px solid #2e7d32",
            borderRadius: "8px 8px 0 0",
            padding: "12px 24px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          カテゴリー
        </button>
      </div>

      <div
        className="tab-content p-5 bg-white shadow-md"
        style={{
          border: "1px solid #2e7d32",
          borderRadius: "0 8px 8px 8px",
          borderTop: activeTab === "search" ? "4px solid #4a9e5c" : "4px solid #4a9e5c",
          marginTop: "-1px"
        }}
      >
        {activeTab === "search" && (
          <div>
            <div>
              <div className="text-lg font-bold mb-1">キーワード</div>
            </div>
            <div className="pb-3">
              <input
                className="w-full p-3 bg-gray-50 rounded-md border border-solid border-black"
                value={keyword}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setKeyword(e.target.value)
                }
              />
            </div>
            <div className="flex flex-col md:flex-col">
              <div className="w-full">
                <div>
                  <div className="text-lg font-bold mb-1">男性人数</div>
                </div>
                <div className="pb-3 flex items-center">
                  <input
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black mr-1"
                    type="number"
                    value={minMaleCount}
                    onChange={(e) => setMinMaleCount(e.target.value)}
                  />
                  <span>〜</span>
                  <input
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black ml-1"
                    type="number"
                    value={maxMaleCount}
                    onChange={(e) => setMaxMaleCount(e.target.value)}
                  />
                </div>

                <div>
                  <div className="text-lg font-bold mb-1">女性人数</div>
                </div>
                <div className="pb-3 flex items-center">
                  <input
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black mr-1"
                    type="number"
                    value={minFemaleCount}
                    onChange={(e) => setMinFemaleCount(e.target.value)}
                  />
                  <span>〜</span>
                  <input
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black ml-1"
                    type="number"
                    value={maxFemaleCount}
                    onChange={(e) => setMaxFemaleCount(e.target.value)}
                  />
                </div>
                <div>
                  <div className="text-lg font-bold mb-1">総人数</div>
                </div>
                <div className="pb-3 flex items-center">
                  <input
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black mr-1"
                    type="number"
                    value={minTotalCount}
                    onChange={(e) => setMinTotalCount(e.target.value)}
                  />
                  <span>〜</span>
                  <input
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black ml-1"
                    type="number"
                    value={maxTotalCount}
                    onChange={(e) => setMaxTotalCount(e.target.value)}
                  />
                </div>
                <div>
                  <div className="text-lg font-bold mb-1">上演時間（分）</div>
                </div>
                <div className="pb-3 flex items-center">
                  <input
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black mr-1 px-2 py-1"
                    type="number"
                    min="0"
                    max="999"
                    placeholder="0"
                    value={minPlaytime}
                    onChange={(e) => setMinPlaytime(e.target.value)}
                  />
                  <span>〜</span>
                  <input
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black ml-1 px-2 py-1"
                    type="number"
                    min="0"
                    max="999"
                    placeholder="上限なし"
                    value={maxPlaytime}
                    onChange={(e) => setMaxPlaytime(e.target.value)}
                  />
                </div>
                <div className="font-bold text-white bg-green-600 mb-3">
                  <button
                    className="w-full"
                    onClick={() => {
                      if (page != 1) {
                        setPage(1);
                      } else {
                        handleSubmit();
                        onSearch();
                      }
                    }}
                  >
                    検索
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="w-full category-selector">
            {categoriesLoading ? (
              <p>Loading categories...</p>
            ) : categoriesError ? (
              <p>Error loading categories</p>
            ) : (
              <TagSelector
                category_ids={categories}
                selectedTags={selectedTags}
                setSelectedTags={(tags) => {
                  setSelectedTags(tags);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
