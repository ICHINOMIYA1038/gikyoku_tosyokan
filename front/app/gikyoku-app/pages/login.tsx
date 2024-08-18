import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';

const Login = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <div>
      <Auth 
        supabaseClient={supabase} 
        appearance={{ theme: ThemeSupa }} 
        providers={['google']}  // Google認証プロバイダーを追加
        redirectTo={process.env.NEXT_PUBLIC_REDIRECT_URL} // ログイン後のリダイレクト先
      />
    </div>
  );
};

export default Login;
