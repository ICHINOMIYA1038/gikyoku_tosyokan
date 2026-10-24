import { useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = '/data/japan.topojson';

export const prefectureToRegion: Record<string, string> = {
  '北海道': 'HOKKAIDO',
  '青森県': 'TOHOKU', '岩手県': 'TOHOKU', '宮城県': 'TOHOKU',
  '秋田県': 'TOHOKU', '山形県': 'TOHOKU', '福島県': 'TOHOKU',
  '茨城県': 'KANTO', '栃木県': 'KANTO', '群馬県': 'KANTO',
  '埼玉県': 'KANTO', '千葉県': 'KANTO', '東京都': 'KANTO', '神奈川県': 'KANTO',
  '新潟県': 'CHUBU', '富山県': 'CHUBU', '石川県': 'CHUBU', '福井県': 'CHUBU',
  '山梨県': 'CHUBU', '長野県': 'CHUBU', '岐阜県': 'CHUBU', '静岡県': 'CHUBU', '愛知県': 'CHUBU',
  '三重県': 'KANSAI', '滋賀県': 'KANSAI', '京都府': 'KANSAI',
  '大阪府': 'KANSAI', '兵庫県': 'KANSAI', '奈良県': 'KANSAI', '和歌山県': 'KANSAI',
  '鳥取県': 'CHUGOKU_SHIKOKU', '島根県': 'CHUGOKU_SHIKOKU', '岡山県': 'CHUGOKU_SHIKOKU',
  '広島県': 'CHUGOKU_SHIKOKU', '山口県': 'CHUGOKU_SHIKOKU',
  '徳島県': 'CHUGOKU_SHIKOKU', '香川県': 'CHUGOKU_SHIKOKU', '愛媛県': 'CHUGOKU_SHIKOKU', '高知県': 'CHUGOKU_SHIKOKU',
  '福岡県': 'KYUSHU_OKINAWA', '佐賀県': 'KYUSHU_OKINAWA', '長崎県': 'KYUSHU_OKINAWA',
  '熊本県': 'KYUSHU_OKINAWA', '大分県': 'KYUSHU_OKINAWA', '宮崎県': 'KYUSHU_OKINAWA',
  '鹿児島県': 'KYUSHU_OKINAWA', '沖縄県': 'KYUSHU_OKINAWA',
};

// 地方ごとの色分けはやめ、データのある県は薄い灰、触れた県は薄い紅、選んだ県は紅にする
const FILL = '#DCD6CE';
const FILL_ACTIVE = '#E3B5C0';
const FILL_SELECTED = '#B3123A';

export const regionFillColors: Record<string, string> = {
  HOKKAIDO: FILL, TOHOKU: FILL, KANTO: FILL,
  CHUBU: FILL, KANSAI: FILL, CHUGOKU_SHIKOKU: FILL, KYUSHU_OKINAWA: FILL,
};

export const regionFillActiveColors: Record<string, string> = {
  HOKKAIDO: FILL_ACTIVE, TOHOKU: FILL_ACTIVE, KANTO: FILL_ACTIVE,
  CHUBU: FILL_ACTIVE, KANSAI: FILL_ACTIVE, CHUGOKU_SHIKOKU: FILL_ACTIVE, KYUSHU_OKINAWA: FILL_ACTIVE,
};

type TooltipData = {
  label: string;
  subLabel?: string;
};

type JapanMapProps = {
  hasData: (prefName: string) => boolean;
  getTooltip: (prefName: string) => TooltipData | null;
  selectedPref: string | null;
  hoveredPref: string | null;
  onHover: (prefName: string | null) => void;
  onClick: (prefName: string) => void;
};

export default function JapanMap({
  hasData, getTooltip, selectedPref, hoveredPref, onHover, onClick,
}: JapanMapProps) {
  const [tappedPref, setTappedPref] = useState<string | null>(null);

  const getFillColor = (prefName: string) => {
    const region = prefectureToRegion[prefName];
    if (!region) return '#e5e7eb';
    const hasPrefData = hasData(prefName);
    if (selectedPref === prefName) return FILL_SELECTED;
    if ((hoveredPref === prefName || tappedPref === prefName) && hasPrefData) return regionFillActiveColors[region] || '#e5e7eb';
    if (hasPrefData) return regionFillColors[region] || '#e5e7eb';
    return '#F4F2EE';
  };

  const tooltip = (hoveredPref || tappedPref) ? getTooltip(hoveredPref || tappedPref!) : null;
  const displayPref = hoveredPref || tappedPref;

  // タッチデバイス対応: タップで都道府県を選択
  const handleTouchEnd = useCallback((prefName: string) => {
    const hasPrefData = hasData(prefName);
    if (!hasPrefData) return;

    if (tappedPref === prefName) {
      // 2回目のタップで選択
      onClick(prefName);
      setTappedPref(null);
    } else {
      // 1回目のタップでハイライト
      setTappedPref(prefName);
    }
  }, [tappedPref, hasData, onClick]);

  return (
    <div>
      {/* 凡例 */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 justify-center text-xs text-gray-600">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: FILL }} />掲載あり</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block border border-[#D9D5CF]" style={{ backgroundColor: '#F4F2EE' }} />掲載なし</span>
      </div>

      {/* 地図本体 */}
      <div
        className="relative bg-white border border-[#D9D5CF] p-2 touch-manipulation"
        role="img"
        aria-label="日本地図。都道府県をクリックまたはタップして劇団情報を表示できます。"
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [137, 38], scale: 1400 }}
          width={600}
          height={500}
          className="w-full h-auto"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const prefName = geo.properties.nam_ja as string;
                const hasPrefData = hasData(prefName);
                return (
                  <g
                    key={geo.rsmKey}
                    tabIndex={hasPrefData ? 0 : -1}
                    aria-label={hasPrefData ? `${prefName}の劇団情報を表示` : prefName}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleTouchEnd(prefName);
                    }}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && hasPrefData) {
                        e.preventDefault();
                        onClick(prefName);
                      }
                    }}
                    style={{ outline: 'none' }}
                  >
                    <Geography
                      geography={geo}
                      fill={getFillColor(prefName)}
                      stroke="#fff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none', cursor: hasPrefData ? 'pointer' : 'default', transition: 'fill 0.15s ease' },
                        hover: { outline: 'none', cursor: hasPrefData ? 'pointer' : 'default' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => onHover(prefName)}
                      onMouseLeave={() => onHover(null)}
                      onClick={() => {
                        if (hasPrefData) onClick(prefName);
                      }}
                    />
                  </g>
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* ツールチップ */}
        {displayPref && tooltip && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-100 px-3 py-2 pointer-events-none z-10">
            <div className="font-medium text-sm text-gray-800">{displayPref}</div>
            <div className="text-xs mt-0.5">{tooltip.label}</div>
            {tooltip.subLabel && (
              <div className="text-xs mt-0.5">{tooltip.subLabel}</div>
            )}
          </div>
        )}

        {/* データなしツールチップ */}
        {displayPref && !tooltip && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-100 px-3 py-2 pointer-events-none z-10">
            <div className="font-medium text-sm text-gray-800">{displayPref}</div>
            <div className="text-xs text-gray-400 mt-0.5">データなし</div>
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-2 hidden lg:block">都道府県をクリックして詳細を表示</p>
      <p className="text-[10px] text-gray-400 text-center mt-2 lg:hidden">都道府県をタップして詳細を表示</p>
    </div>
  );
}
