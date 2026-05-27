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

function detectFromService(callbackUrl: string): string | null {
  try {
    const u = new URL(callbackUrl, 'https://gikyokutosyokan.com');
    if (u.hostname.endsWith('tomoshibi.gikyokutosyokan.com')) return 'ともしび小屋';
    return null;
  } catch { return null; }
}

export default function SignIn({ providers, callbackUrl }: Props) {
  const router = useRouter();
  const error = router.query.error as string | undefined;
  const fromService = detectFromService(callbackUrl);

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
        pageTitle="ログイン"
        pageDescription="戯曲図書館にログインして、コメントやレビューを投稿しましょう"
        pagePath="/auth/signin"
      />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="戯曲図書館" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">おかえりなさい</h1>
            <p className="text-sm text-gray-500 mt-2">
              {fromService
                ? `${fromService} は戯曲図書館アカウントで利用できます`
                : '戯曲図書館アカウントにログイン'}
            </p>
          </div>

          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
            <p className="font-semibold text-gray-700 mb-1">共通アカウントで使えるサービス</p>
            <ul className="space-y-0.5">
              <li>• <span className="font-medium">戯曲図書館</span> — 戯曲検索・コメント・上演告知</li>
              <li>• <span className="font-medium">ともしび小屋</span> — 舞台照明シミュレーター (3D)</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errorMessages[error] || errorMessages.Default}
            </div>
          )}

          <div className="space-y-3">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() =>
                    signIn(provider.id, {
                      callbackUrl: `/auth/welcome?next=${encodeURIComponent(callbackUrl)}`,
                    })
                  }
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium text-gray-700"
                >
                  <FaGoogle className="text-lg" />
                  <span>{provider.name} でログイン{fromService ? ` (${fromService} に戻ります)` : ''}</span>
                </button>
              ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
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
