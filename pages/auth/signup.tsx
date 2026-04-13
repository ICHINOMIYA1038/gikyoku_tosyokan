import { GetServerSideProps } from 'next';
import { signIn, getProviders, ClientSafeProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaGoogle, FaCommentDots, FaHeart, FaTheaterMasks, FaCheckCircle } from 'react-icons/fa';

interface Props {
  providers: Record<string, ClientSafeProvider> | null;
  callbackUrl: string;
}

const BENEFITS = [
  {
    icon: FaCommentDots,
    title: 'コメント・レビュー投稿',
    description: '作品への感想や上演報告を投稿できます',
  },
  {
    icon: FaHeart,
    title: 'お気に入り・履歴',
    description: '気になる作品をブックマークして後から見返せます',
  },
  {
    icon: FaTheaterMasks,
    title: '上演告知',
    description: '公演情報を投稿して観客を募ることができます',
  },
];

export default function SignUp({ providers, callbackUrl }: Props) {
  const router = useRouter();
  const error = router.query.error as string | undefined;

  return (
    <Layout>
      <Seo
        pageTitle="新規登録"
        pageDescription="戯曲図書館に無料登録して、コメントやレビュー投稿、お気に入り機能を利用しましょう"
        pagePath="/auth/signup"
      />
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-br from-theater-primary-300 to-pink-200 px-8 py-8 text-center">
            <img src="/logo.png" alt="戯曲図書館" className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">戯曲図書館に登録</h1>
            <p className="text-sm text-gray-700 mt-2">
              無料で登録して、演劇の世界をもっと楽しもう
            </p>
          </div>

          <div className="p-8">
            {/* できること */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                登録するとできること
              </h2>
              <ul className="space-y-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <benefit.icon className="text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{benefit.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                登録中にエラーが発生しました。もう一度お試しください。
              </div>
            )}

            {/* 登録ボタン */}
            <div className="space-y-3">
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => signIn(provider.id, { callbackUrl: '/auth/welcome' })}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <FaGoogle className="text-lg" />
                    <span>{provider.name} で無料登録</span>
                  </button>
                ))}
            </div>

            {/* 取得情報の説明 */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>取得する情報: 表示名・メールアドレス・プロフィール画像のみ</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>パスワードの設定は不要です</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FaCheckCircle className="text-green-500 flex-shrink-0" />
                <span>いつでもアカウントを削除できます</span>
              </div>
            </div>

            {/* 利用規約 */}
            <p className="mt-6 text-xs text-gray-400 text-center">
              登録することで、
              <Link href="/support/tos" className="text-theater-primary-600 hover:underline">
                利用規約
              </Link>
              および
              <Link href="/support/privacy-policy" className="text-theater-primary-600 hover:underline">
                プライバシーポリシー
              </Link>
              に同意したものとみなされます。
            </p>

            {/* ログインリンク */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                すでにアカウントをお持ちの方は
                <Link
                  href={`/auth/signin${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                  className="text-theater-primary-600 hover:underline font-medium ml-1"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: (context.query.callbackUrl as string) || '/',
        permanent: false,
      },
    };
  }
  const providers = await getProviders();
  const callbackUrl = (context.query.callbackUrl as string) || '/';
  return { props: { providers, callbackUrl } };
};
