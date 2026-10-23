import * as React from "react";
import { useEffect } from "react";
import router from "next/router";
import Link from "next/link";
import OptimizedImage from "./OptimizedImage";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <Link className="flex items-center cursor-pointer" href={"/"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="戯曲図書館" width={123} height={26} className="h-[26px] w-auto" />
      </Link>
      <nav className="space-x-4 hidden md:block font-semibold">
        <Link href="/" className="text-theater-neutral-800 hover:text-theater-neutral-600">
          検索する
        </Link>
        <Link href="/university-theater" className="text-theater-neutral-800 hover:text-theater-neutral-600">
          大学演劇
        </Link>
        <Link href="/shogekijo" className="text-theater-neutral-800 hover:text-theater-neutral-600">
          小劇場
        </Link>
        <Link
          href="/support/about"
          className="text-theater-neutral-800 hover:text-theater-neutral-600"
        >
          概要
        </Link>
        <Link href="/tools" className="text-theater-neutral-800 hover:text-theater-neutral-600">
          ツール
        </Link>
        <Link href="/diary/plot" className="text-theater-neutral-800 hover:text-theater-neutral-600">
          オリジナル作品
        </Link>
        <Link href="/announcements" className="text-theater-neutral-800 hover:text-theater-neutral-600">
          上演告知
        </Link>
        <Link
          href="/support/posting-request"
          className="text-theater-neutral-800 hover:text-theater-neutral-600"
        >
          掲載依頼
        </Link>
        <Link
          href="/support/contact"
          className="text-theater-neutral-800 hover:text-theater-neutral-600"
        >
          お問い合わせ
        </Link>
      </nav>
    </header>
  );
}
