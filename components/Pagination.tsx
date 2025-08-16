// Pagination.tsx

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface PaginationProps {
  pagination: {
    count: number;
    current: string;
    per: string;
    limit_page: number;
  };
  setPage: (page: string) => void;
  baseUrl?: string;
}

const Pagination = ({ pagination, setPage, baseUrl }: any) => {
  const router = useRouter();
  const totalPages = Math.ceil(pagination.count / parseInt(pagination.per, 10));
  const currentPage = parseInt(pagination.current, 10);

  // ページ番号の範囲を計算
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // 表示する最大ページ数
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber.toString());
    
    // URLパラメータを更新（SEO対応）
    if (baseUrl) {
      const query = { ...router.query, page: pageNumber };
      router.push({
        pathname: baseUrl,
        query
      }, undefined, { shallow: true });
    }
  };

  return (
    <nav 
      className="pagination flex flex-wrap items-center justify-center my-4"
      role="navigation"
      aria-label="ページネーション"
    >
      {/* 前へボタン */}
      {currentPage > 1 && (
        <button
          className="mx-1 py-2 px-3 text-gray-700 hover:bg-gray-300 rounded cursor-pointer"
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="前のページへ"
          rel="prev"
        >
          ← 前へ
        </button>
      )}
      
      {/* 最初のページ */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            className="mx-1 py-2 px-3 text-gray-700 hover:bg-gray-300 rounded cursor-pointer"
            onClick={() => handlePageChange(1)}
            aria-label="1ページ目へ"
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="mx-1">...</span>}
        </>
      )}
      
      {/* ページ番号 */}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`mx-1 py-2 px-3 rounded ${
            currentPage === pageNumber
              ? "bg-blue-500 text-white font-bold"
              : "text-gray-700 hover:bg-gray-300"
          } cursor-pointer transition-colors`}
          onClick={() => handlePageChange(pageNumber)}
          aria-label={`${pageNumber}ページ目へ`}
          aria-current={currentPage === pageNumber ? "page" : undefined}
        >
          {pageNumber}
        </button>
      ))}
      
      {/* 最後のページ */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="mx-1">...</span>}
          <button
            className="mx-1 py-2 px-3 text-gray-700 hover:bg-gray-300 rounded cursor-pointer"
            onClick={() => handlePageChange(totalPages)}
            aria-label={`${totalPages}ページ目（最後）へ`}
          >
            {totalPages}
          </button>
        </>
      )}
      
      {/* 次へボタン */}
      {currentPage < totalPages && (
        <button
          className="mx-1 py-2 px-3 text-gray-700 hover:bg-gray-300 rounded cursor-pointer"
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label="次のページへ"
          rel="next"
        >
          次へ →
        </button>
      )}
      
      {/* ページ情報 */}
      <div className="ml-4 text-sm text-gray-600">
        全{pagination.count}件 ({currentPage}/{totalPages}ページ)
      </div>
    </nav>
  );
};

export default Pagination;
