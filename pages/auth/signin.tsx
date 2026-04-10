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

export default function SignIn({ providers, callbackUrl }: Props) {
  const router = useRouter();
  const error = router.query.error as string | undefined;

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'サインインの開始中にエラーが発生しました。',
    OAuthCallback: 'Googleからの応答処理中にエラーが発生しました。',
    OAuthCreateAccount: 'アカウント作成中にエラーが発生しました。',
    EmailCreateAccount: 'アカウント作成中にエラーが発生しました。',
    Callback: '認証コールバック中にエラーが発生しました。',
    AccessDenied: 'アクセスが拒否されました。',
    Verification: 'トークンが無効または期限切れです。',
    Default: '認証中にエラーが発生しました。もう一度お試しください。',
  };

  return (
    <Layout>
      <Seo
        pageTitle="ログイン"
        pageDescription="戯曲図書館にログインして、コメントや お気に入りなどの機能を利用しましょう"
        pagePath="/auth/signin"
      />
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <img src="/logo.png" alt="戯曲図書館" className="w-16 h-16 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">戯曲図書館にログイン</h1>
            <p className="text-sm text-gray-600 mt-2">
              ログインすると、コメントやレビューを投稿できます
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {errorMessages[error] || errorMessages.Default}
            </div>
          )}

          <div className="space-y-3">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  <FaGoogle className="text-lg" />
                  <span>{provider.name}でログイン</span>
                </button>
              ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500 space-y-2">
            <p>
              ログインすることで、
              <Link href="/support/terms" className="text-theater-primary-600 hover:underline">
                利用規約
              </Link>
              および
              <Link href="/support/privacy-policy" className="text-theater-primary-600 hover:underline">
                プライバシーポリシー
              </Link>
              に同意したものとみなされます。
            </p>
            <p>
              取得する情報: 表示名・メールアドレス・プロフィール画像
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // すでにログイン済みならトップにリダイレクト
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

  return {
    props: {
      providers,
      callbackUrl,
    },
  };
};
