import Link from 'next/link';
import { FaUsers, FaUniversity, FaTheaterMasks } from 'react-icons/fa';
import SocialLinks from './SocialLinks';

type TheaterGroupCardProps = {
  group: {
    slug: string;
    name: string;
    groupType: string;
    description?: string | null;
    memberCount?: number | null;
    website?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    corich?: string | null;
    universities?: {
      university: { name: string; slug: string; prefecture: string };
    }[];
  };
};

const groupTypeLabels: Record<string, { label: string; color: string }> = {
  STUDENT: { label: '学生劇団', color: 'bg-blue-100 text-blue-800' },
  INTERCOLLEGE: { label: 'インカレ', color: 'bg-purple-100 text-purple-800' },
  ACADEMIC: { label: '大学学科', color: 'bg-green-100 text-green-800' },
  AMATEUR: { label: '社会人', color: 'bg-orange-100 text-orange-800' },
  PROFESSIONAL: { label: 'プロ', color: 'bg-red-100 text-red-800' },
  YOUTH: { label: 'ユース', color: 'bg-teal-100 text-teal-800' },
};

export default function TheaterGroupCard({ group }: TheaterGroupCardProps) {
  const typeInfo = groupTypeLabels[group.groupType] || { label: group.groupType, color: 'bg-gray-100 text-gray-800' };

  return (
    <div className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/theater-groups/${group.slug}`} className="flex-1">
            <h3 className="font-serif font-bold text-base text-gray-800 line-clamp-2 group-hover:text-pink-700 transition-colors">
              {group.name}
            </h3>
          </Link>
          <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        </div>

        {group.universities && group.universities.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <FaUniversity className="text-gray-400 shrink-0" />
            <span className="truncate">
              {group.universities.map((u) => u.university.name).join('、')}
            </span>
          </div>
        )}

        {group.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">{group.description}</p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between">
            {group.memberCount && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FaUsers className="text-blue-500/60" />
                <span>{group.memberCount}名</span>
              </div>
            )}
            <SocialLinks
              website={group.website}
              twitter={group.twitter}
              instagram={group.instagram}
              corich={group.corich}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
