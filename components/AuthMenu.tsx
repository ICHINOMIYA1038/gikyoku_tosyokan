import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaSignInAlt, FaSignOutAlt, FaUser, FaChevronDown, FaUserPlus, FaEnvelope } from 'react-icons/fa';

interface AuthMenuProps {
  variant?: 'desktop' | 'mobile';
}

const AuthMenu: React.FC<AuthMenuProps> = ({ variant = 'desktop' }) => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (status === 'loading') {
    return (
      <div className={variant === 'desktop' ? 'w-9 h-9' : 'w-full h-10'}>
        <div className="w-full h-full bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!session) {
    if (variant === 'mobile') {
      return (
        <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
          <Link
            href="/auth/signin"
            className="w-full flex items-center gap-3 py-3 px-4 text-left text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaSignInAlt className="text-theater-primary-600" />
            <span className="font-medium">ログイン</span>
          </Link>
          <Link
            href="/auth/signup"
            className="w-full flex items-center gap-3 py-3 px-4 text-left text-white bg-theater-primary-600 hover:bg-theater-primary-700 rounded-lg transition-colors"
          >
            <FaUserPlus />
            <span className="font-medium">新規登録（無料）</span>
          </Link>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/signin"
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-theater-neutral-800 hover:text-theater-neutral-600 transition-colors"
        >
          <span>ログイン</span>
        </Link>
        <Link
          href="/auth/signup"
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-theater-primary-600 hover:bg-theater-primary-700 rounded-full transition-colors"
        >
          <span>新規登録</span>
        </Link>
      </div>
    );
  }

  // ログイン済み
  if (variant === 'mobile') {
    return (
      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="flex items-center gap-3 py-3 px-4">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? 'user'}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-gray-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session.user.name ?? 'ユーザー'}
            </p>
            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
          </div>
        </div>
        <Link
          href="/mypage"
          className="w-full flex items-center gap-3 py-3 px-4 text-left text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaUser />
          <span>マイページ</span>
        </Link>
        <Link
          href="/messages"
          className="w-full flex items-center gap-3 py-3 px-4 text-left text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaEnvelope />
          <span>メッセージ</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 py-3 px-4 text-left text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span>ログアウト</span>
        </button>
      </div>
    );
  }

  // desktop ログイン済み: ドロップダウン
  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="ユーザーメニュー"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? 'user'}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <FaUser className="text-theater-primary-600" />
          </div>
        )}
        <FaChevronDown className="text-white text-xs" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {session.user.name ?? 'ユーザー'}
            </p>
            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
          </div>
          <Link
            href="/mypage"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaUser className="text-gray-500" />
            マイページ
          </Link>
          <Link
            href="/messages"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FaEnvelope className="text-gray-500" />
            メッセージ
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: '/' });
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
          >
            <FaSignOutAlt className="text-gray-500" />
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthMenu;
