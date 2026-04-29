import * as React from "react";
import { useEffect } from "react";
import router from "next/router";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-theater-primary-300">
      <Link className="flex items-center cursor-pointer" href={"/"}>
        <Image src="/logo.png" alt="戯曲図書館" width={180} height={36} className="h-9 w-auto" priority />
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
        <Link href="/diary/plot" className="text-theater-neutral-800 hover:text-theater-neutral-600">
          オリジナル作品
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
