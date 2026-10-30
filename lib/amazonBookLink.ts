// 作品の Amazon 購入リンク。登録済みの amazon_text_url を優先し、無ければ ISBN-13 から ISBN-10 を求めて
// 商品ページ（/dp/<ISBN-10>）を組み立てる。書籍の ASIN は ISBN-10 と同じ。
export const AMAZON_TRACKING_ID = "gikyokutosyokan-22";

export function isbn13ToIsbn10(isbn13: string | null | undefined): string | null {
  const digits = (isbn13 || "").replace(/[^0-9]/g, "");
  if (!/^978[0-9]{10}$/.test(digits)) return null;
  const core = digits.slice(3, 12);
  let total = 0;
  for (let i = 0; i < 9; i++) total += (10 - i) * Number(core[i]);
  const check = (11 - (total % 11)) % 11;
  return core + (check === 10 ? "X" : String(check));
}

export function amazonBookUrl(post: { amazon_text_url?: string | null; ISBN_13?: string | null }): string | null {
  if (post.amazon_text_url) return post.amazon_text_url;
  const isbn10 = isbn13ToIsbn10(post.ISBN_13);
  return isbn10 ? `https://www.amazon.co.jp/dp/${isbn10}?tag=${AMAZON_TRACKING_ID}` : null;
}
