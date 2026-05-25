import { GetServerSideProps } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import Seo from "@/components/seo";

type Props = { status: "success" | "invalid"; email?: string };

export default function Unsubscribe({ status, email }: Props) {
  return (
    <Layout>
      <Seo
        pageTitle="配信停止 | 戯曲図書館"
        pageDescription="案内メールの配信停止ページ"
        pagePath="/unsubscribe"
      />
      <div className="container mx-auto max-w-xl px-4 py-12">
        {status === "success" ? (
          <>
            <h1 className="mb-3 text-2xl font-bold text-gray-900">配信を停止しました</h1>
            <p className="text-sm leading-relaxed text-gray-600">
              {email ? <span className="font-medium">{email}</span> : "ご登録のアドレス"}{" "}
              への案内メール配信を停止しました。今後、新機能のお知らせなどのメールは送信されません。
            </p>
            <p className="mt-4 text-xs text-gray-500">
              再度受け取りたい場合は、
              <Link href="/mypage/edit" className="text-pink-600 underline">プロフィール編集</Link>
              から「案内メールを受け取る」を有効にできます。
            </p>
          </>
        ) : (
          <>
            <h1 className="mb-3 text-2xl font-bold text-gray-900">無効なリンクです</h1>
            <p className="text-sm leading-relaxed text-gray-600">
              この配信停止リンクは無効か、すでに使用済みです。
              プロフィール編集から手動で配信設定を変更できます。
            </p>
            <p className="mt-4">
              <Link href="/mypage/edit" className="text-pink-600 underline">プロフィール編集を開く</Link>
            </p>
          </>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const token = typeof query.token === "string" ? query.token : null;
  if (!token) return { props: { status: "invalid" } };

  const user = await prisma.user.findUnique({
    where: { unsubscribeToken: token },
    select: { id: true, email: true, emailOptIn: true },
  });
  if (!user) return { props: { status: "invalid" } };

  if (user.emailOptIn) {
    await prisma.user.update({
      where: { id: user.id },
      data: { emailOptIn: false, emailOptInAt: null },
    });
  }
  return { props: { status: "success", email: user.email ?? undefined } };
};
