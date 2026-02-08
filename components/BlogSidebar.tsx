import React from 'react';
import Link from 'next/link';
import { FaBook, FaGraduationCap, FaTheaterMasks, FaUsers, FaQuestionCircle, FaEnvelope, FaShieldAlt, FaHandshake, FaChevronRight, FaSearch, FaHotjar, FaGlobeAmericas, FaAward, FaMapMarkerAlt } from 'react-icons/fa';

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

  const popularPosts = [
    { title: '30分で上演できる文化祭向け脚本10選', href: '/guide/school/culture-festival', views: 15234 },
    { title: '少人数(2-3人)で演じられる名作', href: '/guide/cast-size', views: 12893 },
    { title: '初心者でも演じやすいコメディ作品', href: '/?category=2', views: 10567 },
    { title: '感動的な卒業公演向け作品', href: '/?category=1', views: 9234 },
  ];

  const menuItems = category === 'support' ? supportMenuItems : guideMenuItems;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <input type="text" placeholder="記事を検索..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-bold text-lg mb-4">
          {category === 'support' ? 'サポート' : 'ガイド'}カテゴリ
        </h3>
        <nav className="space-y-4">
          {menuItems.map((section, index) => (
            <div key={index}>
              <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                <span className="text-blue-500">{section.icon}</span>
                {section.title}
              </h4>
              <ul className="ml-6 space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link href={item.href} className={`flex items-center gap-2 text-sm py-1 hover:text-blue-600 transition-colors ${currentPath === item.href ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      <FaChevronRight size={10} />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FaHotjar className="text-orange-500" />
          人気の記事
        </h3>
        <ul className="space-y-3">
          {popularPosts.map((post, index) => (
            <li key={index}>
              <Link href={post.href} className="block hover:bg-gray-50 p-2 rounded transition-colors">
                <p className="text-sm font-medium text-gray-700 mb-1 line-clamp-2">{post.title}</p>
                <p className="text-xs text-gray-500">{post.views.toLocaleString()}回閲覧</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-4 text-white">
        <h3 className="font-bold mb-2">脚本をお探しですか？</h3>
        <p className="text-sm mb-3">条件に合った作品を簡単検索</p>
        <Link href="/" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
          作品を探す →
        </Link>
      </div>
    </div>
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <input type="text" placeholder="Search articles..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-bold text-lg mb-4">Categories</h3>
        <nav className="space-y-4">
          {menuItems.map((section, index) => (
            <div key={index}>
              <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                <span className="text-blue-500">{section.icon}</span>
                {section.title}
              </h4>
              <ul className="ml-6 space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link href={item.href} className={`flex items-center gap-2 text-sm py-1 hover:text-blue-600 transition-colors ${currentPath === item.href ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      <FaChevronRight size={10} />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FaHotjar className="text-orange-500" />
          Popular Articles
        </h3>
        <ul className="space-y-3">
          {popularPosts.map((post, index) => (
            <li key={index}>
              <Link href={post.href} className="block hover:bg-gray-50 p-2 rounded transition-colors">
                <p className="text-sm font-medium text-gray-700 line-clamp-2">{post.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-sm p-4 text-white">
        <h3 className="font-bold mb-2">Explore Japanese Scripts</h3>
        <p className="text-sm mb-3">Search our library of theatrical scripts by cast size, duration, and more.</p>
        <Link href="/" className="inline-block bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
          Browse Scripts →
        </Link>
      </div>
    </div>
  );
}
