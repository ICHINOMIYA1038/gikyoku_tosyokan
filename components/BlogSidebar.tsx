import React from 'react';
import Link from 'next/link';
import { FaBook, FaGraduationCap, FaTheaterMasks, FaUsers, FaQuestionCircle, FaShieldAlt, FaHandshake, FaAward, FaMapMarkerAlt } from 'react-icons/fa';

interface BlogSidebarProps {
  category?: 'guide' | 'support' | 'news';
  language?: 'ja' | 'en';
  currentPath?: string;
}

export default function BlogSidebar({ category = 'guide', language = 'ja', currentPath }: BlogSidebarProps) {
  if (language === 'en') {
    return <EnglishSidebar currentPath={currentPath} />;
  }
  return <JapaneseSidebar category={category} currentPath={currentPath} />;
}

function JapaneseSidebar({ category, currentPath }: { category?: string; currentPath?: string }) {
  const guideMenuItems = [
    {
      title: '初心者向け',
      icon: <FaGraduationCap />,
      items: [
        { title: '脚本の選び方', href: '/guide/beginner/how-to-choose-script' },
        { title: '脚本の読み方・分析', href: '/guide/beginner/reading-script' },
        { title: '演技の基礎', href: '/guide/beginner/acting-basics' },
      ]
    },
    {
      title: '学校演劇',
      icon: <FaBook />,
      items: [
        { title: '文化祭演劇のコツ', href: '/guide/school/culture-festival' },
        { title: '演劇部運営', href: '/guide/school/drama-club' },
        { title: '新入部員募集', href: '/guide/school/recruitment' },
      ]
    },
    {
      title: '上級者向け',
      icon: <FaTheaterMasks />,
      items: [
        { title: '演出テクニック', href: '/guide/advanced/directing' },
        { title: '舞台美術', href: '/guide/advanced/stage-design' },
        { title: '脚色・翻案', href: '/guide/advanced/adaptation' },
      ]
    },
    {
      title: '作品選び',
      icon: <FaUsers />,
      items: [
        { title: '人数別おすすめ', href: '/guide/cast-size' },
        { title: '上演時間別', href: '/guide/time' },
        { title: '部活運営', href: '/guide/club-management' },
      ]
    },
  ];

  const supportMenuItems = [
    {
      title: 'サービスについて',
      icon: <FaQuestionCircle />,
      items: [
        { title: 'このサイトについて', href: '/support/about' },
        { title: '運営者情報', href: '/support/aboutus' },
        { title: 'お問い合わせ', href: '/support/contact' },
      ]
    },
    {
      title: '規約・ポリシー',
      icon: <FaShieldAlt />,
      items: [
        { title: '利用規約', href: '/support/tos' },
        { title: 'プライバシーポリシー', href: '/support/privacy-policy' },
        { title: '著作権について', href: '/support/copyright' },
      ]
    },
    {
      title: '投稿・協力',
      icon: <FaHandshake />,
      items: [
        { title: '脚本投稿のお願い', href: '/support/posting-request' },
        { title: 'ボランティア募集', href: '/support/voluntary' },
        { title: 'プレスリリース', href: '/support/press-release' },
      ]
    },
  ];

  // 以前は「人気の記事」として作り物の閲覧数を付けていた。実際の人気ではないので、数字を出さずに「おすすめ」とする
  const recommended = [
    { title: '30分で上演できる文化祭向けの脚本', href: '/guide/school/culture-festival' },
    { title: '少人数（2〜3人）で演じられる作品', href: '/guide/cast-size' },
    { title: '初心者でも演じやすいコメディ', href: '/?category=2' },
    { title: '卒業公演に向く作品', href: '/?category=1' },
  ];

  const menuItems = category === 'support' ? supportMenuItems : guideMenuItems;

  return (
    <div className="space-y-8">
      <SidebarSection title={category === 'support' ? 'サポート' : 'ガイド'}>
        {menuItems.map((section) => (
          <div key={section.title} className="mt-3 first:mt-0">
            <p className="text-xs font-bold text-gray-600">{section.title}</p>
            <ul className="mt-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`block py-1.5 text-sm hover:text-theater-primary-700 hover:underline underline-offset-4 ${currentPath === item.href ? 'text-theater-primary-700 font-bold' : 'text-gray-800'}`}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SidebarSection>

      <SidebarSection title="おすすめ">
        <ul>
          {recommended.map((post) => (
            <li key={post.href} className="border-b border-[#D9D5CF] last:border-0">
              <Link href={post.href} className="block py-2.5 text-sm text-gray-800 hover:text-theater-primary-700">{post.title}</Link>
            </li>
          ))}
        </ul>
      </SidebarSection>

      <div className="border border-[#D9D5CF] rounded p-4">
        <p className="text-sm text-gray-800">人数・上演時間・ジャンルで戯曲を探せます。</p>
        <Link href="/" className="mt-3 inline-flex items-center h-10 px-4 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold">
          戯曲を探す
        </Link>
      </div>

      <SidebarSection title="姉妹サイト・アプリ">
        <ul>
          {SISTER_LINKS.map((l) => (
            <li key={l.href} className="border-b border-[#D9D5CF] last:border-0">
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="block py-2.5 hover:bg-[#F4F2EE]">
                <span className="block text-sm font-bold text-gray-900">{l.name}</span>
                <span className="block text-xs text-gray-600">{l.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </SidebarSection>
    </div>
  );
}

const SISTER_LINKS = [
  { name: 'エチュードメーカー', note: '即興のお題をワンタップで（iOS アプリ）', href: 'https://apps.apple.com/us/app/%E3%82%A8%E3%83%81%E3%83%A5%E3%83%BC%E3%83%89%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC/id6794500656' },
  { name: 'TOMOSHIBI小屋', note: 'ブラウザで舞台照明をデザイン', href: 'https://tomoshibi.gikyokutosyokan.com' },
];

// サイドバーの欄。見出しは太い罫線の上に置く
function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="!my-0 !pb-2 !text-sm !font-bold !text-gray-900 border-b-2 border-gray-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function EnglishSidebar({ currentPath }: { currentPath?: string }) {
  const menuItems = [
    {
      title: 'Kishida Prize',
      icon: <FaAward />,
      items: [
        { title: 'What Is the Kishida Prize?', href: '/blog/en/guide-kishida-prize-explained' },
        { title: 'Women Playwrights', href: '/blog/en/kishida-women-playwrights' },
        { title: 'Kishida vs Akutagawa', href: '/blog/en/guide-kishida-vs-akutagawa' },
      ]
    },
    {
      title: 'Theater Guides',
      icon: <FaTheaterMasks />,
      items: [
        { title: 'Beginner\'s Guide', href: '/blog/en/guide-japanese-contemporary-theater' },
        { title: 'Watching as Non-Japanese', href: '/blog/en/guide-watching-japanese-theater' },
        { title: 'Plays in English Translation', href: '/blog/en/guide-japanese-plays-in-english' },
        { title: 'Your First 5 Plays', href: '/blog/en/guide-first-five-japanese-plays' },
      ]
    },
    {
      title: 'Theater History',
      icon: <FaBook />,
      items: [
        { title: 'Angura Movement', href: '/blog/en/guide-angura-underground-theater' },
        { title: 'Modern Theater History', href: '/blog/en/guide-history-modern-japanese-theater' },
        { title: 'Small Theater Movement', href: '/blog/en/guide-small-theater-movement' },
      ]
    },
    {
      title: 'Culture & Places',
      icon: <FaMapMarkerAlt />,
      items: [
        { title: 'Shimokitazawa Guide', href: '/blog/en/guide-shimokitazawa-theater-district' },
        { title: 'Theater Festivals', href: '/blog/en/guide-japanese-theater-festivals' },
        { title: 'Theater Companies', href: '/blog/en/guide-japanese-theater-companies' },
      ]
    },
  ];

  const popularPosts = [
    { title: 'What Is the Kishida Prize?', href: '/blog/en/guide-kishida-prize-explained' },
    { title: 'Beginner\'s Guide to Japanese Theater', href: '/blog/en/guide-japanese-contemporary-theater' },
    { title: '10 Must-Read Japanese Plays in English', href: '/blog/en/guide-japanese-plays-in-english' },
    { title: 'Butoh: Japan\'s Dance of Darkness', href: '/blog/en/guide-butoh-dance-of-darkness' },
  ];

  return (
    <div className="space-y-8">
      <SidebarSection title="Guides">
        {menuItems.map((section) => (
          <div key={section.title} className="mt-3 first:mt-0">
            <p className="text-xs font-bold text-gray-600">{section.title}</p>
            <ul className="mt-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`block py-1.5 text-sm hover:text-theater-primary-700 hover:underline underline-offset-4 ${currentPath === item.href ? 'text-theater-primary-700 font-bold' : 'text-gray-800'}`}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SidebarSection>

      <SidebarSection title="Start here">
        <ul>
          {popularPosts.map((post) => (
            <li key={post.href} className="border-b border-[#D9D5CF] last:border-0">
              <Link href={post.href} className="block py-2.5 text-sm text-gray-800 hover:text-theater-primary-700">{post.title}</Link>
            </li>
          ))}
        </ul>
      </SidebarSection>

      <div className="border border-[#D9D5CF] rounded p-4">
        <p className="text-sm text-gray-800">Search Japanese plays by cast size, running time, and genre.</p>
        <Link href="/" className="mt-3 inline-flex items-center h-10 px-4 rounded bg-theater-primary-600 hover:bg-theater-primary-700 text-white text-sm font-bold">
          Browse plays
        </Link>
      </div>
    </div>
  );
}
