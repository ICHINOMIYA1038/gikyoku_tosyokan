import React from "react";
import Link from "next/link";

const footerLinks = [
  {
    title: "このサイトについて",
    links: [
      { href: "/support/aboutus", label: "運営者概要" },
      { href: "/support/press-release", label: "プレスリリース" },
      { href: "/authors", label: "作者一覧" },
      { href: "/categories", label: "カテゴリー一覧" },
      { href: "/announcements", label: "上演告知" },
    ],
  },
  {
    title: "ヘルプ",
    links: [
      { href: "/support/contact", label: "お問い合わせ" },
      { href: "/support/privacy-policy", label: "プライバシーポリシー" },
      { href: "/support/posting-request", label: "掲載リクエスト" },
    ],
  },
  {
    title: "利用規約等",
    links: [
      { href: "/support/tos", label: "利用規約" },
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
          <img src="/logo.png" alt="戯曲図書館ロゴ" className="w-14 h-auto opacity-80" width="56" height="56" />
        </Link>
        <nav className="grid grid-cols-1 md:grid-cols-3 gap-8" aria-label="フッターナビゲーション">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
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
        <p className="text-center py-4 text-xs text-gray-500">
          © 2026 戯曲図書館 All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
