import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaTheaterMasks, FaChevronRight } from 'react-icons/fa';
import JapanMap, { prefectureToRegion, regionFillColors } from '@/components/map/JapanMap';
import { regionLabels, groupTypeLabels } from '@/lib/university-theater-constants';

type ShogekijoGroup = {
  name: string;
  slug: string;
  groupType: string;
};

type PrefectureGroupData = {
  groupCount: number;
  groups: ShogekijoGroup[];
};

type ShogekijoMapViewProps = {
  prefectureData: Record<string, PrefectureGroupData>;
};

export default function ShogekijoMapView({ prefectureData }: ShogekijoMapViewProps) {
  const [hoveredPref, setHoveredPref] = useState<string | null>(null);
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const selectedData = useMemo(() => {
    if (!selectedPref) return null;
    return prefectureData[selectedPref] || null;
  }, [selectedPref, prefectureData]);

  const prefecturesWithData = useMemo(() => {
    return Object.entries(prefectureData)
      .filter(([, d]) => d.groupCount > 0)
      .sort((a, b) => b[1].groupCount - a[1].groupCount);
  }, [prefectureData]);

  useEffect(() => {
    if (selectedPref && detailRef.current) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedPref]);

  const hasData = useCallback((prefName: string) => {
    const data = prefectureData[prefName];
    return !!(data && data.groupCount > 0);
  }, [prefectureData]);

  const getTooltip = useCallback((prefName: string) => {
    const data = prefectureData[prefName];
    if (!data || data.groupCount === 0) return null;
    return { label: `${data.groupCount}団体` };
  }, [prefectureData]);

  const handleClick = useCallback((prefName: string) => {
    setSelectedPref((prev) => prev === prefName ? null : prefName);
  }, []);

  return (
    <div className="md:grid md:grid-cols-5 md:gap-4 lg:gap-6">
      {/* 左: 地図 */}
      <div className="md:col-span-3">
        <div className="md:sticky md:top-4">
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
      <div className="md:col-span-2 mt-4 md:mt-0" ref={detailRef}>
        {selectedPref && selectedData ? (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-800">{selectedPref}</h3>
                  <div className="text-xs mt-0.5">
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
                {selectedData.groups.map((g) => {
                  const gType = groupTypeLabels[g.groupType];
                  return (
                    <Link
                      key={g.slug}
                      href={`/shogekijo/${g.slug}`}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-orange-50/50 transition-colors"
                    >
                      <FaTheaterMasks className="text-purple-400 text-sm shrink-0" />
                      <span className="text-sm text-gray-800 hover:text-pink-700 transition-colors flex-1">
                        {g.name}
                      </span>
                      {gType && (
                        <span className={`px-1.5 py-0.5 text-[10px] rounded shrink-0 ${gType.color}`}>
                          {gType.label}
                        </span>
                      )}
                    </Link>
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
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors text-left"
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
