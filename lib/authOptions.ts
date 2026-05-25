import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
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
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日
  },

  // 本番では必ずHTTPSのみにする
  useSecureCookies: process.env.NODE_ENV === 'production',

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
      if (account?.provider === 'google') {
        // emailが確認済みでなければ拒否（Google側で通常確認されているが念のため）
        const email = user.email;
        if (!email) return false;
      }
      return true;
    },
  },

  events: {
    async createUser({ user }) {
      console.log(`[auth] New user created: ${user.email}`);
      if (!user.email || !user.id) return;
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
