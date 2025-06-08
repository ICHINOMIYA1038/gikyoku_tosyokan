import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
import Link from "next/link";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="aboutus">
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
        <br />
      </div>
    </SupportLayout>
  );
}

export default Home;
