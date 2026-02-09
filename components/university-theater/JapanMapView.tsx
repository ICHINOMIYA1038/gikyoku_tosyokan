import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaUniversity, FaTheaterMasks, FaChevronRight } from 'react-icons/fa';
import JapanMap, { prefectureToRegion, regionFillColors } from '@/components/map/JapanMap';
import { regionLabels, universityTypeLabels, groupTypeLabels } from '@/lib/university-theater-constants';

type University = {
  name: string;
  slug: string;
  universityType: string;
  groups: { name: string; slug: string; groupType: string }[];
};

type PrefectureStats = {
  universityCount: number;
  groupCount: number;
  universities: University[];
};

type JapanMapViewProps = {
  prefectureData: Record<string, PrefectureStats>;
};

export default function JapanMapView({ prefectureData }: JapanMapViewProps) {
  const [hoveredPref, setHoveredPref] = useState<string | null>(null);
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const selectedData = useMemo(() => {
    if (!selectedPref) return null;
    return prefectureData[selectedPref] || null;
  }, [selectedPref, prefectureData]);

  const prefecturesWithData = useMemo(() => {
    return Object.entries(prefectureData)
      .filter(([, d]) => d.universityCount > 0)
      .sort((a, b) => b[1].groupCount - a[1].groupCount);
  }, [prefectureData]);

  useEffect(() => {
    if (selectedPref && detailRef.current) {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedPref]);

  const hasData = useCallback((prefName: string) => {
    const data = prefectureData[prefName];
    return !!(data && data.universityCount > 0);
  }, [prefectureData]);

  const getTooltip = useCallback((prefName: string) => {
    const data = prefectureData[prefName];
    if (!data || data.universityCount === 0) return null;
    return {
      label: `${data.universityCount}校`,
      subLabel: `${data.groupCount}団体`,
    };
  }, [prefectureData]);

  const handleClick = useCallback((prefName: string) => {
    setSelectedPref((prev) => prev === prefName ? null : prefName);
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-6">
      {/* 左: 地図 */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-4">
          <JapanMap
            hasData={hasData}
            getTooltip={getTooltip}
            selectedPref={selectedPref}
            hoveredPref={hoveredPref}
            onHover={setHoveredPref}
            onClick={handleClick}
          />
        </div>
      </div>

      {/* 右: 詳細パネル */}
      <div className="lg:col-span-2 mt-4 lg:mt-0" ref={detailRef}>
        {selectedPref && selectedData ? (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-800">{selectedPref}</h3>
                  <div className="flex gap-3 text-xs mt-0.5">
                    <span className="text-blue-600">{selectedData.universityCount}校</span>
                    <span className="text-purple-600">{selectedData.groupCount}団体</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPref(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs bg-white/60 rounded-full px-2.5 py-1"
                >
                  閉じる
                </button>
              </div>

              <div className="divide-y divide-gray-50">
                {selectedData.universities.map((uni) => {
                  const typeInfo = universityTypeLabels[uni.universityType];
                  return (
                    <div key={uni.slug} className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FaUniversity className="text-blue-400 shrink-0 text-xs" />
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
                        <div className="ml-5 space-y-1">
                          {uni.groups.map((g) => {
                            const gType = groupTypeLabels[g.groupType];
                            return (
                              <Link
                                key={g.slug}
                                href={`/theater-groups/${g.slug}`}
                                className="flex items-center gap-1.5 group/link"
                              >
                                <FaTheaterMasks className="text-purple-400 text-[10px] shrink-0" />
                                <span className="text-xs text-gray-700 group-hover/link:text-pink-700 transition-colors">
                                  {g.name}
                                </span>
                                {gType && (
                                  <span className={`px-1 py-0 text-[9px] rounded ${gType.color}`}>
                                    {gType.label}
                                  </span>
                                )}
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
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <h3 className="font-serif font-bold text-sm text-gray-800">都道府県別データ</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">地図をクリック、または下の一覧から選択</p>
            </div>
            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
              {prefecturesWithData.map(([pref, data]) => {
                const region = prefectureToRegion[pref];
                return (
                  <button
                    key={pref}
                    onClick={() => setSelectedPref(pref)}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-pink-50/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: regionFillColors[region] }}
                      />
                      <span className="text-sm font-medium text-gray-800 truncate">{pref}</span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {regionLabels[region]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {data.universityCount}校
                      </span>
                      <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                        {data.groupCount}団体
                      </span>
                      <FaChevronRight className="text-gray-300 text-[8px]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
