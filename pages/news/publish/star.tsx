import NewsLayout from "@/components/NewsLayout";
import Seo from "@/components/seo";
import * as React from "react";
//固定ページのためのレイアウト
const Publish = ({ children }: any) => {
  return (
    <NewsLayout>
      <Seo />
      <div>
        <h2>☆評価の機能がリリースされました！</h2>
        <div>
          <p>
            <span className="under-line-blue font-bold">「戯曲図書館」</span>
            では随時、機能の追加を行っています。
          </p>
          <br />
          <p>
            今回は<span className="under-line-blue font-bold">評価の機能</span>
            を実装いたしました。お気に入りの脚本や上演した脚本にぜひ☆をつけて送信してください。
          </p>
          <p>
            これによって検索したときに、おススメの作品をよりわかりやすくなることを期待できます。
          </p>
          <p>
            もちろん、他人の書いた作品を評価することはおこがましいと感じる事もあるかと思います。(私もそう思います。)
          </p>
          <p>
            ただ、評価はあくまでも好みの平均値だと思っています。人によって好みが違うのは当たり前。ただ、そんないろんな人の好みが集まる平均値を記録することで、劇作家による創作活動に少しでも意味があるのではないかと思っています。
          </p>
        </div>
      </div>
    </NewsLayout>
  );
};

export default Publish;
