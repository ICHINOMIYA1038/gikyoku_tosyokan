/**
 * Amazon PA-API を使ってブログ記事内のAmazonリンクを
 * 正式なアソシエイトリンク（ASIN付き）に更新するスクリプト
 *
 * 使い方:
 *   set -a && source .env.local && set +a && npx tsx scripts/amazon-update-links.ts
 */

const amazonPaapi = require("amazon-paapi");
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "../blog/posts");

const commonParameters = {
  AccessKey: process.env.AMAZON_PAAPI_ACCESS_KEY!,
  SecretKey: process.env.AMAZON_PAAPI_SECRET_KEY!,
  PartnerTag: process.env.AMAZON_ASSOCIATE_ID!,
  PartnerType: "Associates",
  Marketplace: "www.amazon.co.jp",
};

// 検索キーワードと記事ファイルのマッピング
interface BookSearch {
  keyword: string;
  searchIndex: string;
  linkText: string; // マークダウン内のリンクテキスト（部分一致で検索）
}

interface ArticleConfig {
  file: string;
  books: BookSearch[];
}

const articles: ArticleConfig[] = [
  {
    file: "2026-02-15-high-school-drama-guide.md",
    books: [
      {
        keyword: "演劇入門 平田オリザ 講談社現代新書",
        searchIndex: "Books",
        linkText: "Amazonで探す](https://www.amazon.co.jp/s?k=%E6%BC%94%E5%8A%87%E5%85%A5%E9%96%80",
      },
      {
        keyword: "発声と身体のレッスン 鴻上尚史",
        searchIndex: "Books",
        linkText: "Amazonで探す](https://www.amazon.co.jp/s?k=%E7%99%BA%E5%A3%B0%E3%81%A8%E8%BA%AB%E4%BD%93%E3%81%AE%E3%83%AC%E3%83%83%E3%82%B9%E3%83%B3",
      },
      {
        keyword: "12人の優しい日本人 三谷幸喜",
        searchIndex: "Books",
        linkText: "Amazonで探す](https://www.amazon.co.jp/s?k=12%E4%BA%BA%E3%81%AE%E5%84%AA%E3%81%97%E3%81%84%E6%97%A5%E6%9C%AC%E4%BA%BA",
      },
      {
        keyword: "父と暮せば 井上ひさし",
        searchIndex: "Books",
        linkText: "Amazonで探す](https://www.amazon.co.jp/s?k=%E7%88%B6%E3%81%A8%E6%9A%AE%E3%82%89%E3%81%9B%E3%81%B0",
      },
    ],
  },
  {
    file: "2026-02-15-theater-books-for-actors.md",
    books: [
      {
        keyword: "演劇入門 平田オリザ 講談社現代新書",
        searchIndex: "Books",
        linkText: "Amazonで『演劇入門 平田オリザ』を探す](https://www.amazon.co.jp/s?k=%E6%BC%94%E5%8A%87%E5%85%A5%E9%96%80",
      },
      {
        keyword: "演技と演出 平田オリザ 講談社現代新書",
        searchIndex: "Books",
        linkText: "Amazonで『演技と演出 平田オリザ』を探す",
      },
      {
        keyword: "発声と身体のレッスン 鴻上尚史 白水社",
        searchIndex: "Books",
        linkText: "Amazonで『発声と身体のレッスン 鴻上尚史』を探す",
      },
      {
        keyword: "表現力のレッスン 鴻上尚史 講談社現代新書",
        searchIndex: "Books",
        linkText: "Amazonで『表現力のレッスン 鴻上尚史』を探す",
      },
      {
        keyword: "あなたの魅力を演出するちょっとしたヒント 鴻上尚史",
        searchIndex: "Books",
        linkText: "Amazonで探す](https://www.amazon.co.jp/s?k=%E3%81%82%E3%81%AA%E3%81%9F%E3%81%AE%E9%AD%85%E5%8A%9B%E3%82%92%E6%BC%94%E5%87%BA",
      },
      {
        keyword: "わかりあえないことから 平田オリザ 講談社現代新書",
        searchIndex: "Books",
        linkText: "Amazonで『わかりあえないことから 平田オリザ』を探す",
      },
      {
        keyword: "俳優の仕事 スタニスラフスキー",
        searchIndex: "Books",
        linkText: "Amazonで『スタニスラフスキー 俳優の仕事』を探す",
      },
    ],
  },
  {
    file: "2026-02-15-recommended-plays-for-beginners.md",
    books: [
      {
        keyword: "12人の優しい日本人 三谷幸喜",
        searchIndex: "Books",
        linkText: "Amazonで『12人の優しい日本人』を探す",
      },
      {
        keyword: "笑の大学 三谷幸喜",
        searchIndex: "Books",
        linkText: "Amazonで『笑の大学』を探す",
      },
      {
        keyword: "父と暮せば 井上ひさし",
        searchIndex: "Books",
        linkText: "Amazonで『父と暮せば』を探す",
      },
      {
        keyword: "朝日のような夕日をつれて 鴻上尚史",
        searchIndex: "Books",
        linkText: "Amazonで『朝日のような夕日をつれて』を探す",
      },
      {
        keyword: "東京ノート 平田オリザ",
        searchIndex: "Books",
        linkText: "Amazonで『東京ノート』を探す",
      },
      {
        keyword: "熱海殺人事件 つかこうへい",
        searchIndex: "Books",
        linkText: "Amazonで『熱海殺人事件』を探す",
      },
      {
        keyword: "別役実 戯曲",
        searchIndex: "Books",
        linkText: "Amazonで『別役実 戯曲』を探す",
      },
      {
        keyword: "桜の園 チェーホフ",
        searchIndex: "Books",
        linkText: "Amazonで『チェーホフ 桜の園』を探す",
      },
      {
        keyword: "夏の夜の夢 シェイクスピア",
        searchIndex: "Books",
        linkText: "Amazonで『シェイクスピア 夏の夜の夢』を探す",
      },
      {
        keyword: "ガラスの動物園 テネシー・ウィリアムズ",
        searchIndex: "Books",
        linkText: "Amazonで『ガラスの動物園』を探す",
      },
    ],
  },
];

// PA-APIのレート制限対策（1リクエスト/秒）
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchBook(
  keyword: string,
  searchIndex: string
): Promise<{ asin: string; title: string; url: string } | null> {
  try {
    const requestParameters = {
      Keywords: keyword,
      SearchIndex: searchIndex,
      ItemCount: 1,
      Resources: [
        "ItemInfo.Title",
        "ItemInfo.ByLineInfo",
        "Offers.Listings.Price",
      ],
    };

    const data = await amazonPaapi.SearchItems(
      commonParameters,
      requestParameters
    );

    if (data.SearchResult && data.SearchResult.Items.length > 0) {
      const item = data.SearchResult.Items[0];
      return {
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue || keyword,
        url: `https://www.amazon.co.jp/dp/${item.ASIN}/ref=nosim?tag=${commonParameters.PartnerTag}`,
      };
    }

    console.warn(`  ⚠ 検索結果なし: "${keyword}"`);
    return null;
  } catch (error: any) {
    console.error(`  ✗ APIエラー (${keyword}):`, error.message || error);
    return null;
  }
}

function replaceLink(
  content: string,
  linkText: string,
  newUrl: string,
  bookTitle: string
): string {
  // マークダウンのリンクパターンを検索して置換
  // [テキスト](古いURL) → [テキスト](新しいURL)
  const escapedLinkText = linkText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `\\[([^\\]]*${escapedLinkText.substring(0, 20)}[^\\]]*)\\]\\([^)]+\\)`
  );

  // より柔軟に: linkTextを含む行を検索して、URLだけ置換
  const lines = content.split("\n");
  let replaced = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(linkText)) {
      // この行のURLを置換
      const urlPattern = /\(https:\/\/www\.amazon\.co\.jp\/[^)]+\)/;
      if (urlPattern.test(lines[i])) {
        lines[i] = lines[i].replace(urlPattern, `(${newUrl})`);
        replaced = true;
        console.log(`  ✓ 置換成功: ${bookTitle}`);
        break;
      }
    }
  }

  if (!replaced) {
    // linkTextの先頭部分だけで再検索
    const shortText = linkText.substring(0, 30);
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(shortText)) {
        const urlPattern = /\(https:\/\/www\.amazon\.co\.jp\/[^)]+\)/;
        if (urlPattern.test(lines[i])) {
          lines[i] = lines[i].replace(urlPattern, `(${newUrl})`);
          replaced = true;
          console.log(`  ✓ 置換成功 (部分一致): ${bookTitle}`);
          break;
        }
      }
    }
  }

  if (!replaced) {
    console.warn(`  ⚠ 置換対象が見つからず: ${bookTitle}`);
  }

  return lines.join("\n");
}

async function main() {
  console.log("=== Amazon PA-API リンク更新スクリプト ===\n");

  // 環境変数チェック
  if (
    !process.env.AMAZON_PAAPI_ACCESS_KEY ||
    !process.env.AMAZON_PAAPI_SECRET_KEY
  ) {
    console.error(
      "エラー: AMAZON_PAAPI_ACCESS_KEY / AMAZON_PAAPI_SECRET_KEY が設定されていません"
    );
    process.exit(1);
  }

  for (const article of articles) {
    const filePath = path.join(BLOG_DIR, article.file);
    console.log(`\n📄 ${article.file}`);

    if (!fs.existsSync(filePath)) {
      console.error(`  ✗ ファイルが見つかりません: ${filePath}`);
      continue;
    }

    let content = fs.readFileSync(filePath, "utf-8");

    for (const book of article.books) {
      console.log(`  🔍 検索中: "${book.keyword}"`);
      const result = await searchBook(book.keyword, book.searchIndex);

      if (result) {
        console.log(`  📖 ${result.title} (ASIN: ${result.asin})`);
        content = replaceLink(content, book.linkText, result.url, result.title);
      }

      // レート制限対策: 1秒待つ
      await sleep(1100);
    }

    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`  💾 保存完了: ${article.file}`);
  }

  console.log("\n=== 完了 ===");
}

main().catch(console.error);
