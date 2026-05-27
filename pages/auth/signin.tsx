import { GetServerSideProps } from 'next';
import { signIn, getProviders, ClientSafeProvider } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { FaGoogle } from 'react-icons/fa';

interface Props {
  providers: Record<string, ClientSafeProvider> | null;
  callbackUrl: string;
}

type ServiceKey = 'gikyoku' | 'tomoshibi';
const SERVICES: Record<ServiceKey, { name: string; tagline: string }> = {
  gikyoku: { name: '戯曲図書館', tagline: '戯曲を探す・読む・記録する' },
  tomoshibi: { name: 'ともしび小屋', tagline: '舞台照明を3Dでデザインする' },
};

function detectFromService(callbackUrl: string): ServiceKey {
  try {
    const u = new URL(callbackUrl, 'https://gikyokutosyokan.com');
    if (u.hostname.endsWith('tomoshibi.gikyokutosyokan.com')) return 'tomoshibi';
  } catch { /* noop */ }
  return 'gikyoku';
}

export default function SignIn({ providers, callbackUrl }: Props) {
  const router = useRouter();
  const error = router.query.error as string | undefined;
  const auto = router.query.auto === '1' && !error;
  const fromKey = detectFromService(callbackUrl);
  const main = SERVICES[fromKey];
  const other = SERVICES[fromKey === 'tomoshibi' ? 'gikyoku' : 'tomoshibi'];
  const autoFired = useRef(false);

  // ?auto=1 が指定されていれば Google OAuth を自動起動 (中継ページの説明は出さない)
  useEffect(() => {
    if (!auto || autoFired.current || !providers?.google) return;
    autoFired.current = true;
    signIn('google', { callbackUrl: `/auth/welcome?next=${encodeURIComponent(callbackUrl)}` });
  }, [auto, providers, callbackUrl]);

  if (auto) {
    return (
      <Layout>
        <Seo pageTitle="ログイン中..." pageDescription="" pagePath="/auth/signin" />
        <div className="container mx-auto px-4 py-20 text-center text-gray-600">
          <p className="text-sm">Googleに移動しています…</p>
        </div>
      </Layout>
    );
  }

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'サインインの開始中にエラーが発生しました。',
    OAuthCallback: 'Googleからの応答処理中にエラーが発生しました。',
    OAuthCreateAccount: 'アカウント作成中にエラーが発生しました。',
    Callback: '認証コールバック中にエラーが発生しました。',
    AccessDenied: 'アクセスが拒否されました。',
    Default: '認証中にエラーが発生しました。もう一度お試しください。',
  };

  return (
    <Layout>
      <Seo
        pageTitle={`${main.name} にログイン`}
        pageDescription={`${main.name} にログイン`}
        pagePath="/auth/signin"
      />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-7">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              {main.name} にログイン
            </h1>
            <p className="text-xs text-gray-500 mt-1.5">{main.tagline}</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errorMessages[error] || errorMessages.Default}
            </div>
          )}

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
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium text-gray-700 text-sm"
                >
                  <FaGoogle />
                  <span>{provider.name} でログイン</span>
                </button>
              ))}
          </div>

          <div className="mt-5 pt-5 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              <b className="text-gray-700">{other.name}</b>（{other.tagline}）も同じアカウントで使えます。
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方は
              <Link
                href={`/auth/signup${callbackUrl !== '/' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                className="text-theater-primary-600 hover:underline font-medium ml-1"
              >
                新規登録
              </Link>
            </p>
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
