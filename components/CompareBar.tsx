import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaBalanceScale, FaTimes } from "react-icons/fa";
import { getCompareList, clearCompare } from "@/lib/favorites";

const CompareBar: React.FC = () => {
  const router = useRouter();
  const [compareList, setCompareList] = useState<number[]>([]);

  useEffect(() => {
    setCompareList(getCompareList());

    const handler = () => setCompareList(getCompareList());
    window.addEventListener("compare-changed", handler);
    return () => window.removeEventListener("compare-changed", handler);
  }, []);

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FaBalanceScale className="text-blue-500" />
          <span>{compareList.length}作品を比較中</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              router.push(`/compare?ids=${compareList.join(",")}`);
            }}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            比較する
          </button>
          <button
            onClick={() => clearCompare()}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="比較リストをクリア"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
