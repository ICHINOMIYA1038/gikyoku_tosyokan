import Link from 'next/link';
import { groupTypeLabels } from '@/lib/university-theater-constants';

type Group = {
  slug: string;
  name: string;
  groupType: string;
  description?: string | null;
  prefecture?: string | null;
  universities?: { university: { name: string; prefecture: string } }[];
};

// 劇団の一覧を表組みの行で出す。種別の色分けはせず、文字で示す
export default function TheaterGroupList({ groups, linkPrefix = '/theater-groups' }: { groups: Group[]; linkPrefix?: string }) {
  return (
    <div className="border-t border-[#D9D5CF]">
      <div className="hidden md:grid grid-cols-[minmax(0,1fr)_6rem_10rem] gap-x-4 py-2 px-2 text-xs font-medium text-gray-600 bg-[#F4F2EE] border-b border-[#D9D5CF]">
        <span>劇団</span>
        <span>種別</span>
        <span>地域・大学</span>
      </div>
      <ul>
        {groups.map((g) => {
          const type = groupTypeLabels[g.groupType]?.label || g.groupType;
          const universities = g.universities?.map((u) => u.university.name) ?? [];
          const prefectures = universities.length > 0
            ? Array.from(new Set(g.universities!.map((u) => u.university.prefecture)))
            : g.prefecture ? [g.prefecture] : [];
          const place = [prefectures.join('・'), universities.join('、')].filter(Boolean).join(' ');
          return (
            <li key={g.slug} className="border-b border-[#D9D5CF]">
              <Link
                href={`${linkPrefix}/${g.slug}`}
                className="group grid md:grid-cols-[minmax(0,1fr)_6rem_10rem] gap-x-4 py-3 px-2 hover:bg-[#F4F2EE] transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-serif font-bold text-[17px] leading-snug text-gray-900 group-hover:text-theater-primary-700">
                    {g.name}
                  </p>
                  <p className="md:hidden mt-0.5 text-sm text-gray-700">{[type, place].filter(Boolean).join('　/　')}</p>
                  {g.description && <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{g.description}</p>}
                </div>
                <span className="hidden md:block text-sm text-gray-800">{type}</span>
                <span className="hidden md:block text-sm text-gray-800 truncate">{place || '—'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
