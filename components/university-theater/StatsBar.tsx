import { FaUniversity, FaTheaterMasks, FaMapMarkerAlt } from 'react-icons/fa';

type StatsBarProps = {
  universityCount: number;
  groupCount: number;
  prefectureCount: number;
};

export default function StatsBar({ universityCount, groupCount, prefectureCount }: StatsBarProps) {
  const stats = [
    { icon: FaUniversity, label: '大学', value: universityCount, unit: '校', color: 'text-blue-500' },
    { icon: FaTheaterMasks, label: '劇団', value: groupCount, unit: '団体', color: 'text-purple-500' },
    { icon: FaMapMarkerAlt, label: '都道府県', value: prefectureCount, unit: '', color: 'text-pink-500' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <s.icon className={`mx-auto text-lg md:text-xl ${s.color} mb-1`} />
          <div className="text-xl md:text-3xl font-bold text-gray-800">{s.value}<span className="text-sm md:text-base font-normal text-gray-500 ml-0.5">{s.unit}</span></div>
          <div className="text-[10px] md:text-xs text-gray-500">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
