import { NextApiRequest, NextApiResponse } from "next";

// pages/api/stringReplacement.js
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    id,
    group,
    title,
    star1,
    star2,
    star3,
    star4,
    star5,
    star6,
    review,
    recommendPoint1,
    recommendPoint2,
    recommendPoint3,
    recommendReason1,
    recommendReason2,
    recommendReason3,
    synopsis,
    twitter1,
    twitter2,
    twitter3,
  } = req.body;

  const inputValues: any = {
    id: id || "",
    group: group || "",
    title: title || "",
    star1: star1 || "",
    star2: star2 || "",
    star3: star3 || "",
    star4: star4 || "",
    star5: star5 || "",
    star6: star6 || "",
    review: review || "",
    recommendPoint1: recommendPoint1 || "",
    recommendPoint2: recommendPoint2 || "",
    recommendPoint3: recommendPoint3 || "",
    recommendReason1: recommendReason1 || "",
    recommendReason2: recommendReason2 || "",
    recommendReason3: recommendReason3 || "",
    synopsis: synopsis || "",
    twitter1: twitter1 || "",
    twitter2: twitter2 || "",
    twitter3: twitter3 || "",
    // ... (Repeat for other input values)
  };

  const replaceValues = () => {
    let replacedString = sampleString;
    for (const key in inputValues) {
      const regex = new RegExp(`{{${key}}}`, "g");
      replacedString = replacedString.replace(regex, inputValues[key]);
    }
    return replacedString;
  };

  res.status(200).send(replaceValues());
}

const sampleStringOriginal = `

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">『「観劇三昧」でおすすめの動画がわからない』という人向けに動画紹介をしています。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">今回は観劇三昧で配信されている動画である{{group}}「{{title}}」の紹介をします。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">もしもまだ、観劇三昧の登録をしていない方は登録することをおすすめします！</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-big_icon_point"} -->
<p class="is-style-big_icon_point">この記事は広告やPRを含んでいます。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-balloon_box2"} -->
<p class="is-style-balloon_box2">もっともっといろんな劇団を知りたいあなたに<br>全国640劇団以上配信中<br><a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+64C3M">オンライン観劇サービス【観劇三昧】</a><br>330作品以上無料！月額950円（税別）で全作品観放題！</p>
<!-- /wp:paragraph -->

<!-- wp:loos/ad-tag {"adID":"688"} /-->

<!-- wp:paragraph -->
<p><span class="swl-marker mark_blue">『{{title}}』は有料会員になることでご覧いただけます！</span></p>
<!-- /wp:paragraph -->

<!-- wp:loos/button {"hrefUrl":"https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2\u0026a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}","color":"red","className":"is-style-btn_solid"} -->
<div class="swell-block-button red_ is-style-btn_solid"><a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}" class="swell-block-button__link"><span>→観劇三昧で{{group}}『{{title}}』を観る</span></a></div>
<!-- /wp:loos/button -->

<!-- wp:heading -->
<h2 class="wp-block-heading">観劇三昧で{{group}}『{{title}}』を観る！</h2>
<!-- /wp:heading -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">基本情報</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"is-style-icon_pen"} -->
<p class="is-style-icon_pen">この作品は<span class="swl-marker mark_orange"><strong>有料作品</strong></span> です。定期購読することでご覧いただけます。</p>
<!-- /wp:paragraph -->

<!-- wp:image {"id":698,"sizeSlug":"full","linkDestination":"custom"} -->
<figure class="wp-block-image size-full"><a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}"><img src="https://engekinet.gekidankatakago.com/wp-content/uploads/2023/11/000291_00000000000000.jpg" alt="" class="wp-image-698"/></a></figure>
<!-- /wp:image -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading">再生時間</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>{{playtime}}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading"><strong>キャスト</strong></h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>{{cast}}}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":4} -->
<h4 class="wp-block-heading"><strong>スタッフ</strong></h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>{{staff}}</p>
<!-- /wp:paragraph -->

<!-- wp:loos/button {"hrefUrl":"https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2\u0026a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}","color":"red","className":"is-style-btn_solid"} -->
<div class="swell-block-button red_ is-style-btn_solid"><a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}" class="swell-block-button__link"><span>→観劇三昧で{{group}}『{{title}}』を観る</span></a></div>
<!-- /wp:loos/button -->

<!-- wp:heading -->
<h2 class="wp-block-heading">{{group}}『{{title}}』のあらすじ</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>{{synopsis}}</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">{{group}}『{{title}}』のここがおススメ！</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"is-style-icon_good"} -->
<p class="is-style-icon_good"><strong>{{recommendPoint1}}</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>{{recommendReason1}}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-icon_good"} -->
<p class="is-style-icon_good"><strong>{{recommendPoint2}}</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>{{recommendReason2}}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-icon_good"} -->
<p class="is-style-icon_good"><strong>{{recommendPoint3}}</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>{{recommendReason3}}</p>
<!-- /wp:paragraph -->

<!-- wp:loos/button {"hrefUrl":"https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2\u0026a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}","color":"red","className":"is-style-btn_solid"} -->
<div class="swell-block-button red_ is-style-btn_solid"><a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}" class="swell-block-button__link"><span>→観劇三昧で{{group}}『{{title}}』を観る</span></a></div>
<!-- /wp:loos/button -->

<!-- wp:heading -->
<h2 class="wp-block-heading">{{group}}『{{title}}』の個人的な評価</h2>
<!-- /wp:heading -->

<!-- wp:table -->
<figure class="wp-block-table"><table><tbody><tr><td>笑い</td><td>[review_stars {{star1}}] {{star1}}</td></tr><tr><td>独創性</td><td>[review_stars {{star2}}] {{star2}}</td></tr><tr><td>美しさ</td><td>[review_stars {{star3}}] {{star3}}</td></tr><tr><td>迫力</td><td>[review_stars {{star4}}] {{star4}}</td></tr><tr><td>感動</td><td>[review_stars {{star5}}] {{star5}}</td></tr><tr><td>総合</td><td>[review_stars {{star6}}] {{star6}}</td></tr></tbody></table><figcaption class="wp-element-caption">{{group}}『{{title}}』の個人的な評価</figcaption></figure>
<!-- /wp:table -->

<!-- wp:heading -->
<h2 class="wp-block-heading">{{group}}『{{title}}』を観た感想</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>{{review}}</p> 
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">{{group}}『{{title}}』のSNSでの感想・口コミ</h2>
<!-- /wp:heading -->

<!-- wp:embed {"url":"{{twitter1}}","type":"rich","providerNameSlug":"twitter","responsive":true} -->
<figure class="wp-block-embed is-type-rich is-provider-twitter wp-block-embed-twitter"><div class="wp-block-embed__wrapper">
{{twitter1}}
</div><figcaption class="wp-element-caption">{{group}}『{{title}}』のSNSでの感想・口コミ1</figcaption></figure>
<!-- /wp:embed -->

<!-- wp:embed {"url":"{{twitter2}}","type":"rich","providerNameSlug":"twitter","responsive":true} -->
<figure class="wp-block-embed is-type-rich is-provider-twitter wp-block-embed-twitter"><div class="wp-block-embed__wrapper">
{{twitter2}}
</div><figcaption class="wp-element-caption">{{group}}『{{title}}』のSNSでの感想・口コミ2</figcaption></figure>
<!-- /wp:embed -->

<!-- wp:embed {"url":"{{twitter3}}","type":"rich","providerNameSlug":"twitter","responsive":true} -->
<figure class="wp-block-embed is-type-rich is-provider-twitter wp-block-embed-twitter"><div class="wp-block-embed__wrapper">
{{twitter3}}
</div><figcaption class="wp-element-caption">{{group}}『{{title}}』のSNSでの感想・口コミ3</figcaption></figure>
<!-- /wp:embed -->

<!-- wp:heading -->
<h2 class="wp-block-heading">まとめ:　{{group}}『{{title}}』はかなりおススメ！</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>観劇三昧の演劇動画、{{group}}『{{title}}』のおすすめポイントは、</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>{{recommendPoint1}}</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>{{recommendPoint2}}</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>{{recommendPoint3}}</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>です！</p>
<!-- /wp:paragraph -->

<!-- wp:loos/button {"hrefUrl":"https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2\u0026a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}","color":"red","className":"is-style-btn_solid"} -->
<div class="swell-block-button red_ is-style-btn_solid"><a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+BW8O2&amp;a8ejpredirect=https%3A%2F%2Fv2.kan-geki.com%2Fstreaming%2Fplay%2F{{id}}" class="swell-block-button__link"><span>→観劇三昧で{{group}}『{{title}}』を観る</span></a></div>
<!-- /wp:loos/button -->

<!-- wp:paragraph -->
<p>いかがだったでしょうか？興味を持たれた方は、観劇三昧でぜひ観てみてください！</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"is-style-balloon_box2"} -->
<p class="is-style-balloon_box2">もっともっといろんな劇団を知りたいあなたに<br>全国640劇団以上配信中<br><a href="https://px.a8.net/svt/ejp?a8mat=3B9F8F+DQ5SVM+34L2+64C3M">オンライン観劇サービス【観劇三昧】</a><br>330作品以上無料！月額950円（税別）で全作品観放題！</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[ad_tag id="688"]
<!-- /wp:shortcode -->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->
`;

const sampleString = sampleStringOriginal.replace(/(\r\n|\n|\r)/gm, "");
