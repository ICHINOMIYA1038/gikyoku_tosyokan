/**
 * 演劇メニュー辞典 シードデータ v2
 * カテゴリを4→10に再編、メタデータ拡張後の完全版。
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-theater-menu.ts        # 本番
 *   set -a && source .env.development.local && set +a && npx tsx scripts/seed-theater-menu.ts # ローカル
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    slug: "warmup",
    name: "ウォームアップ",
    icon: "sparkles",
    order: 10,
    description:
      "稽古の最初に空気を作り、身体と声を目覚めさせる導入エクササイズ。5〜15分で扱える定番から。",
  },
  {
    slug: "voice-training",
    name: "発声練習",
    icon: "mic",
    order: 20,
    description:
      "腹式呼吸・共鳴・滑舌・母音強化など、声を作るための基礎トレーニング集。",
  },
  {
    slug: "focus-trust",
    name: "集中・信頼",
    icon: "target",
    order: 30,
    description:
      "集中力と互いの信頼を作るエクササイズ。稽古初日や、集団が固くなったときに。",
  },
  {
    slug: "movement",
    name: "ムーブメント",
    icon: "activity",
    order: 40,
    description:
      "身体表現・空間認識・リズムのエクササイズ。ラバン、ビューポインツなどの現代身体演技法も。",
  },
  {
    slug: "improv-short",
    name: "インプロ短形式",
    icon: "gamepad",
    order: 50,
    description:
      "Whose Line 系のショートフォーム即興ゲーム。ルールが明快で盛り上がり、観客受けも良い。",
  },
  {
    slug: "improv-long",
    name: "インプロ長形式",
    icon: "layers",
    order: 60,
    description:
      "Harold などの長形式即興。ワンシーンを掘り下げる、キャラクターを継続させるなどの上級形式。",
  },
  {
    slug: "etude",
    name: "エチュード",
    icon: "flame",
    order: 70,
    description:
      "俳優訓練のための課題劇。シチュエーション・関係性・感情・制約条件で作る演技実習の題材集。",
  },
  {
    slug: "devising",
    name: "デバイジング",
    icon: "puzzle",
    order: 80,
    description:
      "集団創作のための手法。台本のない状態から作品を立ち上げる、コラボレーティブな稽古メソッド。",
  },
  {
    slug: "method",
    name: "メソッド解説",
    icon: "book",
    order: 90,
    description:
      "スタニスラフスキー、ブレヒト、鈴木忠志、マイズナー、リー・ストラスバーグなどの俳優訓練メソッドの解説とエクササイズ。",
  },
  {
    slug: "workshop-script",
    name: "ワークショップ台本",
    icon: "script",
    order: 100,
    description:
      "短時間で読める・演じられる短編台本集。ワークショップ、体験入団、演技クラスの実習教材として。",
  },
];

// ------------------------------------------------------------
// 全メニュー (30件超)
// 既存11件は新カテゴリにマップし直し、メタデータを拡張
// ------------------------------------------------------------
type MenuInput = {
  slug: string;
  categorySlug: string;
  title: string;
  summary: string;
  duration?: number | null;
  minPeople?: number | null;
  maxPeople?: number | null;
  difficulty?: number | null;
  tags: string[];
  aliases?: string[];
  learningObjectives?: string[];
  ageGroup?: string | null;
  materials?: string[];
  spaceRequirement?: string | null;
  hasPhysicalContact?: boolean | null;
  sideCoaching?: string | null;
  reflectionQuestions?: string[];
  videoUrl?: string | null;
  credit?: string | null;
  sourceUrl?: string | null;
  relatedSlugs?: string[];
  content: string;
};

// キュレーション: 手動で「これの次はこれ」的な関連メニュー
const CURATED_RELATED: Record<string, string[]> = {
  "shake-out": ["name-clap", "walk-through-space", "abdominal-breathing"],
  "name-clap": ["shake-out", "zip-zap-zop", "one-word-story"],
  "walk-through-space": ["viewpoints-tempo", "space-shapes", "mirror-exercise"],
  "abdominal-breathing": ["tongue-twisters", "vowel-strengthening", "resonance-humming"],
  "tongue-twisters": ["vowel-strengthening", "abdominal-breathing"],
  "vowel-strengthening": ["tongue-twisters", "resonance-humming"],
  "resonance-humming": ["abdominal-breathing", "vowel-strengthening"],
  "trust-fall": ["mirror-exercise", "counting-together"],
  "one-two-three-clap": ["counting-together", "zip-zap-zop", "yes-and"],
  "counting-together": ["one-two-three-clap", "trust-fall"],
  "mirror-exercise": ["trust-fall", "viewpoints-tempo", "walk-through-space"],
  "viewpoints-tempo": ["walk-through-space", "space-shapes", "mirror-exercise"],
  "space-shapes": ["viewpoints-tempo", "walk-through-space", "chorus-work"],
  "zip-zap-zop": ["name-clap", "yes-and", "one-word-story"],
  "yes-and": ["one-word-story", "one-word-scene", "harold"],
  "one-word-story": ["yes-and", "one-word-scene"],
  "one-word-scene": ["one-word-story", "waiting-room", "yes-and"],
  "harold": ["montage", "yes-and", "chorus-work"],
  "montage": ["harold", "yes-and", "devising-fragments"],
  "waiting-room": ["unexpected-visitor", "secret-conflict", "one-word-scene"],
  "unexpected-visitor": ["waiting-room", "secret-conflict", "family-dinner-fragment"],
  "secret-conflict": ["unexpected-visitor", "waiting-room", "meisner-repetition"],
  "devising-fragments": ["chorus-work", "montage"],
  "chorus-work": ["devising-fragments", "space-shapes", "viewpoints-tempo"],
  "stanislavski-magic-if": ["meisner-repetition", "secret-conflict", "unexpected-visitor"],
  "meisner-repetition": ["stanislavski-magic-if", "secret-conflict", "waiting-room"],
  "elevator-strangers": ["waiting-room", "unexpected-visitor", "family-dinner-fragment"],
  "family-dinner-fragment": ["elevator-strangers", "unexpected-visitor", "secret-conflict"],
};

const MENUS: MenuInput[] = [
  // ============ ウォームアップ ============
  {
    slug: "shake-out",
    categorySlug: "warmup",
    title: "シェイクアウト (8-8-4-4-2-2-1-1)",
    summary:
      "右手・左手・右足・左足を順に8回・8回・4回・4回…と振り、最後は1回でジャンプ。3分で身体と声のスイッチが入る鉄板ウォームアップ。",
    duration: 3,
    minPeople: 1,
    maxPeople: 100,
    difficulty: 1,
    tags: ["ウォームアップ", "身体", "定番", "短時間"],
    aliases: ["エイトカウント", "エネルギーシェイク"],
    learningObjectives: ["身体を目覚めさせる", "カウントに合わせて集団を揃える", "エネルギーを一気に上げる"],
    ageGroup: "小学生〜大人",
    materials: [],
    spaceRequirement: "各自が両手を広げられる程度のスペース",
    hasPhysicalContact: false,
    sideCoaching: "「声を出しながらカウント!」「最後の1で一番高くジャンプ!」",
    reflectionQuestions: ["身体のどこが目覚めた?", "集中の入りにどんな効果があった?"],
    content: `## 手順

1. 全員で円になる、または前を向いて立つ
2. 右手を振りながら全員で **「1・2・3・4・5・6・7・8!」**
3. 続けて左手を8回、右足を8回、左足を8回
4. 次は各部位を4回ずつ (右手→左手→右足→左足)
5. 次は2回ずつ、最後は1回ずつ
6. 「1!」で全員がジャンプして終了

## 進行のコツ

- 数字は必ず声を出す。ここで恥ずかしがると本番の声も出ない
- リーダーが最初は大きな声で牽引、慣れたら全員で
- 最後のジャンプは思い切り高く

## バリエーション

- ダブルスピード: カウントを倍速に
- 部位を追加: 首→肩→腰→膝を追加してフルバージョンに
- 逆順: 1・1・2・2・4・4・8・8 で徐々に落ち着かせる`,
  },
  {
    slug: "name-clap",
    categorySlug: "warmup",
    title: "ネームクラップ (名前+動き)",
    summary:
      "円になり、順番に自分の名前と一つの動きを披露する。全員が真似して返す、自己紹介と身体のほぐしを兼ねたエクササイズ。",
    duration: 10,
    minPeople: 5,
    maxPeople: 30,
    difficulty: 1,
    tags: ["ウォームアップ", "アイスブレイク", "自己紹介", "初対面"],
    learningObjectives: ["互いの名前を覚える", "身体で自己表現する敷居を下げる", "集団としてまとまる感覚"],
    ageGroup: "小学生〜大人",
    materials: [],
    spaceRequirement: "全員で円が組めるスペース",
    hasPhysicalContact: false,
    sideCoaching: "「動きは小さくてもOK、その人らしければいい」「返すときは元気良く!」",
    reflectionQuestions: ["誰の動きが印象に残った?", "自分の動きは自分らしかった?"],
    content: `## 手順

1. 全員で円になる
2. 最初の1人が **名前+一つの動き** (例: 「たなか!」とジャンプ)
3. 全員が **その動きと名前** をコピーして返す
4. 隣の人が次の動きを披露、全員がコピー
5. 円が一周するまで続ける

## 進行のコツ

- 「うまい動き」を求めない。動きは何でもOK
- 恥ずかしがりの人には「腕を上げるだけでもいい」と伝える
- コピーは大きく、褒めるように

## バリエーション

- **積み上げ版**: 2番目の人は「1番目+自分」、3番目は「1・2+自分」と全員記憶
- **感情添え**: 名前を「悲しく」「怒って」「秘密っぽく」など指定して言う
- **無言版**: 動きだけで自己紹介`,
  },
  {
    slug: "walk-through-space",
    categorySlug: "warmup",
    title: "空間を歩く (Walk Through Space)",
    summary:
      "空間を無目的に歩き回りながら、リーダーの指示 (速度・関係性・感情) で歩き方を変える。集団の身体的アンサンブル感を作る基本。",
    duration: 10,
    minPeople: 4,
    maxPeople: 40,
    difficulty: 1,
    tags: ["ウォームアップ", "空間", "身体", "アンサンブル"],
    aliases: ["ニュートラルウォーク"],
    learningObjectives: ["空間を意識的に使う", "集団のアンサンブル感覚", "スピードと感情のコントロール"],
    ageGroup: "中学生〜大人",
    materials: [],
    spaceRequirement: "全員が交差できる広めのスペース",
    hasPhysicalContact: false,
    sideCoaching: "「空間の穴を埋めるように」「他人と目を合わせずに、でも意識はする」",
    reflectionQuestions: ["1と10のどの速度が一番動きにくかった?", "感情の変化は身体のどこから始まった?"],
    content: `## 手順

### フェーズ1: ニュートラルウォーク (2分)

- 空間を自由に歩く
- 目的地を作らない、道を作らない
- **他人とぶつからず、他人を避けもせず**、常に空間を埋める意識で

### フェーズ2: 速度指定 (3分)

- リーダーが「スピード1(最も遅い)〜10(最も速い)」を数字でコール
- 全員が瞬時にその速度に切り替える
- 1〜10 をランダムに、または段階的に

### フェーズ3: 状況指定 (5分)

指示例:
- 「遅刻しそうな会社員として」
- 「氷の上を歩くように」
- 「怒っているが顔には出さないように」
- 「今日この空間で誰かに秘密の合図を送る」

## 進行のコツ

- **道を作らない**は最重要。放っておくと全員が円周を回り始める
- 感情指定では**外に見せる**より**内側で感じる**を優先
- 静止と停止の違いを教える (「止まっている」も演技)

## バリエーション

- **群衆モード**: 街の雑踏、駅、市場
- **時代モード**: 江戸時代の商人、未来の宇宙船
- **停止指示**: リーダーの手拍子で全員静止→再開`,
  },

  // ============ 発声練習 ============
  {
    slug: "abdominal-breathing",
    categorySlug: "voice-training",
    title: "腹式呼吸トレーニング",
    summary:
      "腹式呼吸は舞台の声の土台。仰向けと立位の2ステップで、横隔膜の動きを意識的に使えるようにする基礎練習。",
    duration: 10,
    minPeople: 1,
    maxPeople: 30,
    difficulty: 1,
    tags: ["基礎", "呼吸", "ウォームアップ", "一人でできる"],
    learningObjectives: ["横隔膜による呼吸感覚を得る", "長く安定した息を出す", "疲れにくい発声の土台"],
    ageGroup: "中学生〜大人",
    materials: ["ヨガマット (あれば)"],
    spaceRequirement: "1人あたり2畳ほど",
    hasPhysicalContact: false,
    sideCoaching: "「肩を上げない」「顎を引く」「胸ではなくお腹の手が動く」",
    reflectionQuestions: ["普段の呼吸と何が違った?", "10秒吐き続けられた?", "疲労感の質はどう変わった?"],
    content: `## ねらい

- 胸ではなく横隔膜で息を吸う感覚をつかむ
- 長く安定した息を出せるようにする
- 舞台上での通る声・疲れにくい声の土台をつくる

## 手順

### 1. 仰向けで感覚をつかむ (3分)

1. 仰向けになり、片手を胸、片手をお腹に置く
2. 鼻からゆっくり息を吸う。**お腹の手だけが上がる**ように意識
3. 口から細く長く吐く。お腹が沈むのを確認
4. これを10回

> 胸の手が動いたら胸式呼吸になっている。動かないようにゆっくり。

### 2. 座位・立位に移す (3分)

1. あぐらまたは立って、両手を脇腹に添える
2. 息を吸うと **脇腹が横に広がる**のを感じる
3. 吐く時は脇腹がゆっくり戻る

### 3. カウントブレス (4分)

- 4カウントで吸って、8カウントで吐く → 慣れたら 4吸って16吐く
- 声を出すときの「息のペース配分」の練習になる

## バリエーション

- **紙吹き**: 息だけでティッシュを一定時間浮かせる
- **ロングトーン**: 「あーーー」で最長何秒出せるか、日々記録
- **段階息**: 4カウントで吐く / 8カウントで吐く / 12カウントで吐く を混ぜる`,
  },
  {
    slug: "tongue-twisters",
    categorySlug: "voice-training",
    title: "早口言葉・滑舌トレーニング",
    summary:
      "定番の早口言葉を、速度ではなく「一音一音の明瞭さ」で回す滑舌練習。舌・唇・顎の可動域を広げる。",
    duration: 15,
    minPeople: 1,
    maxPeople: 40,
    difficulty: 2,
    tags: ["滑舌", "基礎", "ウォームアップ"],
    learningObjectives: ["舌・唇・顎の可動域拡大", "苦手音の把握と改善", "遅い速度での明瞭な発音"],
    ageGroup: "小学生〜大人",
    materials: [],
    spaceRequirement: "特に不要",
    hasPhysicalContact: false,
    sideCoaching: "「速さ勝負じゃない、明瞭さ勝負」「録音して聞いてみて」",
    reflectionQuestions: ["自分の苦手音は何?", "録音を聞いた印象と自分の感覚のズレは?"],
    content: `## ねらい

早口で言えることが目的ではなく、**遅い速度でも一音一音がクリアに聞こえる**発音を作る。

## 手順

### 1. 顔と口の準備運動 (2分)

- 顔全体をくしゃっと寄せる → パッと大きく開く × 5
- 舌を上下左右にゆっくり回す × 3周ずつ
- 唇を「プルルル」と震わせる (リップロール) × 10秒

### 2. 五十音 (3分)

「ア エ イ ウ エ オ ア オ」を一音ずつ、口の形を大きく作りながら。
カ行、サ行…と続けて、全50音。

### 3. 定番早口言葉 (8分)

以下を **①ゆっくり明瞭に3回 → ②普通速度で3回 → ③早口で1回** の順で。

- 生麦生米生卵
- 東京特許許可局
- 隣の客はよく柿食う客だ
- バスガス爆発
- 赤巻紙青巻紙黄巻紙
- この寿司は少し酢が過ぎるよ小僧
- 蛙ぴょこぴょこ三ぴょこぴょこ、合わせてぴょこぴょこ六ぴょこぴょこ

### 4. 課題文 (2分)

自分の苦手音を含む短文を1つ選び、10回繰り返す。`,
  },
  {
    slug: "vowel-strengthening",
    categorySlug: "voice-training",
    title: "母音強化 (アエイウエオアオ)",
    summary:
      "日本語の音の芯は母音にある。母音を明瞭に発音するだけでセリフの通りが劇的に変わる基礎トレ。",
    duration: 10,
    minPeople: 1,
    maxPeople: 30,
    difficulty: 2,
    tags: ["発声", "母音", "基礎"],
    learningObjectives: ["母音の口形を身体化", "セリフの母音抽出で通りを良くする"],
    ageGroup: "中学生〜大人",
    materials: ["鏡 (あれば)"],
    spaceRequirement: "特に不要",
    hasPhysicalContact: false,
    sideCoaching: "「口の形は大きく」「指2本入る?」",
    reflectionQuestions: ["普段どの母音の口形が甘い?", "母音抽出で読んだ後のセリフはどう変わった?"],
    content: `## ねらい

日本語の話し言葉は子音より母音が耳に残る。母音の口形が甘いと、どれだけ声を張っても客席に届かない。

## 手順

### 1. 口形の確認

鏡の前で、下の口の形を大きく作る。

| 音 | 口の形 |
|----|--------|
| ア | 縦に大きく開く。指2本入る |
| エ | 横に引く。歯が少し見える |
| イ | 横に狭く。前歯の隙間から声 |
| ウ | 唇を突き出す。「ロウソクを吹く」形 |
| オ | 縦の楕円。顎を落とす |

### 2. 単音ロング (2分)

「アーーーー」で10秒ずつ。声量は普通で、音の粒がブレないように。

### 3. 母音の連続 (3分)

「アエイウエオアオ」を、一音ずつ大きな口形で発音。慣れたら早く。

### 4. セリフの母音抽出 (5分)

好きなセリフを1文選び、母音だけ抜き出して発音する。

例:
- 元: 「今日はいい天気ですね」
- 母音: 「オーオアイイエイイエウエ」

これを大きく明瞭に発音してから、元のセリフに戻す。**セリフの通りが激変する**。`,
  },
  {
    slug: "resonance-humming",
    categorySlug: "voice-training",
    title: "共鳴・ハミング",
    summary:
      "「ンー」のハミングで頭・胸・腹の共鳴腔を意識的に鳴らす練習。声の芯と響きを作る中級トレ。",
    duration: 10,
    minPeople: 1,
    maxPeople: 30,
    difficulty: 3,
    tags: ["発声", "共鳴", "中級"],
    learningObjectives: ["共鳴腔の使い分け", "声に厚みと響きを乗せる"],
    ageGroup: "高校生〜大人",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「今、どこが震えてる?」「そのポジションを覚えて」",
    reflectionQuestions: ["3つの共鳴のどれが自分は得意?", "普段使っている共鳴は?"],
    content: `## ねらい

- 頭部・胸部・腹部の共鳴を意識して鳴らし分ける
- 声質の幅を広げる (甲高い声・重い声・押しの効いた声)

## 手順

### 1. ハミング基礎 (3分)

1. 口を軽く閉じ「ンー」と鼻から声を出す
2. 唇が震える位置を探す (=マスクレゾナンス、鼻腔共鳴)
3. 10秒キープ × 5回

### 2. 3ポジション (5分)

同じピッチのまま、共鳴位置を移動させる。

- **頭声**: 頭のてっぺんに響かせる。両手でてっぺんを触りながら
- **胸声**: 胸に手を当てて、そこを震わせる
- **腹声**: お腹に手を当て、腹の奥から響かせる

各10秒ずつ、順に移す。

### 3. セリフに乗せる (2分)

「あーあー、あいうえお」を各ポジションで発音してみる。声質の違いを感じる。

## 応用

- キャラクター別発声: 老人=胸声、赤ん坊=頭声、悪役=腹声、など役柄別に使い分け
- 長時間発声の疲労軽減: 疲れたら別の共鳴に切り替える`,
  },

  // ============ 集中・信頼 ============
  {
    slug: "trust-fall",
    categorySlug: "focus-trust",
    title: "トラストフォール (信頼して倒れる)",
    summary:
      "2人1組で、1人が目を閉じて後ろに倒れ、もう1人が受け止める。信頼関係を身体で作る古典的エクササイズ。",
    duration: 15,
    minPeople: 2,
    maxPeople: 40,
    difficulty: 2,
    tags: ["信頼", "身体", "2人組", "定番"],
    learningObjectives: ["身体的信頼の構築", "受け止める側の集中と責任", "恐怖の克服"],
    ageGroup: "中学生〜大人 (身長差に注意)",
    materials: [],
    spaceRequirement: "1組あたり縦2m×横1m",
    hasPhysicalContact: true,
    sideCoaching: "「膝を伸ばしたまま」「必ず受け止める、目を離さない」「無理な人はスキップOK」",
    reflectionQuestions: ["倒れる側で怖かった瞬間は?", "受ける側の責任の重さは?"],
    content: `## ⚠️ 安全上の注意

- **身長・体重差が極端な組は避ける**
- 床は必ず衝撃吸収できる環境で (マットが理想、体育館の板でも可)
- 怖い人はスキップOK。**強制しない**
- 受ける側が集中できないと事故につながる。私語厳禁

## 手順

### 1. ペアリング (2分)

近い身長・体重の2人で組む。**A(倒れる) / B(受ける)** を決める。

### 2. 準備 (3分)

1. Aは前を向いて立つ。膝を伸ばし、身体を板のように固く保つ
2. Bは Aの真後ろに立ち、両手を Aの背中(肩甲骨下)にかざす
3. まずは軽い揺れで感覚を掴む: Aが体を後ろに預ける → Bが押し戻す × 5回

### 3. 本番 (5分)

1. Aが目を閉じる
2. Bが「準備できました」と声をかける
3. Aが「行きます」→ ゆっくり後ろに倒れる
4. Bが肩甲骨の下を確実に受け止める
5. Bが Aを戻す
6. 3回繰り返して交代

### 4. 発展 (5分)

慣れたら距離を少し離す (最大50cm)。**それ以上は上級者向け**。

## 振り返り

- 恐怖と信頼の関係
- 集中していない受け手がいたら、身体は感じ取る
- 舞台上のパートナーへの信頼にも通じる`,
  },
  {
    slug: "one-two-three-clap",
    categorySlug: "focus-trust",
    title: "1・2・3 手拍子",
    summary:
      "3人1組で「1・2・3」を1つずつ交代で言う。慣れたら数字を手拍子・足踏み・声に置き換えていく脳トレ集中エクササイズ。",
    duration: 10,
    minPeople: 3,
    maxPeople: 30,
    difficulty: 2,
    tags: ["集中", "3人組", "認知", "定番"],
    aliases: ["Count to Three"],
    learningObjectives: ["集中力の持続", "認知の切り替え速度", "パートナーとの合図"],
    ageGroup: "中学生〜大人",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「間違えたら笑ってやり直し!」「テンポキープ」",
    reflectionQuestions: ["いつミスした?", "頭で考えるのと身体でやるのの切り替えはどう?"],
    content: `## 手順

### レベル1: 数字だけ (2分)

3人で三角形に立ち、A→B→C→A→…と順番に「1・2・3・1・2・3…」を1つずつ交代で発音。テンポを一定に。

### レベル2: 1→手拍子 (3分)

「1」の位置に来た人は数字を言わず、**手拍子1回** する。
- A: (手拍子) / B: 「2」 / C: 「3」 / A: (手拍子) …

### レベル3: 2→足踏み

「1」を手拍子、「2」を足踏みに。
- A: (手拍子) / B: (足踏み) / C: 「3」 / A: (手拍子) …

### レベル4: 3→ジャンプ

「1」手拍子・「2」足踏み・「3」ジャンプ。全部無言。

## 進行のコツ

- テンポキープが命。1人が乱れると崩壊
- ミスは笑いに変える。責めない
- 3人組で全員できたら、円全体で「1・2・3」を1人ずつ回す拡大版も`,
  },
  {
    slug: "counting-together",
    categorySlug: "focus-trust",
    title: "アンサンブルカウント (集団で20まで)",
    summary:
      "円になって全員で1〜20を数えるが、順番は決めない。2人が同時に発音したら1からやり直し。集団の空気を読む力を鍛える。",
    duration: 10,
    minPeople: 5,
    maxPeople: 20,
    difficulty: 3,
    tags: ["集中", "アンサンブル", "沈黙"],
    aliases: ["Count to 20"],
    learningObjectives: ["集団の空気を読む", "沈黙の共有", "無言のアイコンタクト"],
    ageGroup: "中学生〜大人",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「アイコンタクト禁止」「焦って言うな」「沈黙も楽しむ」",
    reflectionQuestions: ["何が分かれば同時発言を防げた?", "20到達時の感覚は?"],
    content: `## ルール

1. 全員で円になり、目を閉じる (または下を向く)
2. **アイコンタクトや合図なしで**、誰かが「1」と言う
3. 別の誰かが「2」と言う
4. **2人以上が同時に発音したら1からやり直し**
5. 20まで到達できたら成功

## 進行のコツ

- 焦って口を開くと必ず被る。**間を怖がらない**
- 「言おうかな」で止める勇気
- 慣れてくると、集団の呼吸で「次は自分」が分かる瞬間が来る

## バリエーション

- **50まで**: 難易度アップ
- **アルファベット**: 数字ではなく A-Z
- **単語つなぎ**: 前の人の最後の音で始まる単語をリレー`,
  },

  // ============ ムーブメント ============
  {
    slug: "mirror-exercise",
    categorySlug: "movement",
    title: "ミラーエクササイズ (鏡)",
    summary:
      "2人1組で片方の動きをもう片方が鏡のように真似る。集中と相互観察の力を養う古典的エクササイズ。",
    duration: 10,
    minPeople: 2,
    maxPeople: 40,
    difficulty: 1,
    tags: ["2人組", "集中", "身体", "基礎"],
    learningObjectives: ["相手を見る力", "主導/追従の切り替え", "同期の感覚"],
    ageGroup: "小学生〜大人",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「相手を見るのではなく、輪郭全体をぼんやり見る」「足元まで真似する」",
    reflectionQuestions: ["リーダーレスの時、どちらが本当のリーダーだった?", "見られる側と見る側でどちらが疲れた?"],
    credit: "Viola Spolin, Improvisation for the Theater",
    content: `## 手順

### フェーズ1: リーダー固定 (3分)

- Aがゆっくり動く。Bは鏡のように同じ動きをする
- 動きは連続的に。**急な動きは禁止**
- 2分経ったら役割交代

### フェーズ2: リーダーレス (3分)

- リーダーを決めない
- どちらも「自分は追従している」と感じる速度で動く
- 観客からはどちらがリーダーか分からない状態が理想

### フェーズ3: 感情を乗せる (3分)

- ゆっくり動くだけでなく、表情・感情を伴った動きに
- 「不安」「怒り」「愛おしさ」など指定`,
  },
  {
    slug: "viewpoints-tempo",
    categorySlug: "movement",
    title: "ビューポインツ・テンポワーク",
    summary:
      "アン・ボガートのビューポインツ理論から「テンポ」に絞ったエクササイズ。8段階の速度を集団で共有し、切り替える。",
    duration: 20,
    minPeople: 5,
    maxPeople: 20,
    difficulty: 3,
    tags: ["身体", "ビューポインツ", "アンサンブル", "上級"],
    learningObjectives: ["テンポの身体化", "集団のアンサンブル感覚", "現代身体演技法の基礎"],
    ageGroup: "高校生〜大人",
    materials: [],
    spaceRequirement: "10畳以上の広いスペース",
    hasPhysicalContact: false,
    credit: "Anne Bogart / Tina Landau, The Viewpoints Book",
    sideCoaching: "「テンポを選び直せ」「集団の中の自分の速度を意識」",
    reflectionQuestions: ["集団のテンポと自分のテンポのズレは?", "変化のきっかけは何?"],
    content: `## ビューポインツとは

アン・ボガートが体系化した、身体的な即興と作品創作のための9つの視点(Viewpoint)。うち一つ「テンポ」を扱う。

## 手順

### 1. 8段階テンポの説明 (2分)

- **1**: 静止 (完全停止)
- **2**: 気配だけの動き
- **3**: とてもゆっくり
- **4**: 遅い散歩
- **5**: 普通の歩行
- **6**: 早歩き
- **7**: 走る
- **8**: 全速力

### 2. 全員で同じテンポ (5分)

- 空間を歩く
- リーダーが数字をコール、全員がそのテンポに
- 5分間で 1〜8 をランダムにコール

### 3. 個人が選ぶ (5分)

- 各人が自分の判断で1〜8のどれかを選んで動く
- 誰かの動きに反応してテンポを変えるのはOK
- **他人と揃えることも、対比することも意識的に選ぶ**

### 4. 停止と再開 (5分)

- 集団の誰かが1(静止)を選ぶと、周囲もつられて1になる可能性
- 空間全体の「呼吸」を感じる

## 振り返り

観客役 (交代制) を置き、外から見た「集団の質感」を共有する。`,
  },
  {
    slug: "space-shapes",
    categorySlug: "movement",
    title: "空間の形 (シェイプ&ホールド)",
    summary:
      "音楽が止まったら、指定された「形」に瞬時になる集団身体表現。抽象的な語 (森・怒り・機械) をどう身体で表すか。",
    duration: 15,
    minPeople: 6,
    maxPeople: 30,
    difficulty: 2,
    tags: ["身体", "抽象", "集団", "創作"],
    learningObjectives: ["身体で抽象を表現する", "集団彫刻の構成感", "空間の高低・広がりの活用"],
    ageGroup: "小学生〜大人",
    materials: ["音楽 (BGM)"],
    spaceRequirement: "10畳以上",
    hasPhysicalContact: true,
    sideCoaching: "「高い・中間・低いの3層を作れ」「触れ合いを恐れるな」",
    reflectionQuestions: ["自分は集団の中で高・中・低のどこにいた?", "他の人の形はどう補完し合った?"],
    content: `## 手順

1. 音楽をかけて全員が空間を自由に歩く
2. リーダーが指示語を叫んで音楽を止める (例: 「森!」)
3. 全員が **5秒以内に**、他の全員と協力して「森」の集団形になる
4. 10秒キープしてから解散

## 指示語の例

**具体物**
- 森 / 都会 / 海 / 電車 / 教室

**感情**
- 怒り / 悲しみ / 静けさ / 混乱

**抽象**
- 時間 / 記憶 / 未来 / 呼吸

## 進行のコツ

- **高低差**を作る (立つ・座る・寝る・持ち上げる)
- **1人だけ違う要素**が入ると絵になる
- 完璧を目指さず、5秒で決断する練習
- 身体接触は同意ベース、無理な人はスキップOK

## 発展

- 3秒キープを 15秒→30秒 に伸ばす (身体的持久)
- 動きも含めた「動く彫刻」に
- 音を出しながらの形 (呼吸・声)`,
  },

  // ============ インプロ短形式 ============
  {
    slug: "zip-zap-zop",
    categorySlug: "improv-short",
    title: "Zip Zap Zop (ジップザップゾップ)",
    summary:
      "海外の演劇学校でも定番の集中力・反応力アップのウォームアップゲーム。5分でできて盛り上がる。",
    duration: 5,
    minPeople: 6,
    maxPeople: 30,
    difficulty: 1,
    tags: ["ウォームアップ", "集中", "定番", "初心者"],
    learningObjectives: ["アイコンタクト", "反応速度", "集団の緊張ほぐし"],
    ageGroup: "小学生〜大人",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「相手の目を見る!」「テンポキープ!」",
    reflectionQuestions: ["詰まった瞬間、何を考えていた?"],
    content: `## ルール

1. 全員で円になる
2. 誰か一人が別の人を指差し、目を合わせて **「ZIP!」** と言う
3. 指された人は別の人に **「ZAP!」**
4. 次の人は **「ZOP!」**
5. その次は再び「ZIP!」に戻り、無限ループ
6. 順番は ZIP → ZAP → ZOP → ZIP → ZAP → ZOP…
7. 詰まった / 順番を間違えた人が抜ける
8. 最後の2人が勝ち

## バリエーション

- **リバース**: 「ZIP-REVERSE!」で流れが逆回転
- **BOING**: 「BOING!」でパス拒否
- **早口モード**: 制限時間つき`,
  },
  {
    slug: "yes-and",
    categorySlug: "improv-short",
    title: "Yes, And (イエス・アンド)",
    summary:
      "即興演劇の最重要原則を体感するゲーム。相手の提案を否定せず受け入れ、必ず何かを足す。",
    duration: 15,
    minPeople: 2,
    maxPeople: 20,
    difficulty: 2,
    tags: ["即興", "コミュニケーション", "基礎", "定番"],
    aliases: ["Yes And", "Accept and Build"],
    learningObjectives: ["肯定して足す", "拒絶がシーンを殺す実感", "共同構築の感覚"],
    ageGroup: "中学生〜大人",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「Yes, And を口に出さなくていい、態度で示せ」「情報の足し過ぎ注意」",
    reflectionQuestions: ["Noの時とYes, Andの時、どちらが疲れた?", "現実の会話でどれくらいNoを使っている?"],
    credit: "Del Close / Second City の即興哲学",
    content: `## ルール

### ラウンド1: No (悪い例) (3分)

- 2人1組で自由なシチュエーションを設定
- 何を提案されても **「いや、違う」「そうじゃない」** と否定する
- 3分後、どんな気分だったかを共有

### ラウンド2: Yes, But (中途半端) (3分)

- 相手の提案を認めるが「でも」で反対の意見をぶつける
- ラウンド1よりマシだが、話は前に進まない

### ラウンド3: Yes, And (正解) (5分)

- 提案を受け入れ、必ず**新しい情報を1つ加えて**返す
- 例:
  - A「ここは砂漠だね」
  - B「そうだね、しかも足元にオアシスが見えるよ」
  - A「そうだ、ラクダにも乗ってきたし飲み物もあるよ」

## バリエーション

- **3人版**: 3人でリレー式に足していく
- **ジャンル固定**: 「SF」「時代劇」「ホラー」など縛って積み上げる
- **物語版**: 「昔々」から始めて Yes, And だけで完結する物語を作る`,
  },
  {
    slug: "one-word-story",
    categorySlug: "improv-short",
    title: "ワンワードストーリー",
    summary:
      "全員で円になり、1人1単語ずつ順に足して即興で物語を作る。急速に脱線するが、それが楽しい定番ゲーム。",
    duration: 10,
    minPeople: 4,
    maxPeople: 15,
    difficulty: 2,
    tags: ["即興", "物語", "円形"],
    aliases: ["Word at a Time Story"],
    learningObjectives: ["瞬発力", "物語構造の感覚", "他人のアイデアに乗る"],
    ageGroup: "小学生〜大人",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「文法にこだわりすぎない」「詰まったら助詞でつなげ」",
    reflectionQuestions: ["物語はどこで転がった?", "自分が言った1単語で流れが変わった瞬間はある?"],
    content: `## ルール

1. 全員で円になる
2. 誰か1人が「昔々」で始める
3. 隣の人が次の1単語を足す
4. 円をぐるぐる回して物語を紡ぐ
5. 誰かが「おしまい」と言ったら終了

## 例

A「昔々」→ B「ある」→ C「ところに」→ D「巨大な」→ E「たこ焼きが」→ F「住んで」→ G「いました」→ …

## 進行のコツ

- 完璧な話を作ろうとしない
- 詰まった時は「そして」「しかし」「その」など汎用語で繋ぐ
- **同じ人が「おしまい」を言い続けない** (話が終わらないので)

## バリエーション

- **1文ずつ**: 1単語ではなく1文単位で
- **ジャンル指定**: ホラー / 恋愛 / SF などの縛り
- **タイトル先決め**: 「銀河の煮物」など変なタイトルを決めて逆算`,
  },
  {
    slug: "one-word-scene",
    categorySlug: "improv-short",
    title: "『ワンワードシーン』— 一語だけで会話",
    summary:
      "各人が一度に言えるのは1単語だけ。制約が集中と反応を鋭くする、短時間で試せる。",
    duration: 10,
    minPeople: 2,
    maxPeople: 4,
    difficulty: 2,
    tags: ["制約", "短時間", "反応"],
    learningObjectives: ["聞く姿勢", "一語の情報量を扱う", "話しすぎ癖の矯正"],
    ageGroup: "中学生〜大人",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「言うより聞け」「間を怖がるな」",
    reflectionQuestions: ["どの1単語が一番効いた?", "普段のセリフに無駄はある?"],
    content: `## お題

**シチュエーションと関係性を1つ設定し、そのシーンを演じる。ただし各人が発する言葉は「1回に1単語」だけ。**

## 例

- 舞台: 深夜のコンビニ / 関係: 元恋人
- 舞台: 病院の待合室 / 関係: 医師と患者の家族
- 舞台: 電車 / 関係: 見知らぬ他人

## ルール

- 一度に発音できるのは1単語のみ
- 沈黙はOK
- 動作・目線・表情は自由
- 制限時間 5分

## バリエーション

- **1音縛り**: 「あ」だけで会話
- **5単語制限**: シーン全体で使える単語を5個だけ事前に決めておく`,
  },

  // ============ インプロ長形式 ============
  {
    slug: "harold",
    categorySlug: "improv-long",
    title: "The Harold (ハロルド)",
    summary:
      "Del Close が生み出したインプロ長形式の元祖。3シーン×3ラウンド構造で30分の劇を即興で作る本格フォーマット。",
    duration: 45,
    minPeople: 5,
    maxPeople: 8,
    difficulty: 5,
    tags: ["長形式", "上級", "本格", "構成"],
    learningObjectives: ["長形式即興の構造理解", "シーン間の主題連鎖", "コラボ即興の上級技法"],
    ageGroup: "経験者向け",
    materials: ["観客からのお題1つ"],
    hasPhysicalContact: false,
    credit: "Del Close (iO Chicago)",
    sourceUrl: "https://improvencyclopedia.org/formats/Harold.html",
    sideCoaching: "「主題は変えるな、状況は変えろ」",
    reflectionQuestions: ["3シーン間の共通主題は何だった?", "リンクはどこで生まれた?"],
    content: `## Harold の構造

観客から1単語のお題をもらい、以下の構造で即興劇を組み立てる。

\`\`\`
Opening: お題からの連想 (2-3分)
Beat 1:
  Scene A / Scene B / Scene C (各2-3分, 別のシーン)
Group Game (2-3分, 集団遊び)
Beat 2:
  Scene A' / Scene B' / Scene C' (Beat 1のシーンの続き)
Group Game
Beat 3:
  Scene A'' / Scene B'' / Scene C'' (3つのシーンが交差・統合)
\`\`\`

## 各要素

### Opening

お題「宇宙」→ 全員で連想を口々に発する: 「暗い」「無音」「孤独」「無限」…
そこから象徴的な集団の身体表現(Movement Opening)や、一人語り(Monologue Opening)を作る。

### 3つのシーン

Opening から想起されるテーマを、まったく別のシチュエーション3つで並行して展開する。
例: 「孤独」というテーマなら
- Scene A: 独居老人と訪問看護師
- Scene B: 単身赴任のサラリーマンと出前の店員
- Scene C: 火星の宇宙飛行士と地球のオペレーター

### Group Game

シーン間の休憩兼スパイス。ラップ、コーラス、集団合唱など。

### 3ラウンドの積み上げ

- Beat 1: 主題の提示
- Beat 2: 主題の掘り下げ・逆転
- Beat 3: 3つのシーンが同じ空間で交差する (時制と場所の破壊)

## 進行のコツ

- 30分以上のフォーマットなので、**経験者チームで練習** する
- 「主題」は明示的に語らず、観客に感じ取らせる
- 演出役(director) が外から手拍子でシーン切替を合図するのが伝統的

## 参考

- Del Close & Charna Halpern, *Truth in Comedy* (Harold のバイブル)`,
  },
  {
    slug: "montage",
    categorySlug: "improv-long",
    title: "Montage (モンタージュ)",
    summary:
      "Harold より簡潔で敷居の低い長形式。1つのテーマから連想される複数の独立シーンを積み重ねる、入門的長形式。",
    duration: 30,
    minPeople: 4,
    maxPeople: 6,
    difficulty: 3,
    tags: ["長形式", "中級", "入門"],
    learningObjectives: ["長形式の入り口", "テーマの解釈", "シーン切替の合図"],
    ageGroup: "中級以上",
    materials: ["観客からのお題1つ"],
    hasPhysicalContact: false,
    sideCoaching: "「シーンは短くていい、テーマの多面性を見せろ」",
    reflectionQuestions: ["各シーンはお題とどう関係していた?", "観客は主題を掴めたか?"],
    content: `## Montage の構造

お題1つから、テーマを解釈した独立シーンを連続して見せる。ハロルドの Beat 1 だけを長時間展開するイメージ。

\`\`\`
Opening: お題への短い反応 (1-2分)
Scene 1 → Scene 2 → Scene 3 → … (各2-4分)
Ending: 最初のシーンや Opening への回帰
\`\`\`

## 手順

### 1. お題の提示

観客から1単語 (例: 「鍵」)

### 2. 連想 (Opening)

全員で「鍵」から連想する言葉、状況、感情を口々に発する。

### 3. シーン開始

誰かが1つのシーンを始める:
- Scene 1: 家の鍵をなくした夫婦
- Scene 2: 心の鍵を握られた心理カウンセラー
- Scene 3: ホテルの鍵の受け渡しで気まずい2人

### 4. シーン切替

- 演出役が手拍子、または舞台上のプレイヤーが割って入る (エディット)
- 前のシーンの最後の言葉やモチーフを次のシーンが引き継ぐと美しい

### 5. エンディング

30分の頃合いで、最初のシーンや Opening のイメージに戻して収束させる。

## Harold との違い

- **Harold**: 3シーン×3ラウンドで主題を掘り下げる
- **Montage**: シーン数無制限、独立性が高い

初めての長形式練習には Montage が扱いやすい。`,
  },

  // ============ エチュード ============
  {
    slug: "waiting-room",
    categorySlug: "etude",
    title: "『待合室』— 沈黙の共有",
    summary:
      "何かを待つ複数の人。セリフを禁じ、身体と目線だけで関係性と時間の経過を作る、集中と観察のエチュード。",
    duration: 20,
    minPeople: 3,
    maxPeople: 8,
    difficulty: 3,
    tags: ["沈黙", "集中", "関係性", "初中級"],
    learningObjectives: ["非言語表現の力", "設定を身体で伝える", "沈黙の使い方"],
    ageGroup: "高校生〜大人",
    materials: ["椅子数脚"],
    spaceRequirement: "椅子を並べられる程度",
    hasPhysicalContact: false,
    sideCoaching: "「相手を見ろ、ではなく、相手が今何を考えているか推測しろ」",
    reflectionQuestions: ["観客が推測した『待つ理由』と、あなたの設定は一致した?", "なぜズレた?"],
    content: `## お題

**「同じ場所で何かを待っている複数の人物」。セリフは禁止。**

## セッティング

- 椅子を数脚、ランダムに配置
- 時間: 3〜5分
- 観客(他の受講者)は円形に囲む

## 事前準備 (5分)

各人でこっそり以下を決める。他人には言わない。

1. **何を待っているか** (診察・面接・遅刻している家族・裁判の判決 など)
2. **その日どうしても叶えたいこと** (一言で)
3. **他の人に対する第一印象** (味方 / 敵 / 気になる 等)

## ルール

- セリフ禁止 (咳・ため息・笑いなど非言語音はOK)
- 立ち上がる・座る・移動するは自由
- 他人を触るのは1回まで
- 携帯・小道具は原則使わない

## 展開バリエーション

- **中盤で異物投入**: 講師が突然「誰かの携帯が鳴る」と指示 → 反応の変化を見る
- **1人だけ設定共有**: 事前に1名だけ「実は他の全員を騙している」設定を渡す
- **時代設定**: 江戸時代の関所、近未来のクリニック等、時代を変える`,
  },
  {
    slug: "unexpected-visitor",
    categorySlug: "etude",
    title: "『予期せぬ訪問者』— 2人芝居",
    summary:
      "自宅に、来るはずのない人物が訪ねてくる。関係性・過去・目的の3層を即興で構築する2人組エチュード。",
    duration: 15,
    minPeople: 2,
    maxPeople: 2,
    difficulty: 3,
    tags: ["2人", "関係性", "会話"],
    learningObjectives: ["過去を身体で語る", "秘密の扱い方", "反応の即興"],
    ageGroup: "高校生〜大人",
    materials: ["椅子/机 (最小限)"],
    hasPhysicalContact: false,
    sideCoaching: "「実は…で秘密を明かすのは1回だけ、安売りするな」「相手の言葉を1文字も聞き逃すな」",
    reflectionQuestions: ["過去の情報をセリフ以外でどこまで伝えられた?", "一番効いた沈黙は?"],
    content: `## お題

**Aは自宅で普段通りに過ごしている。そこにBが訪ねてくる。二人はかつて深い関係だったが、5年間会っていない。**

## 事前設定 (Aだけ / Bだけ 個別に決める)

### Aが決めること
- 自分の現在の生活状況 (仕事・同居人・悩み)
- 5年前、Bとの間に起きた「あの出来事」

### Bが決めること
- なぜ今日訪ねてきたのか (謝罪 / 頼みごと / 再確認 / 報告)
- ドアの前で最後に発した言葉 (心の中で)

**互いの設定は開始まで共有しない。** ズレは即興で処理する。

## 進行

1. Aは椅子で作業しているところから始める
2. Bがドアを叩く → Aが開ける、から時間開始
3. 制限時間 8分
4. 一度でも「さよなら」と言った時点で終了

## 展開バリエーション

- **サイレント縛り**: 冒頭2分はセリフ禁止
- **Cを追加**: 3分後にもう1人予告なく登場させる
- **時系列反転**: 「別れた瞬間」→「会うのを避けていた3年目」→「今日」の3シーンを短く演じる`,
  },
  {
    slug: "secret-conflict",
    categorySlug: "etude",
    title: "『秘密の対立』— 感情の応酬",
    summary:
      "2人が別々の秘密を抱えて話し合う。相手の秘密は知らず、自分の秘密は明かせない状況で、感情の応酬を作るエチュード。",
    duration: 20,
    minPeople: 2,
    maxPeople: 2,
    difficulty: 4,
    tags: ["2人", "感情", "秘密", "対立"],
    learningObjectives: ["サブテキスト(潜在意識)", "感情の応酬", "明かさない演技"],
    ageGroup: "経験者向け",
    materials: [],
    hasPhysicalContact: false,
    sideCoaching: "「秘密は最後まで明かさない」「本音は身体に出せ」",
    reflectionQuestions: ["観客は2人の秘密のどこまで感じ取った?", "隠す努力と隠れない身体のバランスは?"],
    content: `## お題

2人は共通の場を持つ (夫婦・上司部下・親子・同僚)。それぞれ**相手には言えない秘密**を持っている。互いの秘密は知らない。

## 事前設定 (個別に決める)

A: 「私の秘密は _____ 」(相手に絶対言えないこと)
B: 「私の秘密は _____ 」(相手に絶対言えないこと)

例:
- A: 明日から失踪しようと計画している
- B: 相手の携帯を勝手に見て、浮気を確信した

## ルール

- 制限時間 10分
- **秘密を直接口に出してはいけない**
- 相手が秘密に気づきそうな瞬間、反応する
- 演技は「秘密を隠しながら、それでも本音が漏れる」バランス

## 進行のコツ

- 秘密を「守ろうとする」演技は分かりやすい。**それより秘密の重さで疲れている**演技の方が観客に伝わる
- サブテキスト(潜在意識)の訓練
- 20分の場合、5分ずつ設定を変えて2セット行うと差分学習になる`,
  },

  // ============ デバイジング ============
  {
    slug: "devising-fragments",
    categorySlug: "devising",
    title: "断片から作る (フラグメント・デバイジング)",
    summary:
      "参加者が持ち寄った短い言葉・思い出・写真から共同で短編を作り上げる、集団創作の入門手法。",
    duration: 90,
    minPeople: 4,
    maxPeople: 12,
    difficulty: 3,
    tags: ["集団創作", "作品作り", "テキスト", "写真"],
    learningObjectives: ["デバイジングの基本フロー", "個人の素材を集団作品に転化", "編集の判断力"],
    ageGroup: "高校生〜大人",
    materials: ["参加者が持参する断片(1人3つ)", "ホワイトボード", "付箋"],
    spaceRequirement: "話し合いと動きの両方ができる広さ",
    hasPhysicalContact: false,
    sideCoaching: "「良し悪しで判断せず、面白いかどうかで残せ」",
    reflectionQuestions: ["自分の断片はどう変化した?", "編集で切ったものに未練は?"],
    content: `## デバイジングとは

台本のない状態から、集団で作品を作り上げる創作手法。イギリスを中心に発達し、
コンプリシテ (Complicité)、DV8 などが有名。

## 事前準備

参加者は以下を各1つずつ持参:
- 短い言葉 (1文以内、記憶・詩・広告・見聞など何でも)
- 忘れられない情景/思い出 (30秒で語れる長さ)
- 手のひらサイズの物(写真・小物・カード)

## 進行 (90分)

### フェーズ1: 共有 (30分)

- 円になって、順に自分の3つを共有
- 他人は評価せず、印象に残ったものにメモ

### フェーズ2: マッピング (15分)

- ホワイトボードに全ての断片を書き出す
- 共通するテーマ、対立する要素、繰り返される単語を線でつなぐ

### フェーズ3: 選抜 (15分)

- 全員で「これを軸にしたい」5〜7個を投票で選ぶ

### フェーズ4: 構成 (15分)

- 選んだ断片をどう並べるか
- 各断片を「シーン」「モノローグ」「集団身体」など形式に振る

### フェーズ5: 立ち上げ (15分)

- 各シーンを即興で立ち上げる
- 完成度より仮組み優先

## 完成後の使い方

- そのまま短編作品として発表
- 台本化して他のキャストで再演
- 稽古の素材として保存 (映像記録推奨)`,
  },
  {
    slug: "chorus-work",
    categorySlug: "devising",
    title: "コーラス・ワーク (集団身体語り)",
    summary:
      "1つのテキスト(詩・散文・ニュース)を集団で朗誦・身体化する。ギリシャ演劇的コーラスと現代身体演技の融合手法。",
    duration: 60,
    minPeople: 6,
    maxPeople: 20,
    difficulty: 4,
    tags: ["集団", "テキスト", "身体", "朗誦"],
    learningObjectives: ["集団の一体感", "テキストの解釈", "身体と声の同期"],
    ageGroup: "経験者向け",
    materials: ["テキスト1つ(A4半分程度)", "音楽 (任意)"],
    spaceRequirement: "10畳以上",
    hasPhysicalContact: true,
    sideCoaching: "「息を揃えろ、心を揃えるな」「1人の声が全員の声」",
    reflectionQuestions: ["集団の中で自分の役割は?", "揃うことと揃わないことのどちらが強かった?"],
    content: `## 使うテキスト例

- 詩 (谷川俊太郎、金子みすゞなど短めのもの)
- 憲法前文
- ニュース記事の一節
- 手紙、日記の断片

## 手順

### 1. 個別解読 (10分)

各人が黙読し、印象に残った1行・1単語をチェック。

### 2. 群読 (10分)

- 全員で1回、揃えて朗誦
- 揃えられないところ、感情が乗る単語を確認

### 3. 声のバリエーション (15分)

同じテキストを:
- ささやきで
- 叫びで
- 一人ずつ順に (エコー)
- 全員バラバラのタイミングで
- 特定の単語だけ強調

### 4. 身体化 (15分)

- テキストに合う集団身体を作る
- 立つ位置、動きの方向、高低差
- 声と身体を同期させる or ずらす

### 5. 統合 (10分)

- 声・身体・空間・テンポを組み合わせて2-3分の作品として仕上げる`,
  },

  // ============ メソッド解説 ============
  {
    slug: "stanislavski-magic-if",
    categorySlug: "method",
    title: "スタニスラフスキー『マジック・イフ』",
    summary:
      "「もし自分がこの状況に置かれたら?」という問いから役に入るスタニスラフスキー・システムの根本。エクササイズ付き。",
    duration: 30,
    minPeople: 1,
    maxPeople: 20,
    difficulty: 3,
    tags: ["メソッド", "スタニスラフスキー", "解説", "リアリズム"],
    learningObjectives: ["Magic If の理解", "役の目的(タスク)の設定", "内的アクションの構築"],
    ageGroup: "高校生〜大人",
    materials: ["ノートとペン"],
    hasPhysicalContact: false,
    credit: "Konstantin Stanislavski, An Actor Prepares",
    sourceUrl: "https://en.wikipedia.org/wiki/Stanislavski%27s_system",
    sideCoaching: "「もし本当に、を毎回問い直せ」",
    reflectionQuestions: ["Magic Ifで役の何が変わった?", "『タスク』は具体的に言語化できた?"],
    content: `## Magic If (魔法のもしも) とは

コンスタンチン・スタニスラフスキーが確立した俳優訓練システムの中心概念。

**「もし自分がこの状況に置かれたら、どう感じ、どう行動するか?」**

役を「演じる」のではなく、役の状況を自分の想像力で埋め、自然な反応を引き出す。

## エクササイズ

### 1. 日常の Magic If (10分)

各人1つ設定を選ぶ:
- もし自分が余命1週間の医師だったら、この稽古場に来る朝は?
- もし自分が失業した父親だったら、朝の食卓は?
- もし自分がスパイだったら、電車に乗る時は?

**5分間、その設定で稽古場に来る朝の身支度を演じる** (無言、動きのみ)

### 2. タスクの設定 (10分)

役に「明確な目的(タスク)」を与える。動詞形で書く。
- 悪い例: 「悲しい」「怒っている」(状態は動作にならない)
- 良い例: 「相手を許させる」「秘密を守り抜く」「相手の弱みを引き出す」

短いシーン (3分) を、明確なタスクを設定して2人で演じる。

### 3. 単位分割 (10分)

シーンをタスクの変化で「単位」に区切る。
- 単位1: 相手を安心させる (0-1分)
- 単位2: 本題に持ち込む (1-2分)
- 単位3: 拒否されて逆上する (2-3分)

## 参考文献

- スタニスラフスキー『俳優修業』
- 鈴木忠志『演劇とは何か』(比較で読むと違いが分かる)`,
  },
  {
    slug: "meisner-repetition",
    categorySlug: "method",
    title: "マイズナー『リピティション』",
    summary:
      "「相手の言葉を繰り返す」だけの2人組エクササイズ。頭で考えず、相手の変化にリアルタイムに反応するマイズナー・テクニックの入口。",
    duration: 30,
    minPeople: 2,
    maxPeople: 30,
    difficulty: 3,
    tags: ["メソッド", "マイズナー", "リアリズム", "2人組"],
    learningObjectives: ["頭を使わない演技", "相手の変化への反応", "『瞬間に生きる』感覚"],
    ageGroup: "高校生〜大人",
    materials: [],
    hasPhysicalContact: false,
    credit: "Sanford Meisner, On Acting",
    sourceUrl: "https://en.wikipedia.org/wiki/Meisner_technique",
    sideCoaching: "「考えるな、繰り返せ」「相手の目から始まる」",
    reflectionQuestions: ["繰り返しが変化した瞬間はいつ?", "頭を使わない演技の感触は?"],
    content: `## Meisner Technique とは

Sanford Meisner (Neighborhood Playhouse) が開発した、
「役に生きること (Living Truthfully) 」を目指すメソッド。核となるのが Repetition (リピティション)。

## 基本エクササイズ

### レベル1: そのまま繰り返す (5分)

2人で向き合う。

A: 「あなたは笑ってる」
B: 「私は笑ってる」
A: 「あなたは笑ってる」
B: 「私は笑ってる」
…と延々続ける。

### レベル2: 変化を捉える (10分)

繰り返しの中で、相手の観察を変えたくなったら変える。

A: 「あなたは笑ってる」
B: 「私は笑ってる」
A: 「あなたは笑ってる」
B: 「私は笑ってない」(自分の感覚が変わった)
A: 「あなたは笑ってない」
B: 「私は緊張してる」
A: 「あなたは緊張してる」
…

**変化は自分から出さず、相手の変化を反射する** のが原則。

### レベル3: 感情の高まり (10分)

繰り返しの中で自然に感情が高まったら、それに乗る。抑えない、作らない。

## 進行のコツ

- 頭で「次何言おう」と考えると崩れる
- **相手の顔・呼吸・声のトーンを絶えず観察**
- 沈黙が起きたら、そのまま観察を続ける

## 参考文献

- Sanford Meisner, *Sanford Meisner on Acting*`,
  },

  // ============ ワークショップ台本 ============
  {
    slug: "elevator-strangers",
    categorySlug: "workshop-script",
    title: "『エレベーターの二人』(短編/2人)",
    summary:
      "止まったエレベーターに閉じ込められた見知らぬ2人。約5分・2ページの短編台本。稽古初心者の実習に。",
    duration: 15,
    minPeople: 2,
    maxPeople: 2,
    difficulty: 2,
    tags: ["2人芝居", "短編", "台本", "実習用"],
    learningObjectives: ["初対面の距離感", "密室の緊張", "沈黙で語る"],
    ageGroup: "高校生〜大人",
    materials: ["椅子2脚 (擬似エレベーター)"],
    hasPhysicalContact: false,
    credit: "戯曲図書館 (自由使用可)",
    sideCoaching: "「冒頭の背中合わせをどこまで引っ張れるか」",
    reflectionQuestions: ["振り返る瞬間の心情は?", "揺れの後の視線の残し方は?"],
    content: `## 作品情報

- **登場人物**: A (30代・会社員) / B (20代・フリーター)
- **場所**: 停止したエレベーター内
- **上演時間**: 約5分

## 本編

**(暗転。ゴォンという音。ライトが薄暗く点く。エレベーター内。AとBが背中合わせで立っている)**

A: ……止まった?

B: 止まりましたね。

A: (ボタンを何度も押す) おかしいな。

B: 押しても……(苦笑)

**(短い沈黙)**

A: すみません、少し詰めてもらえますか。

B: あ、はい。

**(Bが半歩ずれる。二人は依然として背中合わせのまま)**

A: (独り言のように) 今日に限って……

B: 何かあるんですか、この後。

A: いえ。……いえ、ないです。

B: (小さく笑う)

A: 何ですか。

B: いや、ないんですね、って。

A: ……ないですよ。あなたは。

B: 私もないです。

**(沈黙。Aがゆっくり振り返り、初めてBの顔を見る)**

A: あなた、さっきエントランスにいましたよね。

B: ……見てました?

A: いや、なんとなく。

B: 見てたんですね。

A: (口ごもる)

**(遠くでチャイム音。エレベーターがガタンと揺れる。二人はとっさに互いの腕を掴む)**

B: あ、

A: すみません、

**(離す。だが視線は逸らせない)**

B: ……止まったまま、ですね。

A: ですね。

**(照明がふっと落ちて、暗転)**

## ライセンス

稽古・ワークショップ目的で自由使用可 (演出変更可)。有償公演での使用は要相談。`,
  },
  {
    slug: "family-dinner-fragment",
    categorySlug: "workshop-script",
    title: "『家族の夕食』(短編/3人)",
    summary:
      "父・母・子が食卓を囲む、日常の中に亀裂が走る7分の短編。関係性の変化を丁寧に扱う練習台本。",
    duration: 20,
    minPeople: 3,
    maxPeople: 3,
    difficulty: 3,
    tags: ["3人芝居", "家族劇", "短編", "台本"],
    learningObjectives: ["家族関係の構築", "食事の所作", "沈黙で語る"],
    ageGroup: "高校生〜大人",
    materials: ["食卓と椅子3脚", "食器"],
    hasPhysicalContact: false,
    credit: "戯曲図書館 (自由使用可)",
    sideCoaching: "「父が飲み込んだセリフを俳優は決めろ、観客には言うな」",
    reflectionQuestions: ["母は何に気づいて話題を変えた?", "子はなぜ父を見なかった?"],
    content: `## 作品情報

- **登場人物**: 父 (50代) / 母 (50代) / 子 (20代・進学のため実家に一時帰省)
- **場所**: 家の食卓
- **上演時間**: 約7分

## 本編

**(照明が上がる。食卓に3人が座っている。皿と茶碗の音)**

母: (子に) おかわりは?

子: あ、いい、大丈夫。

母: ちゃんと食べなさいよ。痩せた?

子: 痩せてないよ。

父: (箸を止めて) 明日、何時の便だっけ。

子: 10時。

父: 空港まで送るよ。

子: (少し間) いや、電車で行くよ。

父: そうか。

母: お父さん、いいじゃない、送ってあげれば。

父: 本人がいいって言ってるんだから。

**(沈黙。母が味噌汁をすする音)**

母: 向こうで、ちゃんとご飯食べるのよ。

子: 分かってる。

母: 前もそう言って、ラーメンばっかり食べてたじゃない。

子: (笑って) 覚えてるんだ。

母: 覚えてるわよ、そんなの。

**(父が黙って自分の茶碗に目を落とす)**

子: お父さん。

父: ん。

子: ……いや、何でもない。

父: 何。

子: (首を振る) ううん。

**(父がゆっくりと箸を置く)**

父: ……向こうで、困ったら、電話しろよ。

子: (小さく) ……うん。

母: (話題を変えるように) デザートあるわよ。イチゴ。

子: あ、食べる。

母: (立ち上がる) すぐ持ってくる。

**(母が退場。父と子だけが残る。二人は目を合わせない)**

父: ……あのな、

**(母がイチゴを持って戻ってくる。父は言葉を飲み込む)**

母: はい。

子: ありがとう。

**(3人でイチゴを食べる音。照明ゆっくりフェードアウト)**

## ライセンス

稽古・ワークショップ目的で自由使用可。改変可。有償公演での使用は要相談。`,
  },
];

async function main() {
  console.log("演劇メニュー辞典 シードデータ v2 投入...");

  const catMap = new Map<string, number>();
  for (const c of CATEGORIES) {
    const cat = await prisma.theaterMenuCategory.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        icon: c.icon,
        order: c.order,
        description: c.description,
      },
      create: c,
    });
    catMap.set(c.slug, cat.id);
    console.log(`  ✔ カテゴリ: ${c.name}`);
  }

  for (const m of MENUS) {
    const categoryId = catMap.get(m.categorySlug);
    if (!categoryId) {
      console.warn(`  ✗ カテゴリ不明: ${m.categorySlug} (${m.slug})`);
      continue;
    }
    const { categorySlug: _cs, ...rest } = m;
    const relatedSlugs = CURATED_RELATED[m.slug] || [];
    await prisma.theaterMenu.upsert({
      where: { slug: m.slug },
      update: {
        ...rest,
        categoryId,
        aliases: rest.aliases || [],
        learningObjectives: rest.learningObjectives || [],
        materials: rest.materials || [],
        reflectionQuestions: rest.reflectionQuestions || [],
        relatedSlugs,
      },
      create: {
        ...rest,
        categoryId,
        published: true,
        aliases: rest.aliases || [],
        learningObjectives: rest.learningObjectives || [],
        materials: rest.materials || [],
        reflectionQuestions: rest.reflectionQuestions || [],
        relatedSlugs,
      },
    });
    console.log(`  ✔ ${m.categorySlug}/${m.slug}`);
  }

  // 旧カテゴリの掃除 (このシードに含まれない slug かつ紐付くメニューが無いもの)
  const currentSlugs = CATEGORIES.map((c) => c.slug);
  const leftover = await prisma.theaterMenuCategory.findMany({
    where: { slug: { notIn: currentSlugs } },
    include: { _count: { select: { menus: true } } },
  });
  for (const l of leftover) {
    if (l._count.menus === 0) {
      await prisma.theaterMenuCategory.delete({ where: { id: l.id } });
      console.log(`  🗑 旧カテゴリ削除: ${l.name} (${l.slug})`);
    } else {
      console.warn(`  ⚠ カテゴリ ${l.slug} に ${l._count.menus} 件のメニューが残存`);
    }
  }

  console.log(`\n完了: カテゴリ ${CATEGORIES.length}件 / メニュー ${MENUS.length}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
