import React, { SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/router";
import TagSelector from "./TagSelecter";

import { useQuery } from "@tanstack/react-query";

const getPosts = async ({ queryKey }: any): Promise<any> => {
  if (queryKey === undefined || queryKey === null) {
    throw new Error("queryKey is undefined or null");
  }
  const res = await fetch(`/api/search/?${queryKey}`);
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

  const { data, isLoading, error } = useQuery({
    queryKey: [query],
    queryFn: getPosts,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: Infinity,
  });

  const router = useRouter();

  interface Tag {
    id: number;
    name: string;
  }

  const category_ids: Tag[] = [
    { id: 1, name: "岸田國士戯曲賞" },
    { id: 2, name: "OMS戯曲賞" },
    { id: 3, name: "新人戯曲賞" },
    { id: 4, name: "無料で読める！" },
    { id: 5, name: "鶴屋南北戯曲賞" },
    { id: 6, name: "60分以内" },
    { id: 7, name: "人数多数" },
    { id: 8, name: "会話劇" },
    // 他のタグを追加
  ];

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
      // レスポンスデータを使って何かを行う
    } catch (error) {
      console.error("An error occurred:", error);
      // エラーハンドリング
    }
  };

  return (
    <div>
      <div>
        <h3 className="text-xl font-bold mb-1">キーワード</h3>
      </div>
      <div className="pb-5">
        <input
          className="w-full p-5 bg-gray-50 rounded-md border border-solid border-black"
          value={keyword}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setKeyword(e.target.value)
          }
        />
      </div>
      <div className="md:flex">
        <div className="md:w-1/2">
          <div>
            <h3 className="text-xl font-bold  mb-1">男性人数</h3>
          </div>
          <div className="pb-5 ">
            <input
              className="w-2/5 bg-gray-50 rounded-md border border-solid border-black"
              type="number"
              value={minMaleCount}
              onChange={(e) => setMinMaleCount(e.target.value)}
            />
            <span>〜</span>
            <input
              className="w-2/5 bg-gray-50 rounded-md border border-solid border-black"
              type="number"
              value={maxMaleCount}
              onChange={(e) => setMaxMaleCount(e.target.value)}
            />
          </div>

          <div>
            <h3 className="text-xl font-bold  mb-1">女性人数</h3>
          </div>
          <div className="pb-5 ">
            <input
              className="w-2/5 bg-gray-50 rounded-md border border-solid border-black"
              type="number"
              value={minFemaleCount}
              onChange={(e) => setMinFemaleCount(e.target.value)}
            />
            <span>〜</span>
            <input
              className="w-2/5 bg-gray-50 rounded-md border border-solid border-black"
              type="number"
              value={maxFemaleCount}
              onChange={(e) => setMaxFemaleCount(e.target.value)}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold  mb-1">総人数</h3>
          </div>
          <div className="pb-5 ">
            <input
              className="w-2/5 bg-gray-50 rounded-md border border-solid border-black"
              type="number"
              value={minTotalCount}
              onChange={(e) => setMinTotalCount(e.target.value)}
            />
            <span>〜</span>
            <input
              className="w-2/5 bg-gray-50 rounded-md border border-solid border-black"
              type="number"
              value={maxTotalCount}
              onChange={(e) => setMaxTotalCount(e.target.value)}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">上演時間</h3>
          </div>
          <div className="pb-5 ">
            <select
              value={minPlaytime}
              onChange={(e) => setMinPlaytime(parseInt(e.target.value))}
              className="w-2/5 bg-gray-50 rounded-md border border-solid border-black"
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
              className="w-2/5 bg-gray-50 rounded-md border border-solid border-black"
            >
              <option value={1}>30分</option>
              <option value={2}>60分</option>
              <option value={3}>90分</option>
              <option value={4}>120分</option>
              <option value={5}>∞</option>
            </select>
          </div>
        </div>
        <div className="md:w-1/2">
          <TagSelector
            category_ids={category_ids}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>
      </div>
      <div>
        <div className="font-bold text-white bg-green-600">
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
  );
}
