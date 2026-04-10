/**
 * ブログ記事のmarkdown contentに埋め込まれた構造化データを抽出するユーティリティ
 *
 * 生成スクリプトが以下の形式でHTMLコメントとしてメタデータを埋め込む:
 *
 *   <!-- structured-data
 *   {"events": [...], "faq": [...]}
 *   -->
 *
 * react-markdownではコメントはレンダリングされないので、見た目には影響しない。
 */

export interface BlogEvent {
  name: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
  };
  url?: string;
  offers?: {
    priceMin?: number;
    priceMax?: number;
    priceCurrency?: string;
  };
  performer?: {
    name: string;
  };
  description?: string;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogMetadata {
  events?: BlogEvent[];
  faq?: BlogFaqItem[];
}

const METADATA_COMMENT_REGEX = /<!--\s*structured-data\s*([\s\S]*?)-->/;

export function extractBlogMetadata(content: string): BlogMetadata {
  const match = content.match(METADATA_COMMENT_REGEX);
  if (!match) return {};

  try {
    const parsed = JSON.parse(match[1].trim());
    return parsed as BlogMetadata;
  } catch {
    return {};
  }
}

export function stripMetadataComment(content: string): string {
  return content.replace(METADATA_COMMENT_REGEX, '').trimStart();
}

/**
 * 記事の本文から読了時間を推定（分）。日本語の読了速度は約400-600字/分。
 * ここでは控えめに500字/分で計算し、最低1分。
 */
/**
 * 見出し文字列からスラッグ（アンカーID）を生成。
 * BlogTableOfContents と ReactMarkdownのh2/h3コンポーネントで同じロジックを使うことで
 * リンクと見出しのIDを一致させる。
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/\*\*/g, '')
    .replace(/[^\w\u3000-\u9fff\uff00-\uffef]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * React Nodeを再帰的にプレーンテキストに変換。
 * ReactMarkdownの見出しコンポーネント内で、子要素（code, strong等）を含む見出しから
 * IDを生成するために使う。
 */
export function flattenReactChildren(children: unknown): string {
  if (children == null) return '';
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(flattenReactChildren).join('');
  }
  if (typeof children === 'object' && 'props' in (children as Record<string, unknown>)) {
    const props = (children as { props?: { children?: unknown } }).props;
    return flattenReactChildren(props?.children);
  }
  return '';
}

export function estimateReadingTime(content: string): number {
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/[#*_`>|\-]/g, '')
    .replace(/\s+/g, '');
  const charCount = plainText.length;
  return Math.max(1, Math.ceil(charCount / 500));
}
