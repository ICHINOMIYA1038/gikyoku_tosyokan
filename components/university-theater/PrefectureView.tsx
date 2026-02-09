import { useState } from 'react';
import { regionOrder, regionLabels, regionPrefectures, regionColors } from '@/lib/university-theater-constants';
import PrefectureCell from './PrefectureCell';
import PrefectureDetail from './PrefectureDetail';

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

type PrefectureViewProps = {
  prefectureData: Record<string, PrefectureStats>;
};

export default function PrefectureView({ prefectureData }: PrefectureViewProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);

  const handleClick = (pref: string) => {
    setSelectedPrefecture(selectedPrefecture === pref ? null : pref);
  };

  return (
    <div className="space-y-6">
      {regionOrder.map((regionKey) => {
        const prefs = regionPrefectures[regionKey];
        const colors = regionColors[regionKey];
        const label = regionLabels[regionKey];

        return (
          <div key={regionKey}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-1 h-5 rounded-full ${colors.accent}`} />
              <h3 className={`font-serif font-bold text-sm ${colors.text}`}>{label}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {prefs.map((pref) => {
                const data = prefectureData[pref] || { universityCount: 0, groupCount: 0, universities: [] };
                return (
                  <PrefectureCell
                    key={pref}
                    name={pref}
                    universityCount={data.universityCount}
                    groupCount={data.groupCount}
                    isSelected={selectedPrefecture === pref}
                    onClick={() => handleClick(pref)}
                  />
                );
              })}
            </div>

            {selectedPrefecture && prefs.includes(selectedPrefecture) && prefectureData[selectedPrefecture] && (
              <div className="mt-3">
                <PrefectureDetail
                  prefecture={selectedPrefecture}
                  universities={prefectureData[selectedPrefecture].universities}
                  onClose={() => setSelectedPrefecture(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
