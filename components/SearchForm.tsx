import React, { SetStateAction, useState, useEffect, useRef } from "react";
import TagSelector from "./TagSelecter";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";

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

  const submit = () => {
    if (page != 1) {
      setPage(1);
    } else {
      handleSubmit();
      onSearch();
    }
  };

  const clearAll = () => {
    setKeyword("");
    setMinTotalCount("");
    setMaxTotalCount("");
    setMinMaleCount("");
    setMaxMaleCount("");
    setMinFemaleCount("");
    setMaxFemaleCount("");
    setMinPlaytime("");
    setMaxPlaytime("");
    setSelectedTags([]);
  };

  const numberField =
    "w-full min-w-0 h-10 px-2 bg-white border border-[#D9D5CF] rounded text-center text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-theater-primary-600 focus:ring-1 focus:ring-theater-primary-600";

  // 「下限〜上限 単位」の1行
  const rangeRow = (
    label: string,
    unit: string,
    min: string,
    setMin: (v: string) => void,
    max: string,
    setMax: (v: string) => void
  ) => (
    <div>
      <span className="block text-sm font-medium text-gray-800 mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <input className={numberField} type="number" inputMode="numeric" min="0" placeholder="下限" aria-label={`${label}の下限`}
          value={min} onChange={(e) => setMin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        <span className="text-gray-500">〜</span>
        <input className={numberField} type="number" inputMode="numeric" min="0" placeholder="上限" aria-label={`${label}の上限`}
          value={max} onChange={(e) => setMax(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        <span className="text-sm text-gray-600 w-5 flex-shrink-0">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-[#D9D5CF] rounded mb-8">
      <div className="flex items-baseline justify-between px-4 pt-4">
        <h2 className="text-base font-bold text-gray-900 my-0">絞り込み</h2>
        <button type="button" className="text-sm text-gray-600 hover:text-gray-900 underline" onClick={clearAll}>
          条件をクリア
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="search-keyword" className="block text-sm font-medium text-gray-800 mb-1">キーワード</label>
          <div className="relative">
            <input
              id="search-keyword"
              className="w-full h-10 pl-9 pr-3 bg-white border border-[#D9D5CF] rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-theater-primary-600 focus:ring-1 focus:ring-theater-primary-600"
              placeholder="作品名・作者名など"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>
        </div>

        {rangeRow("総人数", "人", minTotalCount, setMinTotalCount, maxTotalCount, setMaxTotalCount)}
        {rangeRow("男性", "人", minMaleCount, setMinMaleCount, maxMaleCount, setMaxMaleCount)}
        {rangeRow("女性", "人", minFemaleCount, setMinFemaleCount, maxFemaleCount, setMaxFemaleCount)}
        {rangeRow("上演時間", "分", minPlaytime, setMinPlaytime, maxPlaytime, setMaxPlaytime)}

        <details className="border-t border-[#D9D5CF] pt-3">
          <summary className="cursor-pointer text-sm font-medium text-gray-800">
            カテゴリで絞り込む{selectedTags.length > 0 ? `（${selectedTags.length}件選択中）` : ""}
          </summary>
          <div className="mt-3">
            {categoriesLoading ? (
              <p className="text-sm text-gray-600">カテゴリを読み込んでいます</p>
            ) : categoriesError ? (
              <p className="text-sm text-theater-primary-700">カテゴリを読み込めませんでした。ページを再読み込みしてください。</p>
            ) : (
              <TagSelector category_ids={categories} selectedTags={selectedTags} setSelectedTags={(tags) => setSelectedTags(tags)} />
            )}
          </div>
        </details>

        <button
          type="button"
          className="w-full h-11 bg-theater-primary-600 text-white font-bold rounded hover:bg-theater-primary-700 transition-colors flex items-center justify-center gap-2"
          onClick={submit}
        >
          <FaSearch className="text-sm" />
          この条件で探す
        </button>
      </div>
    </div>
  );
}
