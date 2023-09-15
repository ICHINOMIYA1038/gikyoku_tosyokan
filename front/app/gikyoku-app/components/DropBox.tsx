import React, { useState } from "react";

const SortDropdown = ({
  sort_by,
  sortDirection,
  setSortIndex,
  setSortDirection,
}: any) => {
  return (
    <div className="flex space-x-4">
      <div className="relative inline-flex">
        <select
          className="block appearance-none w-full basic-card border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={sort_by}
          onChange={(e) => setSortIndex(Number(e.target.value))}
        >
          <option value="1">人気順</option>
          <option value="2">最新順</option>
          <option value="3">男性人数</option>
          <option value="4">女性人数</option>
          <option value="5">総人数</option>
          <option value="6">上演時間</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 9.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="relative inline-flex">
        <select
          className="block appearance-none w-full basic-card border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={sortDirection}
          onChange={(e) => setSortDirection(Number(e.target.value))}
        >
          <option value="1">昇順</option>
          <option value="2">降順</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 9.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;
