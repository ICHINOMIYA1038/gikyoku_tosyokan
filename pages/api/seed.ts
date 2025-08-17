import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 既存のデータをクリア（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      await prisma.rating.deleteMany();
      await prisma.childComment.deleteMany();
      await prisma.parentComment.deleteMany();
      await prisma.access.deleteMany();
      await prisma.news.deleteMany();
      await prisma.post.deleteMany();
      await prisma.category.deleteMany();
      await prisma.author.deleteMany();
    }

    // 著者データの作成
    const authors = await Promise.all([
      prisma.author.create({
        data: {
          name: "山田太郎",
          website: "https://example.com/yamada",
          group: "劇団青空",
          profile: "1980年生まれ。東京都出身の劇作家・演出家。2005年より劇団青空を主宰。",
          masterpiece: "夕暮れの向こう側",
          authorTwitter: "@yamada_taro",
          groupTwitter: "@gekidan_aozora"
        }
      }),
      prisma.author.create({
        data: {
          name: "佐藤花子",
          website: "https://example.com/sato",
          group: "シアターカンパニー月光",
          profile: "1985年生まれ。大阪府出身。関西を中心に活動する劇作家。",
          masterpiece: "月の裏側で",
          authorTwitter: "@sato_hanako",
          groupTwitter: "@theater_gekko"
        }
      }),
      prisma.author.create({
        data: {
          name: "鈴木一郎",
          website: "https://example.com/suzuki",
          group: "劇団さくら",
          profile: "1975年生まれ。福岡県出身。九州を拠点に全国で公演を行う。",
          masterpiece: "桜の木の下で",
          authorTwitter: "@suzuki_ichiro",
          groupTwitter: "@gekidan_sakura"
        }
      })
    ]);

    // カテゴリーデータの作成
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: "コメディ",
          contentMarkdown: "笑いあり涙ありの楽しい作品群。観客を笑顔にする脚本を集めました。",
          image_url: "/img/comedy.jpg"
        }
      }),
      prisma.category.create({
        data: {
          name: "シリアス",
          contentMarkdown: "人間の内面に深く切り込む、考えさせられる作品群。",
          image_url: "/img/serious.jpg"
        }
      }),
      prisma.category.create({
        data: {
          name: "ファンタジー",
          contentMarkdown: "現実を超えた想像力豊かな世界観の作品群。",
          image_url: "/img/fantasy.jpg"
        }
      }),
      prisma.category.create({
        data: {
          name: "学生演劇",
          contentMarkdown: "学生向けの上演しやすい作品群。文化祭や部活動に最適。",
          image_url: "/img/student.jpg"
        }
      }),
      prisma.category.create({
        data: {
          name: "朗読劇",
          contentMarkdown: "朗読形式で上演できる作品群。少人数でも実施可能。",
          image_url: "/img/reading.jpg"
        }
      })
    ]);

    // 投稿データの作成
    const posts = await Promise.all([
      prisma.post.create({
        data: {
          title: "夕暮れの向こう側",
          content: "都会の片隅で生きる人々の日常を描いた群像劇。",
          author_id: authors[0].id,
          man: 3,
          woman: 4,
          others: 1,
          totalNumber: 8,
          playtime: 90,
          synopsis: "東京の下町を舞台に、アパートの住人たちが織りなす人間模様。笑いあり涙ありの感動作。それぞれの人生が交差する時、奇跡が起きる。",
          image_url: "/img/yugure.jpg",
          website1: "https://example.com/yugure",
          ISBN_13: "978-4-12345-678-9",
          averageRating: 4.5,
          categories: {
            connect: [{ id: categories[0].id }, { id: categories[1].id }]
          }
        }
      }),
      prisma.post.create({
        data: {
          title: "月の裏側で",
          content: "月面基地を舞台にしたSFファンタジー。",
          author_id: authors[1].id,
          man: 2,
          woman: 2,
          others: 2,
          totalNumber: 6,
          playtime: 60,
          synopsis: "2050年、月面基地で働く科学者たちの物語。地球との通信が途絶えた時、彼らは重大な決断を迫られる。",
          image_url: "/img/moon.jpg",
          website1: "https://example.com/moon",
          ISBN_13: "978-4-98765-432-1",
          averageRating: 4.2,
          categories: {
            connect: [{ id: categories[2].id }]
          }
        }
      }),
      prisma.post.create({
        data: {
          title: "桜の木の下で",
          content: "高校生たちの青春群像劇。",
          author_id: authors[2].id,
          man: 5,
          woman: 5,
          others: 0,
          totalNumber: 10,
          playtime: 45,
          synopsis: "卒業を控えた高校3年生たちの最後の文化祭。桜の木の下で交わした約束は、10年後に実を結ぶ。",
          image_url: "/img/sakura.jpg",
          website1: "https://example.com/sakura",
          ISBN_13: "978-4-11111-222-3",
          averageRating: 4.8,
          categories: {
            connect: [{ id: categories[3].id }]
          }
        }
      }),
      prisma.post.create({
        data: {
          title: "声の向こう側",
          content: "朗読劇として書き下ろされた感動作。",
          author_id: authors[0].id,
          man: 2,
          woman: 3,
          others: 0,
          totalNumber: 5,
          playtime: 30,
          synopsis: "ラジオDJと聴取者たちの心の交流を描く。声だけで繋がる人々の温かい物語。",
          image_url: "/img/voice.jpg",
          website1: "https://example.com/voice",
          averageRating: 4.0,
          categories: {
            connect: [{ id: categories[4].id }]
          }
        }
      }),
      prisma.post.create({
        data: {
          title: "笑う門には",
          content: "商店街を舞台にしたドタバタコメディ。",
          author_id: authors[1].id,
          man: 4,
          woman: 3,
          others: 3,
          totalNumber: 10,
          playtime: 75,
          synopsis: "寂れた商店街に新しく開店したお笑い劇場。個性豊かな商店主たちが巻き起こす騒動の数々。",
          image_url: "/img/warau.jpg",
          website1: "https://example.com/warau",
          averageRating: 4.6,
          categories: {
            connect: [{ id: categories[0].id }]
          }
        }
      })
    ]);

    // ニュースデータの作成
    const news = await Promise.all([
      prisma.news.create({
        data: {
          title: "新作「夕暮れの向こう側」が公開されました",
          category: "新作情報",
          url: "/posts/1",
          date: new Date('2024-01-15')
        }
      }),
      prisma.news.create({
        data: {
          title: "山田太郎さんインタビュー掲載",
          category: "インタビュー",
          url: "/authors/1",
          date: new Date('2024-02-01')
        }
      }),
      prisma.news.create({
        data: {
          title: "学生演劇特集を公開しました",
          category: "特集",
          url: "/categories/4",
          date: new Date('2024-02-15')
        }
      }),
      prisma.news.create({
        data: {
          title: "朗読劇カテゴリーが追加されました",
          category: "お知らせ",
          url: "/categories/5",
          date: new Date('2024-03-01')
        }
      }),
      prisma.news.create({
        data: {
          title: "サイトリニューアルのお知らせ",
          category: "お知らせ",
          url: "/",
          date: new Date('2024-03-15')
        }
      })
    ]);

    // サンプルコメントの作成
    for (const post of posts.slice(0, 3)) {
      const parentComment = await prisma.parentComment.create({
        data: {
          content: "素晴らしい作品でした！高校の文化祭で上演させていただきました。",
          post_id: post.id,
          author: "演劇部顧問",
          date: new Date('2024-01-20')
        }
      });

      await prisma.childComment.create({
        data: {
          content: "ありがとうございます！上演の様子はいかがでしたか？",
          parentCommentId: parentComment.id,
          author: "作者",
          date: new Date('2024-01-21')
        }
      });

      await prisma.parentComment.create({
        data: {
          content: "キャスティングの参考になりました。男女比のバランスが良いですね。",
          post_id: post.id,
          author: "劇団員A",
          date: new Date('2024-02-10')
        }
      });
    }

    // サンプル評価の作成
    for (const post of posts) {
      await prisma.rating.create({
        data: {
          ipAddress: "192.168.1.1",
          star: 4.5,
          postId: post.id
        }
      });

      await prisma.rating.create({
        data: {
          ipAddress: "192.168.1.2",
          star: 4.0,
          postId: post.id
        }
      });
    }

    const result = {
      authors: authors.length,
      categories: categories.length,
      posts: posts.length,
      news: news.length,
      message: "サンプルデータの投入が完了しました"
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      error: 'データの投入に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}