// 大学演劇関連の共通定数

// 地域名マッピング
export const regionLabels: Record<string, string> = {
  HOKKAIDO: '北海道',
  TOHOKU: '東北',
  KANTO: '関東',
  CHUBU: '中部',
  KANSAI: '関西',
  CHUGOKU_SHIKOKU: '中国・四国',
  KYUSHU_OKINAWA: '九州・沖縄',
};

// 北→南の表示順
export const regionOrder = [
  'HOKKAIDO',
  'TOHOKU',
  'KANTO',
  'CHUBU',
  'KANSAI',
  'CHUGOKU_SHIKOKU',
  'KYUSHU_OKINAWA',
] as const;

// 地域→都道府県リスト（全47都道府県）
export const regionPrefectures: Record<string, string[]> = {
  HOKKAIDO: ['北海道'],
  TOHOKU: ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
  KANTO: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
  CHUBU: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'],
  KANSAI: ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
  CHUGOKU_SHIKOKU: ['鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県'],
  KYUSHU_OKINAWA: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
};

// 大学種別ラベル＋カラー
export const universityTypeLabels: Record<string, { label: string; color: string; border: string }> = {
  NATIONAL: { label: '国立', color: 'bg-blue-100 text-blue-800', border: 'border-blue-400' },
  PUBLIC: { label: '公立', color: 'bg-green-100 text-green-800', border: 'border-green-400' },
  PRIVATE: { label: '私立', color: 'bg-orange-100 text-orange-800', border: 'border-orange-400' },
};

// 劇団タイプラベル＋カラー
export const groupTypeLabels: Record<string, { label: string; color: string; border: string }> = {
  STUDENT: { label: '学生劇団', color: 'bg-blue-100 text-blue-800', border: 'border-blue-400' },
  INTERCOLLEGE: { label: 'インカレ', color: 'bg-purple-100 text-purple-800', border: 'border-purple-400' },
  ACADEMIC: { label: '大学学科', color: 'bg-green-100 text-green-800', border: 'border-green-400' },
  AMATEUR: { label: '社会人', color: 'bg-orange-100 text-orange-800', border: 'border-orange-400' },
  PROFESSIONAL: { label: 'プロ', color: 'bg-red-100 text-red-800', border: 'border-red-400' },
  YOUTH: { label: 'ユース', color: 'bg-teal-100 text-teal-800', border: 'border-teal-400' },
};

// 地域ごとのカラーテーマ
export const regionColors: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  HOKKAIDO: { bg: 'bg-sky-50', text: 'text-sky-800', accent: 'bg-sky-500', border: 'border-sky-200' },
  TOHOKU: { bg: 'bg-indigo-50', text: 'text-indigo-800', accent: 'bg-indigo-500', border: 'border-indigo-200' },
  KANTO: { bg: 'bg-rose-50', text: 'text-rose-800', accent: 'bg-rose-500', border: 'border-rose-200' },
  CHUBU: { bg: 'bg-emerald-50', text: 'text-emerald-800', accent: 'bg-emerald-500', border: 'border-emerald-200' },
  KANSAI: { bg: 'bg-amber-50', text: 'text-amber-800', accent: 'bg-amber-500', border: 'border-amber-200' },
  CHUGOKU_SHIKOKU: { bg: 'bg-teal-50', text: 'text-teal-800', accent: 'bg-teal-500', border: 'border-teal-200' },
  KYUSHU_OKINAWA: { bg: 'bg-orange-50', text: 'text-orange-800', accent: 'bg-orange-500', border: 'border-orange-200' },
};
