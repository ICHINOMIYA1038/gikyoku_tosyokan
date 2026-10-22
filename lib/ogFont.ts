/**
 * OG 画像（next/og）用に、Noto Sans JP を描く文字だけのサブセットで Google Fonts から取得する。
 *
 * next/og の既定フォントはファイルシステムから読まれるため Cloudflare Workers では使えない。
 * 日本語フォント丸ごとはバンドルに入れるには大きすぎるので、必要な文字だけを都度取得して渡す。
 */
type Weight = 400 | 700;

async function loadFont(text: string, weight: Weight): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`;
  // User-Agent を付けないと TrueType が返る（satori は woff2 を読めない）
  const css = await (await fetch(cssUrl)).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) {
    throw new Error("Google Fonts の CSS からフォントの URL を取得できませんでした");
  }
  const res = await fetch(src[1]);
  if (!res.ok) {
    throw new Error(`フォントの取得に失敗しました（${res.status}）`);
  }
  return res.arrayBuffer();
}

// 取得に失敗したら undefined を返し、next/og の既定フォントで描かせる
export async function notoSansJpFonts(text: string) {
  try {
    const [regular, bold] = await Promise.all([loadFont(text, 400), loadFont(text, 700)]);
    return [
      { name: "Noto Sans JP", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Noto Sans JP", data: bold, weight: 700 as const, style: "normal" as const },
    ];
  } catch (error) {
    console.error("[og] Noto Sans JP の取得に失敗しました:", error);
    return undefined;
  }
}
