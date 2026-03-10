import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems: { href: string; label: string; isExternal?: boolean }[] = [
    { href: "/", label: "検索する" },
    { href: "/university-theater", label: "大学演劇" },
    { href: "/shogekijo", label: "小劇場" },
    { href: "/announcements", label: "上演告知" },
    { href: "/support/about", label: "概要" },
    { href: "/diary/plot", label: "オリジナル作品" },
    { href: "/support/posting-request", label: "掲載依頼" },
    { href: "/support/contact", label: "お問い合わせ" },
  ];

  return (
    <>
      <header className="flex items-center justify-between p-3 bg-theater-primary-300">
        <Link className="flex items-center cursor-pointer min-w-0" href={"/"} onClick={closeMenu}>
          <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-4 flex-shrink-0" />
          <span className="text-xl font-bold truncate">戯曲図書館</span>
        </Link>
        
        {/* デスクトップメニュー */}
        <nav className="space-x-4 hidden md:flex font-semibold">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-theater-neutral-800 hover:text-theater-neutral-600"
              {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* モバイルメニューボタン */}
        <button
          onClick={toggleMenu}
          className="flex md:hidden items-center justify-center flex-shrink-0 w-10 h-10 rounded-md bg-white/30 text-theater-neutral-800 hover:bg-white/50 active:bg-white/60 focus:outline-none relative z-10"
          aria-label="メニューを開く"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* モバイルメニュー（スライドイン） */}
      <div
        className={`md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* オーバーレイ */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMenu}
        />

        {/* メニューパネル */}
        <div className="absolute right-0 top-0 h-full w-80 max-w-[80%] bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 bg-theater-primary-300 border-b">
            <span className="text-xl font-bold">メニュー</span>
            <button
              onClick={closeMenu}
              className="p-2 text-theater-neutral-800 hover:text-theater-neutral-600 focus:outline-none"
              aria-label="メニューを閉じる"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <nav className="flex flex-col p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 px-4 text-lg text-theater-neutral-800 hover:bg-theater-primary-50 hover:text-theater-primary-600 rounded-lg transition-colors"
                onClick={closeMenu}
                {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
                {item.isExternal && (
                  <span className="text-sm ml-2 text-theater-neutral-500">↗</span>
                )}
              </Link>
            ))}
          </nav>

          {/* フッター情報 */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-theater-neutral-50">
            <p className="text-sm text-theater-neutral-600 text-center">
              © 2024 戯曲図書館
            </p>
          </div>
        </div>
      </div>
    </>
  );
}