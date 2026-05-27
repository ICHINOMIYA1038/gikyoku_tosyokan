import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import OptimizedImage from "./OptimizedImage";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import AuthMenu from "@/components/AuthMenu";
import { FEATURES } from "@/lib/feature-flags";

type MenuItem = {
  href?: string;
  label: string;
  isExternal?: boolean;
  children?: { href: string; label: string; isExternal?: boolean }[];
};

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenMobileSection(null);
  };

  const boardChildren = [
    { href: "/announcements", label: "上演告知" },
    ...(FEATURES.recruit ? [{ href: "/recruit", label: "劇団員募集" }] : []),
  ];

  const menuItems: MenuItem[] = [
    { href: "/", label: "検索する" },
    {
      label: "データベース",
      children: [
        { href: "/theater-groups", label: "劇団" },
        { href: "/venues", label: "劇場" },
      ],
    },
    {
      label: "掲示板",
      children: boardChildren,
    },
    { href: "/tools", label: "ツール" },
    { href: "/blog/ja", label: "ブログ" },
    { href: "/support/about", label: "概要" },
  ];

  // 外クリックでデスクトップドロップダウンを閉じる
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between p-3 bg-theater-primary-300">
        <Link className="flex items-center cursor-pointer min-w-0" href={"/"} onClick={closeMenu}>
          <OptimizedImage src="https://gikyokutosyokan-public.s3.ap-northeast-1.amazonaws.com/assets/logo-tosyokan.png" alt="戯曲図書館" width={280} height={40} className="h-12 w-auto" priority />
        </Link>

        {/* デスクトップメニュー（lg以上で表示） */}
        <nav ref={dropdownRef} className="space-x-4 hidden lg:flex font-semibold items-center">
          {menuItems.map((item) => {
            if (item.children) {
              const isOpen = openDropdown === item.label;
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    className="flex items-center gap-1 text-theater-neutral-800 hover:text-theater-neutral-600"
                  >
                    {item.label}
                    <FaChevronDown size={10} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white shadow-lg rounded-md border border-theater-neutral-200 py-2 z-50">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-2 text-theater-neutral-800 hover:bg-theater-primary-50"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href!}
                className="text-theater-neutral-800 hover:text-theater-neutral-600"
                {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
              </Link>
            );
          })}
          <AuthMenu variant="desktop" />
        </nav>

        {/* モバイルメニューボタン */}
        <button
          onClick={toggleMenu}
          className="flex lg:hidden items-center justify-center flex-shrink-0 w-11 h-11 rounded-md bg-white/30 text-theater-neutral-800 hover:bg-white/50 active:bg-white/60 focus:outline-none relative z-10"
          aria-label="メニューを開く"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* モバイルメニュー（スライドイン） */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMenu}
        />

        <div className="absolute right-0 top-0 h-full w-80 max-w-[80%] bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 bg-theater-primary-300 border-b">
            <span className="text-xl font-bold">メニュー</span>
            <button
              onClick={closeMenu}
              className="flex items-center justify-center w-11 h-11 -mr-2 text-theater-neutral-800 hover:text-theater-neutral-600 focus:outline-none"
              aria-label="メニューを閉じる"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <nav className="flex flex-col p-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {menuItems.map((item) => {
              if (item.children) {
                const isOpen = openMobileSection === item.label;
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setOpenMobileSection(isOpen ? null : item.label)}
                      className="w-full flex items-center justify-between py-3 px-4 text-lg text-theater-neutral-800 hover:bg-theater-primary-50 rounded-lg"
                    >
                      <span>{item.label}</span>
                      <FaChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="ml-4 border-l border-theater-neutral-200">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={closeMenu}
                            className="block py-2.5 px-4 text-theater-neutral-700 hover:bg-theater-primary-50 hover:text-theater-primary-600 rounded-lg"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="py-3 px-4 text-lg text-theater-neutral-800 hover:bg-theater-primary-50 hover:text-theater-primary-600 rounded-lg transition-colors"
                  onClick={closeMenu}
                  {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </Link>
              );
            })}
            <AuthMenu variant="mobile" />
          </nav>

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
