import { SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SearchForm({ setData, page }: any) {
  const [keyword, setKeyword] = useState<string>("");
  const [minMaleCount, setMinMaleCount] = useState<string>("");
  const [maxMaleCount, setMaxMaleCount] = useState<string>("");
  const [minFemaleCount, setMinFemaleCount] = useState<string>("");
  const [maxFemaleCount, setMaxFemaleCount] = useState<string>("");
  const [minTotalCount, setMinTotalCount] = useState<string>("0");
  const [maxTotalCount, setMaxTotalCount] = useState<string>("");
  const [minPlaytime, setMinPlaytime] = useState<number>(0);
  const [maxPlaytime, setMaxPlaytime] = useState<number>(4);
  const [sort_by, setSortIndex] = useState<number>(0);
  const [sortDirection, setSortDirection] = useState<number>(0);
  const [tags, setSelectedTags] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    handleSubmit();
  }, [page]);

  const handleSubmit = async () => {
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
    };

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
    <div className="border-solid h-3/4 border border-black p-10 m-5 lg:w-1/2 lg:sticky lg:top-24">
      <div>
        <div>
          <h3 className="text-xl font-bold  mb-1">キーワード</h3>
        </div>
        <div className="w-full pb-5 ">
          <input
            className="w-full p-5"
            value={keyword}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setKeyword(e.target.value)
            }
          />
        </div>
      </div>

      <div>
        <div>
          <h3 className="text-xl font-bold  mb-1">男性人数</h3>
        </div>
        <div className="pb-5 ">
          <input
            className="w-1/5"
            type="number"
            value={minMaleCount}
            onChange={(e) => setMinMaleCount(e.target.value)}
          />
          <span>〜</span>
          <input
            className="w-1/5"
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
            className="w-1/5"
            type="number"
            value={minFemaleCount}
            onChange={(e) => setMinFemaleCount(e.target.value)}
          />
          <span>〜</span>
          <input
            className="w-1/5"
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
            className="w-1/5"
            type="number"
            value={minTotalCount}
            onChange={(e) => setMinTotalCount(e.target.value)}
          />
          <span>〜</span>
          <input
            className="w-1/5"
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
            className="w-1/5"
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
            className="w-1/5"
          >
            <option value={1}>30分</option>
            <option value={2}>60分</option>
            <option value={3}>90分</option>
            <option value={4}>120分</option>
            <option value={5}>∞</option>
          </select>
        </div>
      </div>
      <div>
        <div className="border-2 font-bold border-gray-300 border-gray-300 bg-green-200">
          <button className="w-full " onClick={handleSubmit}>
            検索
          </button>
        </div>
      </div>
    </div>
  );
}
