import ExternalLinkButton from "@/components/ExternalLinkButton";
import Layout from "@/components/Layout";
import SupportLayout from "@/components/SupportLayout";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="about">
      <div className="support-document">
        <h2>概要</h2>
        <p>
          <span className="font-bold">
            戯曲図書館は戯曲を検索するためのサービスです。
          </span>
        </p>
        <p>上演するにあたって人数、上演時間などから検索することができます。</p>
        <p>著作権の観点から、戯曲の内容自体は公開しておりません。</p>
        <p>
          また、掲載されている戯曲は戯曲の作者や出版社等に所属しております。
        </p>
        <p>そのため、上演をご希望の際には、戯曲の著作者にご連絡ください。</p>

        <h3 className="font-bold text-xl mt-5 mb-2">このサイトの目的</h3>
        <p>
          しばらく更新を停止している間に、劇作家協会から戯曲デジタルアーカイブというサイトが公開されました。
        </p>
        <ExternalLinkButton
          title="戯曲デジタルアーカイブ"
          url="https://playtextdigitalarchive.com/drama/list/dramaRa"
        />
        <p>
          <span className="font-bold">
            このサイトは戯曲を無料で読むことができ、さらには上演許可の仲介までしてくれるとても優れたサイトです。
          </span>
        </p>
        <p>
          このサイトがあるなら、戯曲図書館も更新は不要と思ったりもしました。
        </p>
        <p>
          それでも意義を考えてみると私は
          <span className="font-bold">
            「戯曲が無料で読めること自体には部分的には反対なのです。」
          </span>
        </p>
        <p>部分的にはというのは、作者の利益のことです。</p>
        <p>
          一つの戯曲を制作するのに、劇作家は
          <span className="under-line-blue font-bold">多大な経験と時間</span>
          を要します。
        </p>
        <p>でも、その割に得られる利益はごくわずかです。</p>
        <p>
          そのわずかな利益を作者に還元できるように、戯曲を一つの文学として書店などで購入し読んで欲しいと私は思います。
        </p>
        <p>
          私たちの戯曲図書館では作品の内容自体は公開できません。(図書館という名には反しているかもしれませんが...)
        </p>
        <p>
          しかし、なるべく多くの情報を集め多くの
          <span className="font-bold  under-line-blue">
            「この本読んでみたい！」
          </span>
          を作る場所にできればなと思っています。
        </p>
        <p>
          ぜひ、面白いと思った作品は購入しそしてできればその作者が書いた脚本で行われている
          <span className="font-bold  under-line-blue">
            劇場に足を運んでみてはどうでしょうか？
          </span>
        </p>
      </div>
    </SupportLayout>
  );
}

export default Home;
