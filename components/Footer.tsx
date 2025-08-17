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
    <footer className="bg-theater-primary-300" role="contentinfo" aria-label="サイトフッター">
      <div className="container mx-auto py-8">
        <Link href="/" className="block mb-4" aria-label="戯曲図書館ホームへ">
          <img src="/logo.png" alt="戯曲図書館ロゴ" className="w-16 h-auto" width="64" height="64" />
        </Link>
        <nav className="flex flex-wrap" aria-label="フッターナビゲーション">
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">このサイトについて</h2>
            <ul role="list">
              <li className="mb-2">
                <Link href="/support/aboutus" className="hover:underline">運営者概要</Link>
              </li>
              <li className="mb-2">
                <Link href="/support/press-release" className="hover:underline">プレスリリース</Link>
              </li>
              <li className="mb-2">
                <Link href="/authors" className="hover:underline">作者一覧</Link>
              </li>
              <li className="mb-2">
                <Link href="/categories" className="hover:underline">カテゴリー一覧</Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">ヘルプ</h2>
            <ul role="list">
              <li className="mb-2">
                <Link href="/support/contact" className="hover:underline">お問い合わせ</Link>
              </li>
              <li className="mb-2">
                <Link href="/support/privacy-policy" className="hover:underline">プライバシーポリシー</Link>
              </li>
              <li className="mb-2">
                <Link href="/support/posting-request" className="hover:underline">掲載リクエスト</Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <h2 className="text-lg font-semibold mb-4">利用規約等</h2>
            <ul role="list">
              <li className="mb-2">
                <Link href="/support/tos" className="hover:underline">利用規約</Link>
              </li>
              <li className="mb-2">
                <Link href="/support/copyright" className="hover:underline">著作権について</Link>
              </li>
              <li className="mb-2">
                <Link href="/sitemap.xml" className="hover:underline">サイトマップ</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <p className="text-center py-4">© 2024 戯曲図書館 All Rights Reserved.</p>

      {/* Mobile Footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-theater-primary-300 text-white">
        <nav className="flex justify-around space-x-4">
          <button
            className="hover:bg-theater-primary-400"
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
