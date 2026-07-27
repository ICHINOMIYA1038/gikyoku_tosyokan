import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";

export default function SharePage() {
  const router = useRouter();
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const d = router.query.d;
    if (typeof d === "string") {
      try {
        setText(decodeURIComponent(escape(atob(d))));
      } catch {
        setText(null);
      }
    }
  }, [router.query.d]);

  return (
    <Layout>
      <Seo
        pageTitle="共有された結果 — 演劇メニュー辞典"
        pageDescription="シャッフル結果の共有ページ"
        pagePath="/theater-menu/share"
        noindex
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <nav className="text-xs text-gray-500 mb-4">
          <Link href="/theater-menu" className="hover:text-rose-600">演劇メニュー</Link>
          <span className="mx-2">/</span>
          <span>共有</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">共有された結果</h1>
        {text ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {text}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-gray-500">データを読み取れませんでした</p>
        )}
        <div className="mt-6">
          <Link
            href="/theater-menu/role-picker"
            className="text-sm text-rose-600 hover:underline"
          >
            自分でも役割割り振りを試す →
          </Link>
        </div>
      </div>
    </Layout>
  );
}
