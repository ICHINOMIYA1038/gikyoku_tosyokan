import React from "react";
import Link from "next/link";

// 書き込みを先頭に置く。リンクの数は以前と同じ（並べ替えと見出しの付け替えのみ）
const footerLinks = [
  {
    title: "書き込む",
    links: [
      { href: "/announcements", label: "上演告知" },
      { href: "/recruit", label: "劇団員募集" },
      { href: "/reports", label: "上演レポート" },
      { href: "/announcements/new", label: "公演を告知する" },
    ],
  },
  {
    title: "戯曲を探す",
    links: [
      { href: "/", label: "戯曲を検索" },
      { href: "/authors", label: "作者一覧" },
      { href: "/categories", label: "カテゴリー一覧" },
      { href: "/blog/ja", label: "ブログ" },
    ],
  },
  {
    title: "データベース",
    links: [
      { href: "/theater-groups", label: "劇団データベース" },
      { href: "/venues", label: "劇場データベース" },
      { href: "/theater-groups?type=university", label: "大学演劇" },
      { href: "/theater-groups", label: "小劇場" },
      { href: "/tools", label: "ツール" },
    ],
  },
  {
    title: "このサイトについて",
    links: [
      { href: "/support/aboutus", label: "運営者概要" },
      { href: "/support/press-release", label: "プレスリリース" },
      { href: "/support/contact", label: "お問い合わせ" },
      { href: "/support/posting-request", label: "掲載リクエスト" },
    ],
  },
  {
    title: "規約",
    links: [
      { href: "/support/tos", label: "利用規約" },
      { href: "/support/privacy-policy", label: "プライバシーポリシー" },
      { href: "/support/copyright", label: "著作権について" },
      { href: "/support/content-removal", label: "権利侵害の申告" },
      { href: "/sitemap.xml", label: "サイトマップ" },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-[#F4F2EE] border-t border-[#D9D5CF] text-gray-800" role="contentinfo" aria-label="サイトフッター">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Link href="/" className="block w-fit" aria-label="戯曲図書館ホームへ">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="戯曲図書館" width={123} height={26} loading="lazy" className="h-[26px] w-auto" />
          </Link>
          <p className="text-sm text-gray-600">戯曲を探して、読んだ感想や上演の記録を書き残せる場所。</p>
        </div>
        <nav className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8" aria-label="フッターナビゲーション">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="!my-0 !pb-0 !text-sm !font-bold !text-gray-900">{section.title}</h2>
              <ul className="mt-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block py-1.5 text-sm text-gray-700 hover:text-theater-primary-700 hover:underline underline-offset-4">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-[#D9D5CF]">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
          <p>© 2026 戯曲図書館</p>
          <p>
            姉妹サイト：
            <a href="https://palette.gikyokutosyokan.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">戯曲パレット</a>
            <span className="mx-2">/</span>
            <a href="https://tomoshibi.gikyokutosyokan.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">TOMOSHIBI小屋</a>
            （舞台照明シミュレーター）
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
