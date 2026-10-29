interface AffiliateDisclosureProps {
  language: 'ja' | 'en';
}

export default function AffiliateDisclosure({ language }: AffiliateDisclosureProps) {
  return (
    <aside
      aria-label={language === 'ja' ? '広告について' : 'Advertising disclosure'}
      className="not-prose mt-5 rounded-md border border-[#D9D5CF] bg-white px-4 py-3 text-sm leading-relaxed text-gray-700"
    >
      <span className="mr-2 inline-flex rounded bg-gray-900 px-2 py-0.5 text-xs font-bold tracking-wide text-white">
        PR
      </span>
      {language === 'ja'
        ? '本記事にはアフィリエイト広告を含みます。掲載内容と評価は、広告の有無にかかわらず編集方針に基づいて作成しています。'
        : 'This article contains affiliate links. Our editorial assessment is made independently of whether a link is monetized.'}
    </aside>
  );
}
