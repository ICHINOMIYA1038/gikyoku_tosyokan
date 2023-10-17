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
    fee: "無料",
    streamingid: "510",
    twitter1: "",
    twitter2: "",
    twitter3: "",
  });

  const sampleString = `『「観劇三昧」でおすすめの動画がわからない』という人向けに動画紹介をしています。

  今回は観劇三昧で配信されている動画「{{title}}」の紹介をします。
  
  もしもまだ、観劇三昧の登録をしていない方は登録することをおすすめします！==============================================
  もっともっといろんな劇団を知りたいあなたに
  全国640劇団以上配信中
  <a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+64C3M" rel="nofollow">オンライン観劇サービス【観劇三昧】</a>
  330作品以上無料！月額950円（税別）で全作品観放題！
  ==============================================
  <h2 class="mb-2"> 観劇三昧で『{{group}}』の{{title}}を観る</h2>
  <span class="ep-label bgc-DPblue brc-white ftc-white es-radius es-RpaddingSS es-LpaddingSS">{{fee}}</span>
  
  =================================
  
  <a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{streamingid}}" rel="nofollow">→ 観劇三昧で{{group}}『{{title}}』を観る</a> <img src="https://www11.a8.net/0.gif?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2" alt="" width="1" height="1" border="0" />
  
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
    {{twitter1}}
    {{twitter2}}
    {{twitter3}}
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
  
  <a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{streamingid}}" rel="nofollow">→ 観劇三昧で{{group}}『{{title}}』を観る</a>
  
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
        <label htmlFor="streamingid" className="block mb-2">
          streamingid:
        </label>
        <input
          type="text"
          name="streamingid"
          id="streamingid"
          value={inputValues.streamingid}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
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
        <label htmlFor="twitter1" className="block mb-2">
          twitter1:
        </label>
        <input
          type="text"
          name="twitter1"
          id="twitter1"
          value={inputValues.twitter1}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="twitter2" className="block mb-2">
          twitter2:
        </label>
        <input
          type="text"
          name="twitter2"
          id="twitter2"
          value={inputValues.twitter2}
          onChange={handleInputChange}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="twitter2" className="block mb-2">
          twitter3:
        </label>
        <input
          type="text"
          name="twitter3"
          id="twitter3"
          value={inputValues.twitter3}
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
