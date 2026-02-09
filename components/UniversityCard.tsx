import Link from 'next/link';
import { FaUniversity, FaTheaterMasks, FaMapMarkerAlt } from 'react-icons/fa';
import { universityTypeLabels } from '@/lib/university-theater-constants';

type UniversityCardProps = {
  university: {
    slug: string;
    name: string;
    universityType: string;
    prefecture: string;
    region: string;
    _count?: { theaterGroups: number };
  };
};

export default function UniversityCard({ university }: UniversityCardProps) {
  const typeInfo = universityTypeLabels[university.universityType] || { label: university.universityType, color: 'bg-gray-100 text-gray-800', border: 'border-gray-300' };
  const groupCount = university._count?.theaterGroups ?? 0;

  return (
    <Link href={`/universities/${university.slug}`} className="block h-full">
      <div className={`group h-full bg-white rounded-lg border border-gray-100 border-t-[3px] ${typeInfo.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col`}>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-serif font-bold text-base text-gray-800 line-clamp-2 group-hover:text-pink-700 transition-colors">
              {university.name}
            </h3>
            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-pink-500/60" />
              <span>{university.prefecture}</span>
            </div>
            {groupCount > 0 && (
              <div className="flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-full">
                <FaTheaterMasks className="text-purple-500" />
                <span className="font-medium text-purple-700">{groupCount}団体</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
