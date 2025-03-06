import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
import Link from "next/link";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="copyright">
      <div className="support-document">
        <h2>著作権に関して</h2>
        <p className="font-bold">
          掲載されている戯曲の著作権は各戯曲の作者ないし、出版社、劇団等に所属します。
        </p>
        <p className="font-bold">
          上演を希望される場合には権利者に許可をとってから上演をするようにお願いいたします。
        </p>
        <p>
          当サイトでは、事前に著作権の確認がとれている画像と文章のみ掲載しております。
        </p>

        <p>
          書影に関しては版元ドットコム様において利用可能となっているものを仕様しております。
        </p>
        <p>
          それ以外のあらすじ、感想に関しては戯曲図書館側で制作したものになります。
        </p>
        <p>
          掲載に当たって著作権に関して慎重に精査しておりますが、掲載されている情報で著作権を侵害しているものがあればお問い合わせフォームにてお知らせいただけますと幸いです。
        </p>
        <div className="text-blue-600">
          <Link href="/support/contact">お問い合わせフォーム</Link>
        </div>
      </div>
    </SupportLayout>
  );
}

export default Home;
