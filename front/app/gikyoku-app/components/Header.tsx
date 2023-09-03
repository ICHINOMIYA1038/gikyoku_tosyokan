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
      <nav className="space-x-4">
        <Link href="#" className="text-gray-800 hover:text-gray-600">
          Home
        </Link>
        <Link href="#" className="text-gray-800 hover:text-gray-600">
          About
        </Link>
        <Link href="#" className="text-gray-800 hover:text-gray-600">
          Services
        </Link>
        <Link href="#" className="text-gray-800 hover:text-gray-600">
          Contact
        </Link>
      </nav>
    </header>
  );
}
