type PrefectureCellProps = {
  name: string;
  universityCount: number;
  groupCount: number;
  isSelected: boolean;
  onClick: () => void;
};

export default function PrefectureCell({ name, universityCount, groupCount, isSelected, onClick }: PrefectureCellProps) {
  const hasData = universityCount > 0;

  return (
    <button
      onClick={hasData ? onClick : undefined}
      disabled={!hasData}
      className={`rounded-lg p-3 text-left transition-all duration-200 border ${
        !hasData
          ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-default'
          : isSelected
            ? 'bg-pink-50 border-pink-300 shadow-sm ring-1 ring-pink-200'
            : 'bg-white border-gray-150 hover:border-pink-200 hover:shadow-sm cursor-pointer'
      }`}
    >
      <div className={`font-medium text-sm mb-1 ${hasData ? (isSelected ? 'text-pink-800' : 'text-gray-800') : 'text-gray-300'}`}>
        {name}
      </div>
      {hasData && (
        <div className="flex gap-2 text-[10px]">
          <span className="text-blue-600">{universityCount}校</span>
          <span className="text-purple-600">{groupCount}団体</span>
        </div>
      )}
    </button>
  );
}
