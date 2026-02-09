import Link from 'next/link';
import { FaUniversity, FaTheaterMasks } from 'react-icons/fa';
import { universityTypeLabels, groupTypeLabels } from '@/lib/university-theater-constants';

type University = {
  name: string;
  slug: string;
  universityType: string;
  groups: { name: string; slug: string; groupType: string }[];
};

type PrefectureDetailProps = {
  prefecture: string;
  universities: University[];
  onClose: () => void;
};

export default function PrefectureDetail({ prefecture, universities, onClose }: PrefectureDetailProps) {
  return (
    <div className="animate-fadeIn bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-lg text-gray-800">{prefecture}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1"
        >
          閉じる
        </button>
      </div>

      <div className="space-y-3">
        {universities.map((uni) => {
          const typeInfo = universityTypeLabels[uni.universityType];
          return (
            <div key={uni.slug} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FaUniversity className="text-blue-400 shrink-0" />
                <Link
                  href={`/universities/${uni.slug}`}
                  className="font-medium text-sm text-gray-800 hover:text-pink-700 transition-colors"
                >
                  {uni.name}
                </Link>
                {typeInfo && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                )}
              </div>
              {uni.groups.length > 0 && (
                <div className="ml-5 flex flex-wrap gap-1.5">
                  {uni.groups.map((g) => {
                    const gType = groupTypeLabels[g.groupType];
                    return (
                      <Link
                        key={g.slug}
                        href={`/theater-groups/${g.slug}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs hover:bg-purple-100 transition-colors"
                      >
                        <FaTheaterMasks className="text-[10px]" />
                        {g.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
