import "@/styles/globals.css";
import "@/styles/markdown.css";
import "@/styles/theater-menu.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import * as gtag from "@/lib/gtag";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Noto_Sans_JP } from "next/font/google";
import MobileOptimizations from "@/components/MobileOptimizations";
import CookieConsent from "@/components/CookieConsent";
import dynamic from "next/dynamic";
const InstallPrompt = dynamic(() => import("@/components/InstallPrompt"), { ssr: false });
import { getConsent } from "@/lib/cookie-consent";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
  fallback: ["Hiragino Kaku Gothic Pro", "Meiryo", "sans-serif"],
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 既に同意済みならConsent Modeをgrantedに上げる
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getConsent() === "accepted" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
  }, []);

  useEffect(() => {
    const handleRouterChange = (url: any) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouterChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouterChange);
    };
  }, [router.events]);

  return (
    <>
      <MobileOptimizations />
      <style jsx global>{`
        html {
          font-family: ${notoSansJP.style.fontFamily};
        }
      `}</style>
      {/* Consent Mode v2: 同意前でもタグはロードするが、
          デフォルトでad/analyticsストレージをdenied にしてCookieを書かない。
          同意後にgrantedに上げる（CookieConsent.tsx側）。
          拒否時も匿名モデル化データが GA/Ads に送られる。 */}
      <Script
        id="gtag-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            // 日本ユーザーを主対象とするため、個情法に基づく利用目的公表方式で
            // デフォルト granted 運用。バナーは情報提供+オプトアウト用途。
            // GDPR等の対象地域はサーバー側での地域判定+上書き対応を別途検討。
            gtag('consent', 'default', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
              analytics_storage: 'granted',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
          `,
        }}
      />
      {/* AdSense: 手動広告ユニット用スクリプト（自動広告OFF）
          afterInteractive: 直帰ユーザーにも広告がロードされるよう、
          interactive直後に投入する。lazyOnloadだとPV/imp比が大きく毀損する。 */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8691137965825158"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('js', new Date());
            gtag('config', '${gtag.GA_MEASUREMENT_ID}');
          `,
        }}
      />
      <SessionProvider session={pageProps.session}>
        <FavoritesProvider>
          <QueryClientProvider client={queryClient}>
            <main className={notoSansJP.className}>
              <Component {...pageProps} />
            </main>
          </QueryClientProvider>
        </FavoritesProvider>
      </SessionProvider>
      <Analytics />
      <CookieConsent />
      <InstallPrompt />
    </>
  );
}
