import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

/*https://tuka.dev/posts/implement-link-card-with-nextjs/を参考に実装 */

// jsdom は Cloudflare Workers で動かないため、<meta> タグだけを正規表現で読む
const decodeEntities = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const metaTags = (html: string) =>
  Array.from(html.matchAll(/<meta\b[^>]*>/gi), ([tag]) => {
    const attrs: Record<string, string> = {};
    for (const [, name, , dq, sq, bare] of tag.matchAll(
      /([^\s=\/>]+)\s*(=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g
    )) {
      attrs[name.toLowerCase()] = decodeEntities(dq ?? sq ?? bare ?? "");
    }
    return attrs;
  });

export type OgData = {
  url: string;
  siteName?: string;
  title?: string;
  description?: string;
  image?: string;
  type?: string;
};

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const url = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;

  if (!url) {
    res.status(400);
    return;
  }

  const httpRes = await fetch(url);
  if (!httpRes.ok) {
    res.status(404);
    return;
  }

  const resHtml = await httpRes.text();

  const og: OgData = { url };
  for (const metaTag of metaTags(resHtml)) {
    const property = metaTag.property;
    const content = metaTag.content;
    switch (property) {
      case "og:site_name":
        og.siteName = content || undefined;
        break;
      case "og:title":
        og.title = content || undefined;
        break;
      case "og:description":
        og.description = content || undefined;
        break;
      case "og:image":
        og.image = content || undefined;
        break;
      case "og:type":
        og.type = content || undefined;
        break;
      default:
      // nop
    }
  }

  res.setHeader("Cache-Control", "max-age=86400");
  res.send(og);
};

export default handler;
