import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({ options, value, onChange, label }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt: any) => opt.value === value) || options[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: any) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        type="button"
        className="flex justify-between items-center w-full bg-white border border-green-600 hover:border-green-700 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: "#2e7d32" }}
      >
        <span>{selectedOption.label}</span>
        <svg
          className={`fill-current h-4 w-4 text-green-600 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 9.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-green-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option: any) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${selectedOption.value === option.value ? 'bg-green-100 font-medium text-green-800' : 'text-gray-700'
                }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SortDropdown = ({
  sort_by,
  sortDirection,
  setSortIndex,
  setSortDirection,
}: any) => {
  const sortOptions = [
    { value: "1", label: "最新順" },
    { value: "2", label: "人気順" },
    { value: "3", label: "男性人数" },
    { value: "4", label: "女性人数" },
    { value: "5", label: "総人数" },
    { value: "6", label: "上演時間" },
  ];

  const directionOptions = [
    { value: "0", label: "昇順" },
    { value: "1", label: "降順" },
  ];

  return (
    <div className="flex space-x-4">
      <div className="w-2/3">
        <CustomDropdown
          options={sortOptions}
          value={sort_by.toString()}
          onChange={(value: string) => setSortIndex(Number(value))}
          label="並び替え"
        />
      </div>
      <div className="w-1/3">
        <CustomDropdown
          options={directionOptions}
          value={sortDirection.toString()}
          onChange={(value: string) => setSortDirection(Number(value))}
          label="順序"
        />
      </div>
    </div>
  );
};

export default SortDropdown;
