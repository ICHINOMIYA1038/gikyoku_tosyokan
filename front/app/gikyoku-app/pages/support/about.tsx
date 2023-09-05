import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="about">
      <div className="support-document">
        <h2>概要</h2>
        <p>戯曲図書館は戯曲を検索するためのサービスです。</p>
        <p>上演するにあたって人数、上演時間などから検索することができます。</p>
        <p>著作権の観点から、戯曲の内容自体は公開しておりません。</p>
        <p>また、掲載されている戯曲は戯曲の作者や出版社等に所属しております。</p>
        <p>そのため、上演をご希望の際には、戯曲の著作者にご連絡ください。</p>
      </div>
    </SupportLayout>
  );
}

export default Home;
