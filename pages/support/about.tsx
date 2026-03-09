import LinkCard from "@/components/LinkCard";
import SupportLayout from "@/components/SupportLayout";
import StructuredData from "@/components/StructuredData";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <SupportLayout now="about">
      <StructuredData
        type="FAQPage"
        faqItems={[
          {
            question: '戯曲図書館とは？',
            answer: '戯曲図書館は、演劇・舞台の脚本を検索し、レビューや上演報告を共有できるサービスです。上演時間や人数から脚本を探せるほか、実際に上演した方の感想が次に演じる人の参考になります。',
          },
          {
            question: '脚本は読めますか？',
            answer: '著作権の観点から、戯曲の内容自体は公開しておりません。作品の情報や入手方法を掲載しています。面白いと思った作品はぜひ購入してお読みください。',
          },
          {
            question: '上演するにはどうすればいいですか？',
            answer: '掲載されている戯曲は作者や出版社に著作権があります。上演をご希望の際には、各作品ページに記載の著作者にご連絡ください。',
          },
          {
            question: 'コメントや上演報告は誰でも投稿できますか？',
            answer: 'はい、ユーザー登録不要でどなたでも投稿できます。感想・上演報告・レビュー・質問の4種類から選んでコメントできます。',
          },
        ]}
      />
      <div className="support-document">
        <h2>戯曲図書館とは</h2>
        <p>
          <span className="font-bold">
            戯曲図書館は、戯曲を「探す・知る・語る」ためのサービスです。
          </span>
        </p>
        <p>上演時間、人数、ジャンルなどから脚本を検索できます。</p>
        <p>さらに、実際に上演した方の感想やレビューを共有し、次に演じる人の参考になる場所を目指しています。</p>

        <h3 className="font-bold text-xl mt-8 mb-3">3つの使い方</h3>

        <div className="space-y-4 mb-8">
          <div className="bg-pink-50 border border-pink-100 rounded-lg p-4">
            <p className="font-bold text-pink-700 mb-1">🔍 探す</p>
            <p>上演時間・人数・ジャンルから、あなたの劇団にぴったりの脚本を検索。文化祭、学園祭、部活動の作品選びに。</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="font-bold text-blue-700 mb-1">📖 知る</p>
            <p>あらすじ、上演時間、キャスト構成などの詳細情報に加え、他の人のレビューや評価を参考にできます。</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="font-bold text-green-700 mb-1">💬 語る</p>
            <p>上演した感想、レビュー、質問を投稿して、演劇に関わる人同士で情報を共有。あなたの経験が誰かの次の舞台につながります。</p>
          </div>
        </div>

        <h3 className="font-bold text-xl mt-8 mb-3">脚本の本文について</h3>
        <p>著作権の観点から、戯曲の内容自体は公開しておりません。</p>
        <p>掲載されている戯曲は作者や出版社等に著作権があります。上演をご希望の際には、各作品ページに記載の著作者にご連絡ください。</p>

        <h3 className="font-bold text-xl mt-8 mb-3">このサイトの想い</h3>
        <p>
          一つの戯曲を制作するのに、劇作家は
          <span className="under-line-blue font-bold">多大な経験と時間</span>
          を要します。でも、その割に得られる利益はごくわずかです。
        </p>
        <p>
          そのわずかな利益を作者に還元できるように、戯曲を一つの文学として書店などで購入し読んで欲しいと思っています。
        </p>
        <p>
          戯曲図書館では作品の内容自体は公開できません。しかし、なるべく多くの情報を集め、多くの
          <span className="font-bold under-line-blue">
            「この本読んでみたい！」
          </span>
          を作る場所にできればと思っています。
        </p>
        <p>
          そして、上演した方の声が集まることで、まだ見ぬ名作との出会いが生まれる。そんな
          <span className="font-bold under-line-blue">
            演劇を愛する人たちの交差点
          </span>
          になれたら嬉しいです。
        </p>
        <p>
          面白いと思った作品はぜひ購入し、そしてできればその作者が書いた脚本で行われている劇場に足を運んでみてください。
        </p>

        <h3 className="font-bold text-xl mt-8 mb-3">関連サイト</h3>
        <p>劇作家協会による戯曲デジタルアーカイブでは、戯曲を無料で読むことができ、上演許可の仲介もしてくれます。</p>
        <LinkCard href="https://playtextdigitalarchive.com/drama/list/dramaRa" />
      </div>
    </SupportLayout>
  );
}

export default Home;
