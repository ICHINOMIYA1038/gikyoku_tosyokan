import OptimizedImage from "./OptimizedImage";

const APPS = [
  {
    name: "エチュードメーカー",
    description: "即興演劇のお題をワンタップで出せる iPhone アプリ",
    href: "https://apps.apple.com/us/app/%E3%82%A8%E3%83%81%E3%83%A5%E3%83%BC%E3%83%89%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC/id6794500656",
    icon: "https://gikyokutosyokan-public.s3.ap-northeast-1.amazonaws.com/assets/banners/etude-wide.png",
  },
  {
    name: "TOMOSHIBI 小屋",
    description: "ブラウザで舞台照明をデザインして、プレビュー・共有できるツール",
    href: "https://tomoshibi.gikyokutosyokan.com",
    icon: null,
  },
];

// 関連アプリの告知。大きなバナーにせず、フッターの上に1行ずつ並べる
export default function SisterApps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 border-t border-gray-200">
      <h2 className="text-base font-bold text-gray-900 mb-4">姉妹アプリ</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {APPS.map((app) => (
          <li key={app.name}>
            <a href={app.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded border border-gray-200 hover:border-gray-400 transition-colors">
              {app.icon ? (
                <span className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded">
                  <OptimizedImage src={app.icon} alt="" width={192} height={50} className="absolute inset-0 h-full w-auto max-w-none object-cover object-left" />
                </span>
              ) : (
                <span className="w-12 h-12 flex-shrink-0 rounded bg-gray-900 text-white font-serif font-bold text-lg flex items-center justify-center" aria-hidden="true">
                  灯
                </span>
              )}
              <span className="min-w-0">
                <span className="block font-bold text-gray-900">{app.name}</span>
                <span className="block text-sm text-gray-600">{app.description}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
