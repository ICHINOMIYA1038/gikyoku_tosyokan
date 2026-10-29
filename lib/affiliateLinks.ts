const AFFILIATE_HOSTS = new Set([
  'af.moshimo.com',
  'px.a8.net',
  'click.a8.net',
  'ck.jp.ap.valuecommerce.com',
  'ad.jp.ap.valuecommerce.com',
  'hb.afl.rakuten.co.jp',
  'amzn.to',
]);

export function isAffiliateHref(href?: string): boolean {
  if (!href) return false;

  try {
    const normalized = href.startsWith('//') ? `https:${href}` : href;
    const url = new URL(normalized);
    const host = url.hostname.toLowerCase();

    if (AFFILIATE_HOSTS.has(host)) return true;
    if (host === 'amazon.co.jp' || host.endsWith('.amazon.co.jp')) {
      return url.searchParams.has('tag');
    }
    return false;
  } catch {
    return false;
  }
}

export function containsAffiliateHref(markdown: string): boolean {
  const urls = markdown.match(/(?:https?:)?\/\/[^\s)<>'"]+/g) || [];
  return urls.some(isAffiliateHref);
}

export function externalLinkRel(href?: string): string {
  return isAffiliateHref(href)
    ? 'noopener noreferrer nofollow sponsored'
    : 'noopener noreferrer';
}
