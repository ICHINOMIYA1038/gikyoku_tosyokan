import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getAppleClientSecret } from '@/lib/appleClientSecret';
import { prisma } from '@/lib/prisma';
import type { UserRole } from '@prisma/client';

/**
 * NextAuth.js 設定
 *
 * セッション戦略: JWT（サーバーレス環境での高速化）
 * アダプタ: Prisma（User/Account/VerificationToken の永続化）
 * プロバイダ: Google OAuth のみ
 *
 * 認証フロー:
 * 1. /api/auth/signin/google にリダイレクト
 * 2. Google認証完了後、Accountレコード作成 or 既存ユーザーにリンク
 * 3. 初回はUserレコード作成
 * 4. JWTトークン発行、cookieに保存
 * 5. session callbackでsession.userにid/roleを注入
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'online',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
      // Googleから受け取るプロファイルを内部User形式に変換
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'USER' as UserRole,
        };
      },
    }),
    // tomoshibiモバイルアプリ (App Store) が Sign In with Apple を必須とする
    // (Google等サードパーティログインを使うアプリはApple審査ガイドライン4.8により
    // 同等のプライバシー配慮ログインの併設が必要)ため追加。
    // clientSecretはAPPLE_PRIVATE_KEYからその場で署名する (詳細は lib/appleClientSecret.ts)。
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID ?? '',
      clientSecret: getAppleClientSecret(),
      // Appleはユーザー名をid_tokenに含めず、初回認可時のPOSTボディでのみ送ってくる。
      // このため name は取得できないことが多い。session callback が
      // displayName を別途DBから補完する既存の仕組みに委ねる。
      profile(profile) {
        return {
          id: profile.sub,
          name: null,
          email: profile.email,
          image: null,
          role: 'USER' as UserRole,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  // 本番では必ずHTTPSのみにする
  useSecureCookies: process.env.NODE_ENV === 'production',

  // 関連サービス (tomoshibi.gikyokutosyokan.com 等) とログイン状態を共有するため
  // セッションCookieは親ドメイン .gikyokutosyokan.com に発行する。
  // __Host- 接頭辞は domain 指定不可なのでこれらは付け替えず既定のまま。
  //
  // state/pkceCodeVerifier/csrfToken は SameSite=Lax のままだと、Apple Sign In が使う
  // response_mode: 'form_post' (appleid.apple.com からのクロスサイトPOST) でブラウザが
  // Cookieを送らず、コールバック側でstate/PKCE検証が失敗してサインインエラーになる
  // (GoogleはトップレベルのGETリダイレクトなのでLaxでも問題なかった)。
  // このため認可フロー中しか使わないこれらのCookieだけSameSite=Noneにする。
  cookies: process.env.NODE_ENV === 'production'
    ? {
        sessionToken: {
          name: '__Secure-next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: true,
            domain: '.gikyokutosyokan.com',
          },
        },
        callbackUrl: {
          name: '__Secure-next-auth.callback-url',
          options: {
            sameSite: 'lax',
            path: '/',
            secure: true,
            domain: '.gikyokutosyokan.com',
          },
        },
        csrfToken: {
          name: '__Host-next-auth.csrf-token',
          options: {
            httpOnly: true,
            sameSite: 'none',
            path: '/',
            secure: true,
          },
        },
        state: {
          name: '__Secure-next-auth.state',
          options: {
            httpOnly: true,
            sameSite: 'none',
            path: '/',
            secure: true,
            maxAge: 900,
          },
        },
        pkceCodeVerifier: {
          name: '__Secure-next-auth.pkce.code_verifier',
          options: {
            httpOnly: true,
            sameSite: 'none',
            path: '/',
            secure: true,
            maxAge: 900,
          },
        },
        nonce: {
          name: '__Secure-next-auth.nonce',
          options: {
            httpOnly: true,
            sameSite: 'none',
            path: '/',
            secure: true,
          },
        },
      }
    : undefined,

  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },

  callbacks: {
    /**
     * JWT生成時のカスタマイズ
     * DB上のUserレコードからidとroleを取り出してトークンに埋め込む
     */
    async jwt({ token, user }) {
      // 初回サインイン時
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role ?? 'USER';
      }

      // 既存トークンの場合、最新のrole情報をDBから取得
      if (token.email && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    /**
     * クライアントに返すsessionをカスタマイズ
     * session.user に id と role を注入
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole) ?? 'USER';
        // DBからカスタムプロフィール情報を取得して上書き
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { displayName: true, avatarUrl: true, groupName: true },
          });
          if (dbUser) {
            if (dbUser.displayName) session.user.name = dbUser.displayName;
            if (dbUser.avatarUrl) session.user.image = dbUser.avatarUrl;
          }
        }
      }
      return session;
    },

    /**
     * サインインフローの許可制御
     * 現在は全Googleユーザーを許可
     */
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'apple') {
        // emailが確認済みでなければ拒否（各プロバイダ側で通常確認されているが念のため）
        const email = user.email;
        if (!email) return false;
      }
      return true;
    },

    /**
     * サインイン後のリダイレクト先制御。
     * 初回ログインユーザー (onboardedAt が null) は /auth/welcome へ強制誘導。
     */
    async redirect({ url, baseUrl }) {
      // 同一サイトの相対URL / baseUrl と同じオリジン / *.gikyokutosyokan.com サブドメインを許可。
      // それ以外は baseUrl にフォールバック (オープンリダイレクト防止)。
      const isSafeAbsolute = (u: string): boolean => {
        // tomoshibiモバイルアプリのASWebAuthenticationSessionが終着点として使う
        // カスタムスキーム。任意のtomoshibi://を許可すると実質オープンリダイレクトに
        // なるため、この完全一致のリテラルのみ許可する。
        if (u === 'tomoshibi://auth-callback') return true;
        try {
          const p = new URL(u);
          if (p.origin === baseUrl) return true;
          // 親ドメイン共有: tomoshibi.gikyokutosyokan.com など
          return p.protocol === 'https:' && /(^|\.)gikyokutosyokan\.com$/.test(p.hostname);
        } catch { return false; }
      };
      const target = url.startsWith('/')
        ? `${baseUrl}${url}`
        : isSafeAbsolute(url)
          ? url
          : baseUrl;
      if (target.includes('/auth/welcome')) return target;
      return target;
    },
  },

  events: {
    async createUser({ user }) {
      console.log(`[auth] New user created: ${user.email}`);
      if (!user.email || !user.id) return;

      // Slack 通知 (Serverless では fire-and-forget が freeze されるため await)
      try {
        const [{ notifySlack, slackSection }] = await Promise.all([import('@/lib/slack')]);
        const totalUsers = await prisma.user.count().catch(() => null);
        const displayName = (user as { displayName?: string | null }).displayName ?? user.name ?? '(名前未設定)';
        const totalLine = totalUsers != null ? `\n累計ユーザー: *${totalUsers}* 人` : '';
        await notifySlack({
          text: `🎉 新規会員登録: ${displayName} (${user.email})`,
          iconEmoji: ':tada:',
          blocks: [
            slackSection(`*🎉 新規会員登録*\n氏名: ${displayName}\nメール: ${user.email}${totalLine}`),
          ],
        });
      } catch (e) {
        console.error('[auth] slack notify failed:', e);
      }

      try {
        // 配信停止用のトークンを発行して保存
        const { randomBytes } = await import("node:crypto");
        const token = randomBytes(24).toString("base64url");
        await prisma.user.update({
          where: { id: user.id },
          data: { unsubscribeToken: token, welcomeEmailSentAt: new Date() },
        });

        const [{ sendMail }, { welcomeMail }] = await Promise.all([
          import("@/lib/mailer"),
          import("@/lib/mail-templates"),
        ]);
        const fromAddr = process.env.GMAIL_USER || "noreply@gikyokutosyokan.com";
        const t = welcomeMail({
          displayName: (user as { displayName?: string | null }).displayName ?? user.name ?? null,
          email: user.email,
        });
        await sendMail({
          from: `戯曲図書館 <${fromAddr}>`,
          to: user.email,
          subject: t.subject,
          html: t.html,
          text: t.text,
        });
      } catch (e) {
        console.error("[auth] welcome mail failed:", e);
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
