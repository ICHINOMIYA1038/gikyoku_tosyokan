import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="aboutus">
      <div className="support-document">
        <h2>運営者概要</h2>
        <p>運営者:いちのみや</p>
        <br />
        <p>大学在学時に戯曲図書館を作成。以後個人で運営をしております。</p>
        <p>現在は演劇活動は休止しており、個人で戯曲の執筆を行っています。</p>
        <br />
        <p>このサイトは個人が非営利目的で制作したサイトです。</p>
        <p>
          広告等で得られた収入はサーバー運営費ならびにコンテンツの拡充に当てております。
        </p>
      </div>
    </SupportLayout>
  );
}

export default Home;
