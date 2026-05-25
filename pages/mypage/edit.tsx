import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import Layout from '@/components/Layout';
import Seo from '@/components/seo';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { FaUser, FaCamera, FaArrowLeft, FaTheaterMasks } from 'react-icons/fa';

interface Props {
  user: {
    name: string | null;
    displayName: string | null;
    email: string | null;
    image: string | null;
    avatarUrl: string | null;
    bio: string | null;
    groupName: string | null;
    emailOptIn: boolean;
  };
}

export default function EditProfile({ user }: Props) {
  const [displayName, setDisplayName] = useState(user.displayName ?? user.name ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [groupName, setGroupName] = useState(user.groupName ?? '');
  const [emailOptIn, setEmailOptIn] = useState(user.emailOptIn);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl ?? user.image ?? '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // サイズ制限: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setMessage('画像は5MB以内にしてください');
      return;
    }

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    // S3にアップロード
    setUploading(true);
    setMessage('');
    try {
      // 1. presigned URL取得
      const presignRes = await fetch('/api/account/avatar-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type }),
      });
      if (!presignRes.ok) {
        const err = await presignRes.json();
        setMessage(err.error || 'アップロードに失敗しました');
        setUploading(false);
        return;
      }
      const { uploadUrl, avatarUrl } = await presignRes.json();

      // 2. S3に直接PUT
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) {
        setMessage('画像のアップロードに失敗しました');
        setUploading(false);
        return;
      }

      // 3. avatarUrlをプロフィールに保存
      await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl }),
      });

      setAvatarPreview(avatarUrl);
      setMessage('アイコンを更新しました');
    } catch {
      setMessage('アップロード中にエラーが発生しました');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, bio, groupName, emailOptIn }),
      });
      if (res.ok) {
        setMessage('プロフィールを保存しました');
      } else {
        const err = await res.json();
        setMessage(err.error || '保存に失敗しました');
      }
    } catch {
      setMessage('通信エラーが発生しました');
    }
    setSaving(false);
  };

  return (
    <Layout>
      <Seo pageTitle="プロフィール編集" pageDescription="プロフィール編集" pagePath="/mypage/edit" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/mypage" className="text-gray-500 hover:text-gray-700">
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold">プロフィール編集</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* アバター */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="アバター"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="text-3xl text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-8 h-8 bg-theater-primary-600 hover:bg-theater-primary-700 text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
              >
                <FaCamera className="text-xs" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            {uploading && <p className="text-xs text-gray-500">アップロード中...</p>}
            <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF（5MB以内）</p>
          </div>

          {/* 表示名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={user.name ?? 'ユーザー'}
              maxLength={50}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-300 focus:border-theater-primary-300"
            />
            <p className="text-xs text-gray-400 mt-1">
              コメント投稿時にこの名前が表示されます。空欄の場合はGoogleアカウントの名前が使用されます。
            </p>
          </div>

          {/* 劇団名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaTheaterMasks className="inline mr-1.5 text-gray-400" />
              所属劇団・ユニット名
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="例: 劇団△△"
              maxLength={100}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-300 focus:border-theater-primary-300"
            />
            <p className="text-xs text-gray-400 mt-1">任意。プロフィールに表示されます。</p>
          </div>

          {/* 自己紹介 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="演劇歴、好きな作品、活動内容などを自由にお書きください"
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-theater-primary-300 focus:border-theater-primary-300 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/500</p>
          </div>

          {/* 案内メール受信 */}
          <div className="border border-gray-200 rounded-lg bg-gray-50/40 p-3">
            <label className="flex items-start gap-2 cursor-pointer text-sm">
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

          {/* メッセージ */}
          {message && (
            <p className={`text-sm font-medium ${message.includes('失敗') || message.includes('エラー') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          {/* ボタン */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Link href="/mypage" className="text-sm text-gray-500 hover:text-gray-700">
              キャンセル
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                saving
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-theater-primary-600 hover:bg-theater-primary-700 text-white'
              }`}
            >
              {saving ? '保存中...' : '保存する'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin?callbackUrl=/mypage/edit', permanent: false } };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      displayName: true,
      email: true,
      image: true,
      avatarUrl: true,
      bio: true,
      groupName: true,
      emailOptIn: true,
    },
  });

  if (!user) return { notFound: true };

  return { props: { user } };
};
