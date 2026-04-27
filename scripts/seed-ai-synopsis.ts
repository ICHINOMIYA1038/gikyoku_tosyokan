/**
 * AI生成の作品概要を ai_description カラムに保存するスクリプト
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/seed-ai-synopsis.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AI_DESCRIPTIONS: Record<number, string> = {
  5: "超能力カフェに集う自称超能力者たちのもとに、テレビの取材クルーがやってくる。本物の超能力を見せようと奮闘する常連客たちだが、実は全員インチキ。しかし取材当日、本物の超能力者が現れたことで事態は思わぬ方向に転がり始める。ヨーロッパ企画・上田誠が贈る、笑いと驚きに満ちた傑作コメディ。",

  6: "ある日突然、見慣れた日常の風景が壊れ始める。別役実が描く不条理の世界で、登場人物たちは崩壊していく日常にどう向き合うのか。言葉と存在の根源を問いかける、別役不条理劇の代表作のひとつ。",

  8: "大富豪の屋敷を舞台に、巻き起こるドタバタ騒動。サリngROCKならではのスピード感あふれる展開と、個性豊かなキャラクターたちが織りなすエンターテインメント作品。予測不能な展開の連続に、最後まで目が離せない。",

  9: "ある日、一人の男が姿を消す。残された人々はその不在と向き合いながら、それぞれの記憶と感情を語り始める。ケラリーノ・サンドロヴィッチが「不在」をテーマに描く、静かで緊張感に満ちた会話劇。消えた人間の存在が、残された者たちの関係を浮き彫りにしていく。",

  10: "長崎と古代の国を行き来しながら、時空を超えた壮大な物語が展開する。野田秀樹が原爆と文明の衝突を重ね合わせ、「鐘」という象徴を通して人類の業と希望を描き出す大作。言葉遊びと身体表現が交錯する、野田秀樹の代表作のひとつ。",

  11: "神戸のホテルを舞台に、さまざまな人間模様が交錯する群像劇。小幡欣治が丁寧に描く人間ドラマで、笑いと涙が同居する温かみのある作品。登場人物それぞれの人生が、ホテルという空間の中で静かに響き合う。",

  12: "タニノクロウが独自の身体感覚で描く、閉塞感と可笑しみが同居する世界。ある集団が「砦」にこもり、外界との関係を断とうとするが、そこに生まれるのは滑稽で切ない人間の姿。庭劇団ペニノの初期代表作。",

  13: "マッチ売りの少女をモチーフに、別役実が再構築した不条理劇。童話の世界が現代の不条理と溶け合い、4人の登場人物が織りなす会話は、やがて存在そのものへの問いかけへと変容していく。別役実の詩的な言語感覚が光る作品。",

  14: "戦争と個人の関係を問いかける、坂手洋二の社会派群像劇。一人の人間が「たった一人の戦争」を始めたとき、周囲の人々は何を考え、どう行動するのか。大人数のキャストが生み出すダイナミックな舞台空間の中で、現代社会の暴力と向き合う。",

  15: "夢の中で出会った男たちの、現実と幻想が入り混じる物語。高橋いさをが紡ぐ詩的な台詞と独特の世界観で、4人の男たちの孤独と繋がりを描く。日常のすぐ裏側にある「もうひとつの世界」が、静かに観客の心に染み込んでいく。",
};

async function main() {
  console.log(`${Object.keys(AI_DESCRIPTIONS).length}件のAI概要を更新します...\n`);

  for (const [idStr, desc] of Object.entries(AI_DESCRIPTIONS)) {
    const id = Number(idStr);
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true, title: true, aiDescription: true },
    });

    if (!post) {
      console.log(`[SKIP] id=${id} — 作品が見つかりません`);
      continue;
    }

    if (post.aiDescription && post.aiDescription.trim() !== "") {
      console.log(`[SKIP] id=${id} ${post.title} — 既にAI概要があります`);
      continue;
    }

    await prisma.post.update({
      where: { id },
      data: { aiDescription: desc },
    });

    console.log(`[OK] id=${id} ${post.title}`);
  }

  console.log("\n完了!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
