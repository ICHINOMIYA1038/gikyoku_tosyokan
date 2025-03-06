import React, { SetStateAction, useState, useEffect } from "react";
import TagSelector from "./TagSelecter";
import { useQuery } from "@tanstack/react-query";

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
  const [keyword, setKeyword] = useState<string>("");
  const [minMaleCount, setMinMaleCount] = useState<string>("");
  const [maxMaleCount, setMaxMaleCount] = useState<string>("");
  const [minFemaleCount, setMinFemaleCount] = useState<string>("");
  const [maxFemaleCount, setMaxFemaleCount] = useState<string>("");
  const [minTotalCount, setMinTotalCount] = useState<string>("");
  const [maxTotalCount, setMaxTotalCount] = useState<string>("");
  const [minPlaytime, setMinPlaytime] = useState<number>(0);
  const [maxPlaytime, setMaxPlaytime] = useState<number>(5);

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
    minPlaytime: minPlaytime.toString(),
    maxPlaytime: maxPlaytime.toString(),
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

  useEffect(() => {
    handleSubmit();
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
    <div className="search-form relative">
      <div className="tabs flex mb-4 absolute -top-4">
        <button
          className={`tab ${activeTab === "search" ? "active" : ""}`}
          onClick={() => setActiveTab("search")}
          style={{
            backgroundColor: activeTab === "search" ? "#f0e68c" : "#fffacd",
            border: "1px solid #ccc",
            borderBottom: activeTab === "search" ? "none" : "1px solid #ccc",
            borderRadius: "5px 5px 0 0",
            padding: "10px 20px",
            marginRight: "5px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
          }}
        >
          検索
        </button>
        <button
          className={`tab ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
          style={{
            backgroundColor: activeTab === "categories" ? "#f0e68c" : "#fffacd",
            border: "1px solid #ccc",
            borderBottom: activeTab === "categories" ? "none" : "1px solid #ccc",
            borderRadius: "5px 5px 0 0",
            padding: "10px 20px",
            cursor: "pointer",
            position: "relative",
            zIndex: 1,
          }}
        >
          カテゴリー
        </button>
      </div>

      <div className="pt-8">
        {activeTab === "search" && (
          <div>
            <div>
              <h3 className="text-lg font-bold mb-1">キーワード</h3>
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
                  <h3 className="text-lg font-bold mb-1">男性人数</h3>
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
                  <h3 className="text-lg font-bold mb-1">女性人数</h3>
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
                  <h3 className="text-lg font-bold mb-1">総人数</h3>
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
                  <h3 className="text-lg font-bold mb-1">上演時間</h3>
                </div>
                <div className="pb-3 flex items-center">
                  <select
                    value={minPlaytime}
                    onChange={(e) => setMinPlaytime(parseInt(e.target.value))}
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black mr-1"
                  >
                    <option value={0}>0分</option>
                    <option value={1}>30分</option>
                    <option value={2}>60分</option>
                    <option value={3}>90分</option>
                    <option value={4}>120分</option>
                  </select>

                  <span>〜</span>
                  <select
                    value={maxPlaytime}
                    onChange={(e) => setMaxPlaytime(parseInt(e.target.value))}
                    className="w-1/2 bg-gray-50 rounded-md border border-solid border-black ml-1"
                  >
                    <option value={1}>30分</option>
                    <option value={2}>60分</option>
                    <option value={3}>90分</option>
                    <option value={4}>120分</option>
                    <option value={5}>∞</option>
                  </select>
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
