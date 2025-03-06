import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
import Link from "next/link";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="voluntary">
      <div className="support-document">
        <h2>ボランティア募集</h2>
        <p>
          {" "}
          戯曲図書館では運営とあらすじ・感想の執筆のお手伝いをしていただける方を募集しています。
        </p>
        <p> 詳細は応募していただいた際にご説明いたします。</p>
        <p>応募はtwitterのDMにてお待ちしています。</p>
        <div className="text-blue-600 my-5">
          <Link href="https://twitter.com/adafwgwagwagagw">twitter</Link>
        </div>
      </div>
    </SupportLayout>
  );
}

export default Home;
