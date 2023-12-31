import * as React from "react";
import { useEffect } from "react";
import router from "next/router";
import Link from "next/link";

export default function ImportantMessage() {
  return (
    <div className="bg-white p-3 max-w-3xl mt-10 mx-auto shadow-lg rounded-lg ">
      現在サイトをリニューアル中です。<br></br>
      <p>まだまだ作成中ですので、ご不便おかけいたします。</p>
      一部のサイトはリダイレクトされるように設定しています。
      元のサイトに戻る場合は
      <a className="font-bold" href="https://gekidankatakago.com">
        こちら
      </a>
    </div>
  );
}
