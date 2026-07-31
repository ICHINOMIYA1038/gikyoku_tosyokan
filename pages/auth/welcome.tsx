import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { prisma } from '@/lib/prisma';
import { createMobileHandoffToken } from '@/lib/mobileHandoffToken';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

// 関連サブドメイン (*.gikyokutosyokan.com) を含む安全な next URL を返す
function safeNextUrl(raw: unknown): string {
  if (typeof raw !== 'string' || !raw) return '/';
  if (raw.startsWith('/')) return raw;
  // tomoshibiモバイルアプリのASWebAuthenticationSessionが終着点として使う
  // カスタムスキーム。任意のtomoshibi://は許可せずこの完全一致のみ許可する
  // (authOptions.ts の redirect コールバックと同じ方針)。
  if (raw === 'tomoshibi://auth-callback') return raw;
  try {
    const u = new URL(raw);
    if (u.protocol === 'https:' && /(^|\.)gikyokutosyokan\.com$/.test(u.hostname)) return u.toString();
  } catch { /* fallthrough */ }
  return '/';
}
import { FaUser, FaCamera, FaTheaterMasks, FaArrowRight } from 'react-icons/fa';

interface Props {
  user: {
    name: string | null;
    image: string | null;
  };
}

export default function Welcome({ user }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.name ?? '');
  const [groupName, setGroupName] = useState('');
  const [bio, setBio] = useState('');
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(user.image ?? '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const presignRes = await fetch('/api/account/avatar-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type }),
      });
      if (presignRes.ok) {
        const { uploadUrl, avatarUrl } = await presignRes.json();
        await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
        await fetch('/api/account/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl }),
        });
        setAvatarPreview(avatarUrl);
      }
    } catch {}
    setUploading(false);
  };

  const nextUrl = safeNextUrl(router.query.next);

  // next/router の router.push は http(s) の自サイト内遷移が前提で、
  // tomoshibi:// のようなカスタムスキームには遷移できない。
  // また tomoshibi 宛の場合、アプリ本体のWebViewはこのページ(ASWebAuthenticationSession)
  // とは別のCookieストアなのでセッションが引き継がれない。引き継ぎ用の使い捨てトークンを
  // 発行し、mobile-handoff 経由でアプリ側WebViewに正式なセッションCookieを発行させる。
  const navigateToNext = async () => {
    if (nextUrl === 'tomoshibi://auth-callback') {
      try {
        const res = await fetch('/api/auth/mobile-token', { method: 'POST' });
        if (res.ok) {
          const { token } = await res.json();
          window.location.href = `${nextUrl}?token=${encodeURIComponent(token)}`;
          return;
        }
      } catch { /* フォールバックへ */ }
      window.location.href = nextUrl;
      return;
    }
    if (nextUrl.startsWith('tomoshibi://')) {
      window.location.href = nextUrl;
    } else {
      router.push(nextUrl);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, bio, groupName, emailOptIn, completeOnboarding: true }),
    });
    await navigateToNext();
  };

  const handleSkip = async () => {
    // スキップ時もオンボーディングは完了扱い (再表示しない)
    await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completeOnboarding: true }),
    });
    await navigateToNext();
  };

  return (
    <Layout>
      <Seo pageTitle="プロフィール設定" pageDescription="戯曲図書館へようこそ" pagePath="/auth/welcome" />
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-theater-primary-300 to-pink-200 px-8 py-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">ようこそ、戯曲図書館へ！</h1>
            <p className="text-sm text-gray-700 mt-1">プロフィールを設定しましょう</p>
          </div>

          <div className="p-6 space-y-5">
            {/* アバター */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="アバター" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="text-2xl text-gray-400" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-full flex items-center justify-center shadow-sm"
                >
                  <FaCamera className="text-xs" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleAvatarChange} />
              </div>
              {uploading && <p className="text-xs text-gray-500">アップロード中...</p>}
            </div>

            {/* 表示名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="コメント時に表示される名前"
                maxLength={50}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-300"
              />
            </div>

            {/* 劇団名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaTheaterMasks className="inline mr-1 text-gray-400" />
                所属劇団・ユニット名（任意）
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="例: 劇団△△"
                maxLength={100}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-300"
              />
            </div>

            {/* 自己紹介 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介（任意）</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="演劇歴、好きな作品など"
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-300 resize-y"
              />
            </div>

            {/* 案内メール受信 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={emailOptIn}
                  onChange={(e) => setEmailOptIn(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300"
                />
                <span>
                  <span className="font-medium text-gray-900">案内メールを受け取る</span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    新機能のお知らせ、おすすめの戯曲特集などをメールでお届けします。いつでも配信停止できます。
                  </span>
                </span>
              </label>
            </div>

            {/* ボタン */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                あとで設定する
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? '保存中...' : '設定して始める'}
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/auth/signup', permanent: false } };
  }

  // オンボーディング完了済みならホームへ
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true, onboardedAt: true },
  });

  if (user?.onboardedAt) {
    const nextUrl = safeNextUrl(context.query.next);
    if (nextUrl === 'tomoshibi://auth-callback') {
      const token = await createMobileHandoffToken(session.user.id);
      return { redirect: { destination: `${nextUrl}?token=${encodeURIComponent(token)}`, permanent: false } };
    }
    return { redirect: { destination: nextUrl, permanent: false } };
  }

  return { props: { user: { name: user?.name ?? null, image: user?.image ?? null } } };
};
