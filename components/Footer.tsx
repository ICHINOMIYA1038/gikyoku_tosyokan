import React from "react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "コンテンツ",
    links: [
      { href: "/", label: "戯曲を検索" },
      { href: "/authors", label: "作者一覧" },
      { href: "/categories", label: "カテゴリー一覧" },
      { href: "/blog/ja", label: "ブログ" },
      { href: "/announcements", label: "上演告知" },
    ],
  },
  {
    title: "データベース",
    links: [
      { href: "/theater-groups", label: "劇団データベース" },
      { href: "/venues", label: "劇場データベース" },
      { href: "/university-theater", label: "大学演劇" },
      { href: "/shogekijo", label: "小劇場" },
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
    title: "規約・サイトマップ",
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
    <footer className="bg-theater-neutral-900 text-gray-300" role="contentinfo" aria-label="サイトフッター">
      <div className="container mx-auto px-4 py-10">
        <Link href="/" className="block mb-6" aria-label="戯曲図書館ホームへ">
          <Image src="/logo-white.png" alt="戯曲図書館" width={140} height={40} loading="lazy" className="h-10 w-auto opacity-90" />
        </Link>
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" aria-label="フッターナビゲーション">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © 2026 戯曲図書館 All Rights Reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>姉妹サイト:</span>
              <a
                href="https://palette.gikyokutosyokan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                戯曲パレット
              </a>
              <span className="text-gray-600">（共通アカウントで利用可能）</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
