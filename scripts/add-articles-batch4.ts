/**
 * D. 劇団・劇場紹介 4本 + E. 英語追加 1本
 *
 * 使い方:
 *   npx tsx scripts/add-articles-batch4.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  language: string;
}

const articles: Article[] = [
  {
    slug: '2026-shimokitazawa-theater-guide',
    title: '下北沢の劇場ガイド｜本多劇場・ザ・スズナリほか',
    description: '演劇の街・下北沢の主要劇場を紹介。本多劇場、ザ・スズナリ、小劇場B1など、各劇場の特徴・座席数・アクセスをまとめました。',
    tags: ['劇場ガイド', '下北沢', '小劇場', '東京', '観劇'],
    language: 'ja',
    content: `下北沢（しもきたざわ）は「演劇の街」として知られる東京・世田谷区のエリアです。半径数百メートルの中に多数の小劇場が密集し、毎日のようにさまざまな公演が行われています。

## なぜ下北沢が「演劇の街」になったのか

下北沢が演劇の街として発展したのは、1982年に本多劇場がオープンしたことがきっかけです。

本多劇場の創設者・本多一夫氏は、駅前のパチンコ店を劇場に改装し、さらに周辺に複数の小劇場を建設しました。この「本多劇場グループ」が核となり、下北沢に演劇文化が根づきました。

1980年代の小劇場ブームと時期が重なり、野田秀樹の夢の遊眠社、鴻上尚史の第三舞台をはじめとする人気劇団が下北沢で公演を行い、街全体が演劇の街としてのアイデンティティを確立しました。

## 主要劇場一覧

### 本多劇場

- **座席数**：約386席
- **特徴**：下北沢を代表する劇場。プロの公演が中心。舞台機構が充実
- **アクセス**：小田急線・京王井の頭線 下北沢駅 南口から徒歩2分
- **備考**：下北沢の演劇文化の中心的存在

### ザ・スズナリ

- **座席数**：約200席
- **特徴**：本多劇場グループの一つ。小劇場の定番。客席と舞台の距離が近い
- **アクセス**：下北沢駅から徒歩3分
- **備考**：多くの小劇場ファンに愛される名劇場

### 駅前劇場

- **座席数**：約100席
- **特徴**：本多劇場グループ。その名の通り駅からすぐ。コンパクトな空間
- **アクセス**：下北沢駅から徒歩1分

### OFF・OFFシアター

- **座席数**：約80席
- **特徴**：本多劇場グループの最小劇場。若手劇団の登竜門的な場所
- **アクセス**：下北沢駅から徒歩3分

### 小劇場B1

- **座席数**：約72席
- **特徴**：地下にある親密な空間。実験的な作品が多い
- **アクセス**：下北沢駅から徒歩4分

### シアター711

- **座席数**：約80席
- **特徴**：本多劇場グループ。細長い空間が特徴
- **アクセス**：下北沢駅から徒歩2分

### 「劇」小劇場

- **座席数**：約100席
- **特徴**：本多劇場グループの比較的新しい劇場
- **アクセス**：下北沢駅から徒歩3分

## 下北沢で観劇するときのコツ

### チケットの買い方

- 多くの公演は**予約制**。劇団の公式サイトやチケット取扱サイトから予約
- 当日券が出る場合もあるが、人気公演は前売りで完売することも
- 小劇場は座席数が少ないので、早めの予約を推奨

### 服装・マナー

- 特にドレスコードはなし。カジュアルな服装でOK
- 上演中は携帯電話の電源をオフに
- 小劇場は客席と舞台が近いため、遅刻すると他の観客の邪魔になる。余裕を持って到着を

### 開演前・終演後

- 開場（開演30分前程度が多い）までは劇場の外で待つ
- 下北沢にはカフェや飲食店が多いので、開演前後に食事が楽しめる
- 終演後に出演者がロビーに出てくることも。声をかけて感想を伝えると喜ばれる

## 下北沢と演劇の未来

近年、下北沢駅周辺は再開発が進み、街の姿が変わりつつあります。しかし、劇場は健在であり、演劇の街としてのアイデンティティは変わっていません。

下北沢に来れば、必ずどこかの劇場で何かの公演が行われています。ふらっと立ち寄って、知らない劇団の舞台を観る——そんな偶然の出会いが、演劇の楽しさの一つです。`,
  },

  {
    slug: '2026-shinjuku-ikebukuro-theater',
    title: '新宿・池袋の演劇スポット紹介',
    description: '新宿と池袋の主要劇場を紹介。紀伊國屋ホール、新宿シアタートップス、東京芸術劇場、あうるすぽっとなど、アクセスと特徴をまとめました。',
    tags: ['劇場ガイド', '新宿', '池袋', '東京', '観劇'],
    language: 'ja',
    content: `新宿と池袋は、下北沢と並ぶ東京の演劇エリアです。大劇場から小劇場まで、多様な規模の劇場が集まっています。

## 新宿エリア

### 紀伊國屋ホール

- **座席数**：約418席
- **場所**：新宿区新宿3丁目（紀伊國屋書店新宿本店4階）
- **特徴**：1964年開場の歴史ある劇場。日本の現代演劇の歴史とともに歩んできた。書店の上階にあるという立地も魅力
- **アクセス**：JR新宿駅東口から徒歩5分

### 紀伊國屋サザンシアターTAKASHIMAYA

- **座席数**：約468席
- **場所**：渋谷区千駄ヶ谷5丁目（タカシマヤタイムズスクエア内）
- **特徴**：紀伊國屋ホールの姉妹劇場。商業演劇や中規模の公演が多い
- **アクセス**：JR新宿駅新南口から徒歩3分

### 新宿シアタートップス（※2022年閉館）

- かつて新宿にあった伝統的な小劇場。多くの劇作家・劇団がここから世に出た
- 2022年に惜しまれながら閉館。跡地にはSOMECITY SHINJUKU THEATERがオープン

### 新宿FACE

- **座席数**：約500席（スタンディング時）
- **場所**：新宿区歌舞伎町
- **特徴**：もともとプロレス・格闘技のイベント会場だが、演劇公演にも使用される

## 池袋エリア

### 東京芸術劇場

- **所在地**：豊島区西池袋1丁目
- **アクセス**：JR池袋駅西口から徒歩2分

池袋のランドマーク的な存在の大型複合文化施設です。

#### プレイハウス（中ホール）

- **座席数**：約834席
- **特徴**：演劇公演のメイン会場。野田秀樹が芸術監督を務めている（2024年現在）
- 国内外の注目作品が上演される

#### シアターイースト / シアターウエスト

- **座席数**：各約272席
- **特徴**：中規模の公演に最適。実験的な作品から商業作品まで幅広い

### あうるすぽっと（豊島区立舞台芸術交流センター）

- **座席数**：約300席
- **場所**：豊島区東池袋4丁目
- **特徴**：豊島区が運営する公共劇場。地域密着型の公演と招聘公演
- **アクセス**：東京メトロ有楽町線 東池袋駅から徒歩2分

### シアターグリーン

- **場所**：豊島区南池袋2丁目
- **アクセス**：池袋駅東口から徒歩5分

3つの劇場（BIG TREE THEATER、BASE THEATER、BOX in BOX THEATER）を擁する複合劇場施設です。

- **BIG TREE THEATER**：約180席。池袋の小劇場の中心的存在
- **BASE THEATER**：約100席
- **BOX in BOX THEATER**：約60席。最も小さく、若手劇団の登竜門

## 新宿・池袋で観劇するメリット

### アクセスの良さ

新宿も池袋もターミナル駅であり、どこからでもアクセスしやすいのが最大のメリットです。

### 公演の多様性

大劇場（東京芸術劇場プレイハウス）から小劇場（シアターグリーンBOX in BOX）まで、あらゆる規模の公演を観ることができます。

### 周辺施設の充実

飲食店、書店（紀伊國屋書店で戯曲を買える）、映画館など、観劇前後に楽しめる施設が豊富です。

## 劇場選びのポイント

初めて観劇する方は、以下を参考にしてください。

- **大きな劇場**（紀伊國屋ホール、東京芸術劇場）：有名な作品・俳優の公演が多く、初心者にも安心
- **中規模劇場**（あうるすぽっと、シアターイースト）：質の高い公演を適度な距離感で観られる
- **小劇場**（シアターグリーン）：舞台との距離が近く、演劇の生々しさを体感できる

東京の演劇は、下北沢だけではありません。新宿・池袋にも豊かな演劇文化があります。ぜひ足を運んでみてください。`,
  },

  {
    slug: '2026-famous-theater-companies',
    title: '有名劇団ガイド｜柿喰う客・ヨーロッパ企画・東京乾電池ほか',
    description: '日本の有名劇団を紹介。劇団ごとの特徴、代表作、公演の探し方をまとめました。演劇初心者の劇団選びの参考に。',
    tags: ['劇団紹介', '演劇', '小劇場', '観劇ガイド'],
    language: 'ja',
    content: `日本には数多くの劇団が活動しています。ここでは、特に人気・実力のある劇団を中心に紹介します。初めて観劇する方の劇団選びの参考にしてください。

## 大人計画

- **主宰**：松尾スズキ
- **設立**：1988年
- **特徴**：毒とユーモアが同居するブラックコメディ。阿部サダヲ、宮藤官九郎など映像でも活躍する俳優が所属
- **おすすめ作品**：『キレイ』『マシーン日記』

## ナイロン100℃

- **主宰**：ケラリーノ・サンドロヴィッチ（KERA）
- **設立**：1993年
- **特徴**：コメディからシリアスまで幅広い作風。構成力の高さと俳優の演技力が魅力
- **おすすめ作品**：『フローズン・ビーチ』『百年の秘密』

## 柿喰う客（かきくうきゃく）

- **主宰**：中屋敷法仁
- **設立**：2004年
- **特徴**：激しい身体表現と大量のセリフを高速で繰り出す「超高速演劇」。若手劇団の中で圧倒的な存在感
- **おすすめ作品**：『露出狂』『御披楽喜』

## ヨーロッパ企画

- **主宰**：上田誠
- **設立**：1998年（京都）
- **特徴**：京都を拠点に活動。日常の中のSF的な発想をコメディに昇華。映画『サマータイムマシン・ブルース』の原作劇団としても有名
- **おすすめ作品**：『サマータイムマシン・ブルース』『九十九龍城』

## 東京乾電池

- **主宰**：柄本明
- **設立**：1976年
- **特徴**：ベテラン俳優・柄本明が主宰する老舗劇団。飄々としたユーモアと深い人間観察
- **おすすめ作品**：柄本明のソロ公演シリーズ

## 青年団

- **主宰**：平田オリザ
- **設立**：1982年
- **特徴**：「現代口語演劇」の実践。日常会話のリアルな再現。こまばアゴラ劇場を拠点
- **おすすめ作品**：『東京ノート』『カガクするココロ』

## NODA MAP

- **主宰**：野田秀樹
- **設立**：1993年
- **形態**：プロデュース公演（固定メンバーではなく、毎回キャストを集める）
- **特徴**：日本最高峰の劇作家による大作。言葉遊びとスピードの演劇
- **おすすめ作品**：『贋作・桜の森の満開の下』『エッグ』

## イキウメ

- **主宰**：前川知大
- **設立**：2003年
- **特徴**：SF的な設定と日常ドラマの融合。不思議な世界観に引き込まれる
- **おすすめ作品**：『太陽』『散歩する侵略者』（映画化もされた）

## マームとジプシー

- **主宰**：藤田貴大
- **設立**：2007年
- **特徴**：「リフレイン（反復）」の手法が特徴的。同じ場面を繰り返すことで記憶と感情が深まる
- **おすすめ作品**：『cocoon』

## 劇団☆新感線（げきだんしんかんせん）

- **主宰**：いのうえひでのり（演出）
- **設立**：1980年
- **特徴**：「いのうえ歌舞伎」と呼ばれるスペクタクル時代劇。ロックミュージックと殺陣、エンターテインメント性抜群
- **おすすめ作品**：『髑髏城の七人』『蛮幽鬼』

## チェルフィッチュ

- **主宰**：岡田利規
- **設立**：1997年
- **特徴**：日常語のだらだらした語りと、独特の「身体」。現代演劇の最前線
- **おすすめ作品**：『三月の5日間』

## 劇団の公演情報を探すには

- 各劇団の公式サイト・SNS
- **CoRich舞台芸術**：公演情報の検索・口コミ
- **ステージナタリー**：演劇ニュースサイト
- **チケットぴあ**・**イープラス**：チケット購入サイト

気になる劇団を見つけたら、まずは一度観に行ってみてください。劇団の「色」は実際に観ないとわかりません。そして、一つの劇団が合わなくても、別の劇団が合うかもしれません。日本の劇団は多様で、必ずあなたに合う劇団があるはずです。`,
  },

  {
    slug: '2026-theater-festivals-competitions',
    title: '全国の演劇祭・コンクール一覧｜出場・参加する方法',
    description: '日本全国の主要な演劇祭・コンクール・フェスティバルを紹介。高校演劇、アマチュア劇団、プロ向けの各カテゴリ別にまとめました。',
    tags: ['演劇祭', 'コンクール', '演劇', 'フェスティバル', 'ガイド'],
    language: 'ja',
    content: `演劇祭やコンクールは、作品を発表し、他の団体と交流する貴重な機会です。日本各地で開催されている主要な演劇祭・コンクールを紹介します。

## 高校演劇のコンクール

### 全国高等学校演劇大会

- **主催**：全国高等学校演劇協議会・全国高等学校文化連盟
- **概要**：高校演劇の全国大会。各都道府県大会→ブロック大会→全国大会と勝ち上がる
- **時期**：全国大会は毎年夏（8月頃）
- **参加方法**：各都道府県の高等学校演劇連盟を通じて参加

### 春季全国高等学校演劇研究大会（春フェス）

- **概要**：全国大会とは別に、各地域で開催される交流型の大会
- **特徴**：コンクール形式ではなく、交流と研修が目的

### 高校演劇の特徴

高校演劇は、上演時間60分以内、転換を含めて舞台設営は自分たちで行うなど、独自のルールがあります。既成脚本（プロの劇作家の作品）と創作脚本（部員が書いたオリジナル）の両方が上演されます。

## アマチュア・市民劇団向け

### 全国アマチュア演劇祭

- **主催**：日本アマチュア演劇連盟
- **概要**：全国のアマチュア劇団が参加する演劇祭
- **参加方法**：日本アマチュア演劇連盟の加盟団体を通じて参加

### 地域の演劇祭

各都道府県・市区町村レベルで、地域の演劇祭が開催されています。

- **東京都**：東京都演劇アンサンブルコンクール
- **大阪府**：大阪演劇祭
- **福岡県**：福岡演劇フェスティバル

地元の演劇協会や文化財団に問い合わせると、参加できる演劇祭が見つかります。

## プロ・セミプロ向け

### フェスティバル/トーキョー（F/T）

- **概要**：東京で開催される国際舞台芸術フェスティバル。2009年に開始
- **特徴**：国内外の先鋭的な舞台作品を上演・紹介。公募プログラムもある
- **会場**：東京芸術劇場、あうるすぽっとなど池袋周辺

### KYOTO EXPERIMENT（京都国際舞台芸術祭）

- **概要**：京都で開催される国際舞台芸術祭。2010年に開始
- **特徴**：実験的・前衛的な作品が中心。アジアの作品も多い
- **時期**：秋（10月頃）

### TPAM（国際舞台芸術ミーティング in 横浜）

- **概要**：舞台芸術の国際的なプラットフォーム。プロフェッショナル向け
- **特徴**：アジアを中心とした舞台芸術関係者が集まるネットワーキングの場
- **時期**：2月頃

### 利賀演劇祭（SCOT サマー・シーズン）

- **場所**：富山県南砺市利賀村
- **主催**：SCOT（鈴木忠志主宰）
- **特徴**：山間の合掌造り集落で開催される演劇祭。国内外の劇団が参加
- **時期**：夏

### 豊岡演劇祭

- **場所**：兵庫県豊岡市
- **概要**：2020年に開始。平田オリザが芸術監督
- **特徴**：城崎温泉をはじめとする豊岡市各所で上演。観光と演劇の融合

## 戯曲のコンクール

### 岸田國士戯曲賞

- **主催**：白水社
- **概要**：日本で最も権威のある戯曲賞。新人・中堅の劇作家が対象
- **選考**：前年に上演・出版された戯曲から選ばれる
- **これまでの受賞者**：別役実、つかこうへい、野田秀樹、鴻上尚史、平田オリザ、三谷幸喜、松尾スズキ、岡田利規、宮藤官九郎など

### AAF戯曲賞（愛知県芸術劇場）

- **主催**：愛知県芸術劇場
- **概要**：新人劇作家の発掘を目的とした戯曲のコンクール
- **特徴**：応募作品の中からリーディング上演を経て受賞作が決定
- **応募方法**：公式サイトから応募可能

### OMS戯曲賞

- **主催**：大阪ガスネットワーク
- **概要**：関西を拠点に活動する劇作家を対象とした戯曲賞

### 北海道戯曲賞

- **主催**：北海道演劇財団
- **概要**：全国から応募可能。地方発の戯曲を発掘

## 演劇祭・コンクールに参加するメリット

1. **作品を外の目で見てもらえる**：身内だけでなく、審査員や他団体の観客からフィードバックが得られる
2. **他の団体と出会える**：交流を通じて刺激を受け、ネットワークが広がる
3. **目標ができる**：コンクールという目標があることで、稽古や作品づくりのモチベーションが上がる
4. **活動の証になる**：受賞歴は劇団の実績として評価される

演劇は「観客の前で上演する」ことで完成する芸術です。演劇祭やコンクールは、その機会を広げてくれる大切な場です。`,
  },

  {
    slug: 'guide-25d-musicals-explained',
    title: '2.5D Musicals Explained: Where Anime Meets the Stage in Japan',
    description: 'A comprehensive guide to 2.5D musicals — Japan\'s unique theater genre that brings anime, manga, and game characters to life on stage. History, hit shows, and how to attend.',
    tags: ['Japanese Theater', '2.5D Musical', 'Anime', 'Manga', 'Guide', 'Theater Culture'],
    language: 'en',
    content: `2.5D musicals are one of Japan's most exciting theatrical innovations — live stage productions that bring anime, manga, and video game characters to life through elaborate costumes, choreography, and cutting-edge stagecraft.

## What Are 2.5D Musicals?

The term "2.5D" refers to the space between "2D" (the flat world of anime, manga, and games) and "3D" (the real world of live theater). In a 2.5D musical, real actors embody fictional characters with remarkable visual fidelity — colorful wigs, detailed costumes, and carefully replicated physicality.

The Japan 2.5-Dimensional Musical Association (established 2014) officially promotes and defines this genre, reflecting its cultural and economic significance.

## A Brief History

### The Pioneer: "Musical Tennis no Oujisama" (2003)

The genre's origin story begins with the musical adaptation of *The Prince of Tennis* (Tenimyu), based on Takeshi Konomi's manga about competitive tennis. Premiering in 2003, it faced initial skepticism — how do you stage tennis with singing? But the show's energy, youthful cast, and passionate fan response proved that anime-to-stage adaptation could work brilliantly.

### The Explosion (2010s)

The 2010s saw an exponential growth in 2.5D productions:

- **"Touken Ranbu" Stage Series** (2015–): Based on the hit sword-personification game, featuring spectacular sword fight choreography
- **"Touken Ranbu" Musical Series** (2016–): A separate musical line from the same source material
- **"Haikyuu!!" (Hyper Projection Play)** (2015–): A volleyball manga adaptation using projection mapping to create dynamic match sequences
- **"Demon Slayer: Kimetsu no Yaiba"** (2020–): Stage adaptation of the global manga phenomenon

### The Present Day

Today, hundreds of 2.5D productions are staged annually in Japan, generating billions of yen in revenue. International tours to Asia, North America, and Europe have expanded the genre's global reach.

## What Makes 2.5D Musicals Special?

### Visual Recreation

The commitment to character accuracy is extraordinary. Every detail — hair color, costume design, even body language — is meticulously recreated. Specialized wig artists and costume designers have developed techniques specifically for 2.5D productions.

### Fight Choreography

Many source materials involve combat, so 2.5D shows feature impressive sword fights and martial arts sequences. Professional *tate-shi* (fight choreographers) create safe yet thrilling action sequences.

### Technology Integration

Modern 2.5D productions employ cutting-edge technology:
- **Projection mapping** for dynamic backgrounds and special effects
- **LED screens** for scene transitions
- **Wire work** for aerial sequences
- **Specialized lighting** to recreate anime visual styles

### The Repeat Culture

2.5D fans often attend multiple performances of the same production. Shows encourage this with:
- **Day-specific improvisations** (himaku — daily variations)
- **Different seating perspectives** offering new visual experiences
- **Random distribution** of special merchandise per performance

## Why It Works: Understanding the Appeal

### Characters Come to Life

Seeing a beloved character exist in three-dimensional space — breathing, moving, responding in real-time — creates an emotional connection that no screen can replicate.

### A Launchpad for Actors

2.5D musicals serve as a career springboard for young Japanese actors. Many of today's leading film and TV stars began in 2.5D roles, building dedicated fanbases before transitioning to broader entertainment.

### Community and Belonging

The 2.5D fan community is remarkably active and supportive. Social media discussions, fan art, and post-show gatherings create a rich social ecosystem around productions.

## Major 2.5D Franchises

| Franchise | Source | Years Active | Style |
|---|---|---|---|
| Musical Tennis no Oujisama | Manga | 2003– | Musical |
| Touken Ranbu (Stage) | Game | 2015– | Sword action drama |
| Touken Ranbu (Musical) | Game | 2016– | Musical |
| Haikyuu!! | Manga | 2015–2023 | Sports drama with projection |
| Demon Slayer | Manga | 2020– | Action drama |
| Sailor Moon | Manga/Anime | 2013– (revival) | Musical |
| Naruto | Manga | 2015– | Action musical |
| My Hero Academia | Manga | 2019– | Musical |

## How to Attend as an International Visitor

### Finding Shows

- Check official franchise websites for schedule announcements
- Follow 2.5D news on social media (search: 2.5次元)
- The Japan 2.5-Dimensional Musical Association website lists upcoming productions

### Getting Tickets

- Most tickets are sold through Japanese ticketing platforms (e-plus, Ticket Pia, Lawson Ticket)
- Some productions allocate tickets specifically for international visitors
- Fan club presales often sell out quickly; general sales are the best option for visitors

### At the Theater

- Arrive early — many venues sell exclusive merchandise before the show
- Photography and recording are strictly prohibited during performances
- Standing ovations are common; follow the audience's lead
- Some shows have post-performance events (curtain call variations, etc.)

## 2.5D and Traditional Theater

Rather than competing with traditional Japanese theater, 2.5D has expanded the overall theater audience:

- Many 2.5D fans discover an interest in other forms of theater
- Actors move between 2.5D and straight plays, cross-pollinating audiences
- Technical innovations from 2.5D (projection, LED) influence other productions

2.5D musicals represent one of the most dynamic intersections of Japanese pop culture and performing arts. Whether you're an anime fan curious about theater or a theater lover interested in new forms, 2.5D offers a uniquely Japanese experience worth exploring.`,
  },
];

async function main() {
  console.log(`Inserting ${articles.length} articles...`);

  for (const article of articles) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      console.log(`  SKIP (exists): ${article.slug}`);
      continue;
    }

    await prisma.blogPost.create({
      data: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        content: article.content,
        tags: article.tags,
        language: article.language,
        published: true,
        publishedAt: new Date(),
      },
    });
    console.log(`  OK: ${article.slug}`);
  }

  const count = await prisma.blogPost.count({ where: { published: true } });
  console.log(`\nTotal published articles: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
