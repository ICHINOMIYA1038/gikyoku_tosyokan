/**
 * AI生成の作品概要 バッチ3（エビデンスチェック済み）
 * set -a && source .env.local && set +a && npx tsx scripts/seed-ai-synopsis-batch3.ts
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const AI_DESCRIPTIONS: Record<number, string> = {
  39: "元自衛隊員の蓉子が田舎の揚げ麩製造を営む夏目家に嫁ぐが、夫のヤスオがすぐに蒸発。義母の溺愛、長男の嫁のいびり、野鳥園の世話まで押しつけられた蓉子の奮闘を描く。濃密な女優6人の競演で見せる本谷有希子の劇団第14回公演。2009年本多劇場にて初演。",

  43: "主人公・佐竹が、子供時代を過ごした「ヒネミ」という小さな町の記憶を辿る物語。地図制作の仕事をする佐竹は、消えてしまった町「ヒネミ」の地図を密かに作り続けている。兄の死にまつわる記憶の欠落、町の消失の謎が、現在と過去の境界が曖昧になりながら浮かび上がる。宮沢章夫の代表作、第37回岸田國士戯曲賞受賞。",

  44: "「誰ひとり健全な人間がいない混沌とした『平等』な世界」を描く松尾スズキの代表作。下ネタや差別用語が満載でありながら下品にならない独特の劇作術で、「全然話に収集がついてないのにちゃんと終わってる」驚異的な構成力を見せる。第41回岸田國士戯曲賞受賞。大人計画の看板作品。",

  46: "連合赤軍による革命が成功したパラレルワールドの1990年代日本を舞台にした鴻上尚史の代表作。「在日外国人同盟」「おたく主義者同盟」「帰国子女戦線」「花嫁戦線平凡派」など様々な集団が対立する世界で、ある地下室に閉じ込められた人々が銃を向け合う。劇が進むにつれ、それぞれの正体が明かされていくドタバタ的展開。第39回岸田國士戯曲賞受賞。",

  48: "ロンドンの日本人コミュニティを舞台に、ネット社会で傷ついた女性の再生を描く鴻上尚史の戯曲。虚構の劇団旗揚げ公演として上演。タイトルの「グローブ・ジャングル」は公園にある球形のジャングルジムのこと。虚構の劇団旗揚げ三部作として第61回読売文学賞戯曲・シナリオ賞を受賞。",

  49: "長崎の川沿いの町を舞台に、余命宣告を受けた妻・直子と、書けない作家の夫との日常を静かに描く。被爆二世である直子の病と、夫婦の間に流れる深い愛情が、松田正隆の精緻な台詞によって浮かび上がる。何気ない日常の中に「生きることの幸福」を見出す作品。第40回岸田國士戯曲賞受賞。",

  50: "16年間ホームレス生活を送っていた長男・幸介が突然実家に帰ってくる。慶應卒ながら会社の金に手を出して破滅した兄の再出発を、親族たちがそれぞれの思惑で支援しようとするが、世間体・面子・建前・義理・人情が絡み合い話は揉めに揉める。永井愛の鋭い人物造形と台詞術が光る家族喜劇。第44回岸田國士戯曲賞受賞。",
};

async function main() {
  console.log(`${Object.keys(AI_DESCRIPTIONS).length}件のAI概要を更新します...\n`);
  for (const [idStr, desc] of Object.entries(AI_DESCRIPTIONS)) {
    const id = Number(idStr);
    const post = await prisma.post.findUnique({ where: { id }, select: { id: true, title: true, aiDescription: true } });
    if (!post) { console.log(`[SKIP] id=${id} — 見つかりません`); continue; }
    if (post.aiDescription && post.aiDescription.trim() !== "") { console.log(`[SKIP] id=${id} ${post.title} — 既存`); continue; }
    await prisma.post.update({ where: { id }, data: { aiDescription: desc } });
    console.log(`[OK] id=${id} ${post.title}`);
  }
  console.log("\n完了!");
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
