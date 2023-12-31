import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaSearch, FaPhone, FaArrowUp, FaEnvelope } from "react-icons/fa";

const Footer: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-pink-300">
      <div className="container mx-auto py-8">
        <Link href="/" className="block mb-4">
          <img src="/logo.png" alt="Logo" className="w-16 h-auto" />
        </Link>
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">このサイトについて</h2>
            <ul>
              <li className="mb-2">
                <Link href="/support/aboutus">運営者概要</Link>
              </li>
              <li className="mb-2">
                <Link href="/support/press-release">プレスリリース</Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">ヘルプ</h2>
            <ul>
              <li className="mb-2">
                <Link href="/support/contact">お問い合わせ</Link>
              </li>
              <li className="mb-2">
                <Link href="/support/privacy-policy">プライバシーポリシー</Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <h2 className="text-lg font-semibold mb-4">利用規約等</h2>
            <ul>
              <li className="mb-2">
                <Link href="/support/tos">利用規約</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="text-center py-4">© 2023 戯曲図書館 All Rights Reserved.</p>

      {/* Mobile Footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-pink-300 text-white">
        <nav className="flex justify-around space-x-4">
          <button
            className="hover:bg-pink-400"
            onClick={() => handleNavigate("/")}
          >
            <FaSearch className="inline-block mr-2" /> FIND
          </button>
          <button
            className="hover:bg-pink-400"
            onClick={() => handleNavigate("/support/contact")}
          >
            <FaEnvelope className="inline-block mr-2" /> CONTACT
          </button>
          <button
            className="hover:bg-pink-400"
            onClick={() => handleScrollToTop()}
          >
            <FaArrowUp className="inline-block mr-2" />
            Top
          </button>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
