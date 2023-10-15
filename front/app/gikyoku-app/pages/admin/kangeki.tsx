// pages/index.js
import { useState } from "react";

export default function Home() {
  const [inputValues, setInputValues] = useState<any>({
    group: "",
    title: "",
    author: "",
    synopsis: "",
    point1: "",
    point2: "",
    point3: "",
    eval1: "",
    eval2: "",
    eval3: "",
    eval4: "",
    eval5: "",
    eval6: "",
    point1detail: "",
    point2detail: "",
    point3detail: "",
    impressions: "",
  });

  const sampleString = `『「観劇三昧」でおすすめの動画がわからない』という人向けに動画紹介をしています。

  今回は観劇三昧で配信されている無料動画「{{title}}」の紹介をします。
  
  もしもまだ、観劇三昧の登録をしていない方は登録することをおすすめします！==============================================
  もっともっといろんな劇団を知りたいあなたに
  全国640劇団以上配信中
  <a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+64C3M" rel="nofollow">オンライン観劇サービス【観劇三昧】</a>
  330作品以上無料！月額950円（税別）で全作品観放題！
  ==============================================
  <h2 class="mb-2"> 観劇三昧で『{{group}}』の{{title}}を観る</h2>
  <span class="ep-label bgc-DPblue brc-white ftc-white es-radius es-RpaddingSS es-LpaddingSS">無料</span>
  
  <a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5TNE+34L2+BWGDT&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F510" rel="nofollow"> <img src="https://imgs.kan-geki.com/production/streaming/work/thumbnail/000510_00000000000000.jpg" alt="" border="0" /></a> <img src="https://www17.a8.net/0.gif?a8mat=3B9F8F+DQ5TNE+34L2+BWGDT" alt="" width="1" height="1" border="0" />
  
  &nbsp;
  
  =================================
  
  <a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F510" rel="nofollow">→ 観劇三昧で{{group}}{{title}}を観る</a> <img src="https://www11.a8.net/0.gif?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2" alt="" width="1" height="1" border="0" />
  
  =================================
  <h3>基本情報</h3>
  <div class="mb-2">
  
  <span class="badge tag">劇団名</span> {{group}}
  
  {{title}}
  
  作・演出：{{author}}
  
  </div>
  <div class="mb-2">
  <div class="mb-2">

  </div>
  </div>
  <div class="mb-2">
  <h2><span class="badge tag mb-1">あらすじ</span></h2>
  <div class="play_wrap col-12 mt-2">
  <div class="container-fluid"><section class="row">
  <div id="col-info" class="col-12 col-md-4 mt-1">
  <div class="play_outline">
  
  {{synopsis}}
  
  </div>
  </div>
  </section></div>
  </div>
  <h2>ここがおすすめ</h2>
  </div>
  <strong>{{point1}}</strong>
  
  {{point1detail}}
  
  <strong>{{point2}}</strong>
  
  {{point2detail}}
  
  <strong>{{point3}}</strong>
  
  {{point3detail}}

  <div class="mb-2">
  
  ※評価は主観です。
  <table class="scoreTable scoreTable-red" style="height: 367px; width: 100%;">
  <tbody>
  <tr style="height: 63px;">
  <td style="height: 63px; width: 477px;">笑い</td>
  <td style="height: 63px; width: 187px;">[star-list number={{eval1}}]{{eval1}}</td>
  </tr>
  <tr style="height: 62px;">
  <td style="height: 62px; width: 477px;">独創性</td>
  <td style="height: 62px; width: 187px;">[star-list number={{eval2}}]{{eval2}}</td>
  </tr>
  <tr style="height: 62px;">
  <td style="height: 62px; width: 477px;">美しさ</td>
  <td style="height: 62px; width: 187px;">[star-list number={{eval3}}]{{eval3}}</td>
  </tr>
  <tr style="height: 62px;">
  <td style="height: 62px; width: 477px;">迫力</td>
  <td style="height: 62px; width: 187px;">[star-list number={{eval4}}]{{eval4}}</td>
  </tr>
  <tr style="height: 56px;">
  <td style="width: 477px; height: 56px;">感動</td>
  <td style="width: 187px; height: 56px;">[star-list number={{eval5}}] {{eval5}}</td>
  </tr>
  <tr style="height: 62px;">
  <td style="height: 62px; width: 477px;">総合</td>
  <td style="height: 62px; width: 187px;">[star-list number={{eval6}}] {{eval6}}</td>
  </tr>
  </tbody>
  </table>
  <h2>感想</h2>
    {{impressions}}
  
    <h2>twitterでの意見(抜粋)</h2>
    <blockquote class="twitter-tweet"><p lang="ja" dir="ltr">観劇三昧にてステージタイガーさんの『ラブラブドッキュンフォーエバー』観劇。<br>美喜役の人の演技が、病人で心の弱い感じを出しつつその中で感情が激しく動いている様子を見事に表現していて好きだった。最後の歌のシーンも圧巻。歌の入る芝居もいつかやってみたいものです。</p>&mdash; 桜糀るな🌸 next➡️10/21 役者SINGER!!昼の部 (@sakurakoji042) <a href="https://twitter.com/sakurakoji042/status/1508651496417550343?ref_src=twsrc%5Etfw">March 29, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <blockquote class="twitter-tweet"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/%E3%82%89%E3%81%B6%E3%81%A9%E3%81%8D%E3%82%85?src=hash&amp;ref_src=twsrc%5Etfw">#らぶどきゅ</a><br>観劇してきました。優しい言葉を、温かな声色を、柔らかな表情を。<br>沢山の愛を飲み込んできました。</p>&mdash; 小東 こと (@koto_minieast) <a href="https://twitter.com/koto_minieast/status/1497773019585937414?ref_src=twsrc%5Etfw">February 27, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </div>
  <div class="mb-2">
  <h2>まとめ</h2>
  観劇三昧{{title}}のおすすめポイントは、
  
  <strong>{{point1}}</strong>
  
  <strong>{{point2}}</strong>
  
  <strong>{{point3}}</strong>
  
  です！
  
  </div>
  <div class="mb-2">
  
  いかがだったでしょうか？興味を持たれた方は、観劇三昧でぜひ観てみてください！
  
  =================================
  
  <a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F510" rel="nofollow">→ 観劇三昧で{{group}}{{title}}を観る</a>
  
  =================================
  
  </div>
  &nbsp;
  `;

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setInputValues((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const replaceValues = () => {
    let replacedString = sampleString;
    for (const key in inputValues) {
      const regex = new RegExp(`{{${key}}}`, "g");
      replacedString = replacedString.replace(regex, inputValues[key]);
    }
    return replacedString;
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-2xl font-semibold mb-4">String Replacement App</h1>
      <div className="mb-4">
        <label htmlFor="group" className="block mb-2">
          group:
        </label>
        <input
          type="text"
          name="group"
          id="group"
          value={inputValues.group}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">
          title:
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={inputValues.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="author" className="block mb-2">
          作者:
        </label>
        <input
          type="text"
          name="author"
          id="author"
          value={inputValues.author}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="synopsis" className="block mb-2">
          あらすじ
        </label>
        <input
          type="text"
          name="synopsis"
          id="synopsis"
          value={inputValues.synopsis}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="point1" className="block mb-2">
          おすすめ1:
        </label>
        <input
          type="text"
          name="point1"
          id="point1"
          value={inputValues.point1}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="point2" className="block mb-2">
          おすすめ2:
        </label>
        <input
          type="text"
          name="point2"
          id="point2"
          value={inputValues.point2}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="point3" className="block mb-2">
          おすすめ3:
        </label>
        <input
          type="text"
          name="point3"
          id="point3"
          value={inputValues.point3}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="point1detail" className="block mb-2">
          おすすめ1の理由::
        </label>
        <input
          type="text"
          name="point1detail"
          id="point1detail"
          value={inputValues.point1detail}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="point2detail" className="block mb-2">
          おすすめ2の理由:
        </label>
        <input
          type="text"
          name="point2detail"
          id="point2detail"
          value={inputValues.point2detail}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="point3detail" className="block mb-2">
          おすすめ3の理由:
        </label>
        <input
          type="text"
          name="point3detail"
          id="point3detail"
          value={inputValues.point3detail}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="impressions" className="block mb-2">
          感想:
        </label>
        <input
          type="text"
          name="impressions"
          id="impressions"
          value={inputValues.impressions}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="eval1" className="block mb-2">
          評価1:
        </label>
        <input
          type="text"
          name="eval1"
          id="eval1"
          value={inputValues.eval1}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="eval2" className="block mb-2">
          評価2:
        </label>
        <input
          type="text"
          name="eval2"
          id="eval2"
          value={inputValues.eval2}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="eval3" className="block mb-2">
          評価3:
        </label>
        <input
          type="text"
          name="eval3"
          id="eval3"
          value={inputValues.eval3}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="eval4" className="block mb-2">
          評価4:
        </label>
        <input
          type="text"
          name="eval4"
          id="eval4"
          value={inputValues.eval4}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="eval5" className="block mb-2">
          評価5:
        </label>
        <input
          type="text"
          name="eval5"
          id="eval5"
          value={inputValues.eval5}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="eval6" className="block mb-2">
          総合評価:
        </label>
        <input
          type="text"
          name="eval6"
          id="eval6"
          value={inputValues.eval6}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={() => alert(replaceValues())}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Replace Values
        </button>
      </div>
      <div className="mt-4">
        <p className="whitespace-pre-line">{replaceValues()}</p>
      </div>
    </div>
  );
}
