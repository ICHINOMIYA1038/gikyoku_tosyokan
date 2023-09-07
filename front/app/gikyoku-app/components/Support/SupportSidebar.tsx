import Link from "next/link";
import React from "react";
const SupportSidebar = ({ now }: any) => {
  return (
    <div className="mx-auto bg-white">
      <ul className="w-full">
        <li>
          <div className="p-2 mb-2">サポート</div>
        </li>
        <li>
          <Link href="/support/about">
            <div
              className={`p-2 cursor-pointer ${
                now === "about" ? "bg-blue-500 text-white" : "bg-white"
              } hover:bg-blue-500 hover:text-white`}
            >
              サイト概要
            </div>
          </Link>
        </li>
        <li>
          <Link href="/support/aboutus">
            <div
              className={`p-2 cursor-pointer ${
                now === "aboutus" ? "bg-blue-500 text-white" : "bg-white"
              } hover:bg-blue-500 hover:text-white`}
            >
              運営者概要
            </div>
          </Link>
        </li>
        <li>
          <Link href="/support/press-release">
            <div
              className={`p-2 cursor-pointer ${
                now === "press-release" ? "bg-blue-500 text-white" : "bg-white"
              } hover:bg-blue-500 hover:text-white`}
            >
              プレスリリース
            </div>
          </Link>
        </li>
        <li>
          <Link href="/support/contact">
            <div
              className={`p-2 cursor-pointer ${
                now === "contact" ? "bg-blue-500 text-white" : "bg-white"
              } hover:bg-blue-500 hover:text-white`}
            >
              お問い合わせ
            </div>
          </Link>
        </li>
        <li>
          <Link href="/support/privacy-policy">
            <div
              className={`p-2 cursor-pointer ${
                now === "privacy-policy" ? "bg-blue-500 text-white" : "bg-white"
              } hover:bg-blue-500 hover:text-white`}
            >
              プライバシーポリシー
            </div>
          </Link>
        </li>
        <li>
          <Link href="/support/tos">
            <div
              className={`p-2 cursor-pointer ${
                now === "tos" ? "bg-blue-500 text-white" : "bg-white"
              } hover:bg-blue-500 hover:text-white`}
            >
              利用規約
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SupportSidebar;
