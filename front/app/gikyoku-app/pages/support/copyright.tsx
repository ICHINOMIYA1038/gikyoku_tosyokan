import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
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
      </div>
    </SupportLayout>
  );
}

export default Home;
