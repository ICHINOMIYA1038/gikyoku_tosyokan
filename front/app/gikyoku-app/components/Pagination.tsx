// Pagination.tsx

import React, { useEffect, useState } from "react";

interface PaginationProps {
  pagination: {
    count: number;
    current: string;
    per: string;
    limit_page: number;
  };
  setPage: (page: string) => void;
}

const Pagination = ({ pagination, setPage }: any) => {
  const totalPages = Math.ceil(pagination.count / parseInt(pagination.per, 10));
  const currentPage = parseInt(pagination.current, 10);

  useEffect(() => {}, []);
  const pageNumbers = [];
  for (let i = 1; i <= Math.min(pagination.limit_page, totalPages); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="pagination flex flex-wrap">
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`mx-1 py-2 px-2 ${
            currentPage === pageNumber
              ? "bg-blue-500 text-white"
              : "text-gray-700"
          } hover:bg-gray-300 cursor-pointer`}
          onClick={() => setPage(pageNumber.toString())}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
