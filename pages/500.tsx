import Layout from "@/components/Layout";
import Seo from "@/components/seo";
import Link from "next/link";

export default function Custom500() {
  return (
    <Layout>
      <Seo
        pageTitle="500 - サーバーエラー"
        pageDescription="サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。"
        pagePath="/500"
      />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            サーバーエラー
          </h2>
          <p className="text-gray-500 mb-8">
            申し訳ございません。サーバーでエラーが発生しました。
            <br />
            しばらく時間をおいてから再度お試しください。
          </p>
          <div className="space-y-4">
            <Link href="/">
              <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
                トップページへ戻る
              </button>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ページを再読み込み
            </button>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              問題が解決しない場合
            </p>
            <div className="mt-4">
              <Link href="/support/contact" className="text-blue-500 hover:underline">
                お問い合わせページ
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                からご連絡ください
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}