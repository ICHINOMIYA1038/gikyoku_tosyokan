import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import SupportLayout from "@/components/SupportLayout";
import Link from "next/link";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="aboutus">
      <Seo
        pageTitle="運営者概要"
        pageDescription="戯曲図書館の運営者情報。大学在学時に作成し、個人で運営しています。"
        pagePath="/support/aboutus"
      />
      <div className="support-document">
        <h2>運営者概要</h2>
        <p>運営者:ふみ</p>
        <Link
          className="cursor-pointer text-blue-600"
          href={"https://twitter.com/adafwgwagwagagw"}
        >
          Twitter
        </Link>
        <br />
        メール:gekidankatakago@gmail.com
        <p>大学在学時に戯曲図書館を作成。以降個人で運営をしております。</p>
        <p>現在は演劇活動は休止しており、個人で戯曲の執筆を行っています。</p>
        <p>好きな劇団:NODA・MAP/劇団5454</p>
        <p>好きな劇作家:鈴江俊郎さん/鴻上尚史さん</p>
        <p>連絡はお問い合わせフォームまでよろしくお願いいたします。</p>
        <div className="text-blue-600 my-5">
          <Link href="/support/contact">お問い合わせフォーム</Link>
        </div>

        <h3>外部送信規律への対応</h3>
        <p>
          当サイトは、電気通信事業法第27条の12に定める外部送信規律に対応しています。
          外部送信される情報の詳細は
          <Link href="/support/privacy-policy" className="text-blue-600 hover:underline mx-1">
            プライバシーポリシー
          </Link>
          の「Cookieの利用と外部送信規律」をご確認ください。
        </p>
        <br />
      </div>
    </SupportLayout>
  );
}

export default Home;
