import * as React from "react";
import { useEffect } from "react";
import router from "next/router";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-pink-300">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        <img src="/logo.png" alt="Logo" className="w-12 h-12 mr-4" />
        <span className="text-xl font-bold">戯曲図書館</span>
      </div>
      <nav className="space-x-4 hidden md:block font-semibold">
        <Link href="/" className="text-gray-800 hover:text-gray-600">
          検索する
        </Link>
        <Link
          href="/support/about"
          className="text-gray-800 hover:text-gray-600"
        >
          概要
        </Link>
        <Link
          href="/support/posting-request"
          className="text-gray-800 hover:text-gray-600"
        >
          掲載依頼
        </Link>
        <Link
          href="/support/contact"
          className="text-gray-800 hover:text-gray-600"
        >
          お問い合わせ
        </Link>
      </nav>
    </header>
  );
}
