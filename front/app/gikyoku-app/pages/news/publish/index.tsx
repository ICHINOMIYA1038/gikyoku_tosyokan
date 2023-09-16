import ExternalLinkButton from "@/components/ExternalLinkButton";
import NewsLayout from "@/components/NewsLayout";
import Seo from "@/components/seo";
import * as React from "react";
//固定ページのためのレイアウト
const Publish = ({ children }: any) => {
  return (
    <NewsLayout>
      <Seo />
      <div>
        <h2>サイトがリニューアルされました。</h2>
        <h3 className="font-bold text-xl mt-5 mb-2">はじめに</h3>
        <div>
          <p>
            <span className="under-line-blue font-bold">「戯曲図書館」</span>
            は2019年に劇団かたかごがホームページの一部として制作して以来、たくさんの方にご利用していただいておりましたが、劇団の活動休止により一時更新を停止しておりました。
          </p>
          <br />
          <p>
            劇団としての活動は当面考えてはいないものの、サイトのリニューアルを機にこの
            <span className="under-line-blue font-bold">
              「戯曲図書館」 だけを切り離して再び運営を開始していきます。
            </span>
          </p>
          <p>
            運営体制は相変わらず、個人での制作・運営であるため更新頻度はさほど多くないものの、定期的な機能更新と脚本データの追加などをしていきたいと思っております。
          </p>
          <p>
            現在、著作権の再確認をしており、画像・あらすじなどに関しては確認の取れているもののみ掲載されている状況です。そのため、まだまだ掲載されている資料は少ないところではありますが、これから増やしていくつもりですので、どうかよろしくお願いいたします。
          </p>
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

          <br />
          <h3 className="font-bold text-xl mt-3 mb-2">今後のロードマップ</h3>
          <p className="font-bold">直近(1ヶ月以内)で実装予定の機能</p>
          <p>・カテゴリによる絞り込み機能</p>
          <p>・閲覧数による並び替えの機能</p>
          <p className="font-bold">数か月以内で実装予定の機能</p>
          <p>・上演したよ！上演するよ！の掲示板機能</p>
          <p>・お気に入り機能</p>
          <p className="font-bold">それ以降で開発を検討している機能</p>
          <p>ユーザー自身が脚本を投稿し、相互評価しあうSNSサイト(別サイト)</p>
        </div>
      </div>
    </NewsLayout>
  );
};

export default Publish;
