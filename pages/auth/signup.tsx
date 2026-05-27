import { GetServerSideProps } from 'next';
import { signIn, getProviders, ClientSafeProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaGoogle } from 'react-icons/fa';

interface Props {
  providers: Record<string, ClientSafeProvider> | null;
  callbackUrl: string;
}

type ServiceKey = 'gikyoku' | 'tomoshibi';

interface ServiceInfo {
  key: ServiceKey;
  name: string;
  tagline: string;
  benefits: string[];
}

const SERVICES: Record<ServiceKey, ServiceInfo> = {
  gikyoku: {
    key: 'gikyoku',
    name: '戯曲図書館',
    tagline: '戯曲を探す・読む・記録する',
    benefits: [
      'コメント・レビューを投稿できる',
      'お気に入り戯曲をブックマーク',
      '上演告知を投稿して観客を集められる',
    ],
  },
  tomoshibi: {
    key: 'tomoshibi',
    name: 'ともしび小屋',
    tagline: '舞台照明を3Dでデザインする',
    benefits: [
      '組んだ明かりをクラウドに保存できる',
      '別端末から続きを開ける',
      '最大5シーンまで自由に保存',
    ],
  },
};

function detectFromService(callbackUrl: string): ServiceKey {
  try {
    const u = new URL(callbackUrl, 'https://gikyokutosyokan.com');
    if (u.hostname.endsWith('tomoshibi.gikyokutosyokan.com')) return 'tomoshibi';
  } catch { /* noop */ }
  return 'gikyoku';
}

export default function SignUp({ providers, callbackUrl }: Props) {
  const router = useRouter();
  const error = router.query.error as string | undefined;
  const fromKey = detectFromService(callbackUrl);
  const main = SERVICES[fromKey];
  const other = SERVICES[fromKey === 'tomoshibi' ? 'gikyoku' : 'tomoshibi'];

  return (
    <Layout>
      <Seo
        pageTitle={`${main.name} に新規登録`}
        pageDescription={`${main.name} を含む関連サービスで共通利用できる無料アカウントです`}
        pagePath="/auth/signup"
      />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-br from-theater-primary-300 to-pink-200 px-6 py-7 text-center">
            <h1 className="text-xl font-bold text-gray-900">
              {main.name} に登録
            </h1>
            <p className="text-xs text-gray-700 mt-1.5">
              {main.tagline}
            </p>
          </div>

          <div className="p-6">
            {/* メインサービスでできること */}
            <ul className="space-y-2 mb-5">
              {main.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-theater-primary-500 mt-1">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                登録中にエラーが発生しました。もう一度お試しください。
              </div>
            )}

            {/* 登録ボタン */}
            <div className="space-y-2">
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: `/auth/welcome?next=${encodeURIComponent(callbackUrl)}`,
                      })
                    }
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <FaGoogle />
                    <span>{provider.name} で登録</span>
                  </button>
                ))}
            </div>

            <p className="mt-3 text-xs text-gray-500 text-center">
              パスワード設定不要・いつでも削除可
            </p>

            {/* 共通アカウントの注記 */}
            <div className="mt-5 pt-5 border-t border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                作成するアカウントは <b className="text-gray-700">{other.name}</b>（{other.tagline}）でも共通でご利用いただけます。
              </p>
            </div>

            {/* 利用規約 */}
            <p className="mt-4 text-[11px] text-gray-400 text-center leading-relaxed">
              登録することで、
              <Link href="/support/tos" className="text-theater-primary-600 hover:underline">利用規約</Link>
              および
              <Link href="/support/privacy-policy" className="text-theater-primary-600 hover:underline">プライバシーポリシー</Link>
              に同意したものとみなされます。
            </p>

            {/* ログインリンク */}
            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                すでにアカウントをお持ちは
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
