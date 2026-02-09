import Link from 'next/link';
import { FaUsers, FaUniversity, FaTheaterMasks, FaMapMarkerAlt } from 'react-icons/fa';
import SocialLinks from './SocialLinks';
import { groupTypeLabels } from '@/lib/university-theater-constants';

type TheaterGroupCardProps = {
  group: {
    slug: string;
    name: string;
    groupType: string;
    description?: string | null;
    memberCount?: number | null;
    prefecture?: string | null;
    website?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    corich?: string | null;
    universities?: {
      university: { name: string; slug: string; prefecture: string };
    }[];
  };
  linkPrefix?: string;
};

export default function TheaterGroupCard({ group, linkPrefix = '/theater-groups' }: TheaterGroupCardProps) {
  const typeInfo = groupTypeLabels[group.groupType] || { label: group.groupType, color: 'bg-gray-100 text-gray-800', border: 'border-gray-300' };
  const prefectures = group.universities && group.universities.length > 0
    ? Array.from(new Set(group.universities.map((u) => u.university.prefecture)))
    : group.prefecture ? [group.prefecture] : [];

  return (
    <div className={`group bg-white rounded-lg border border-gray-100 border-l-[3px] ${typeInfo.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col`}>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`${linkPrefix}/${group.slug}`} className="flex-1">
            <h3 className={`font-serif font-bold text-base text-gray-800 line-clamp-2 transition-colors ${linkPrefix === '/shogekijo' ? 'group-hover:text-orange-700' : 'group-hover:text-pink-700'}`}>
              {group.name}
            </h3>
          </Link>
          <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium rounded ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        </div>

        {group.universities && group.universities.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <FaUniversity className="text-gray-400 shrink-0" />
            <span className="truncate">
              {group.universities.map((u) => u.university.name).join('、')}
            </span>
          </div>
        )}

        {prefectures.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <FaMapMarkerAlt className="text-pink-400/60 shrink-0" />
            <span>{prefectures.join('・')}</span>
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
