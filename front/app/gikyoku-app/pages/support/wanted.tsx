import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="wanted">
      <div>
        戯曲図書館では運営とあらすじ・感想の執筆のお手伝いをしていただける方を募集しています。
        詳細は応募していただいた際にご説明いたします。
        応募はtwitterのDMにてお待ちしています。
      </div>
    </SupportLayout>
  );
}

export default Home;
