'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APP_NAME, ROUTES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { InlineError } from '@/components/ui/error-message';
import { SuccessMessage } from '@/components/ui/SuccessMessage';
import { BackgroundPattern } from '@/components/ui/BackgroundPattern';
import { GoogleButton, LoginForm, SignupForm } from '@/components/auth';

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || ROUTES.DASHBOARD;
  const defaultMode = searchParams.get('mode') || 'login';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      setMessage('Check your email for the confirmation link!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-violet-500/5 via-background to-fuchsia-500/5">
      <BackgroundPattern />
      <Link
        href={ROUTES.HOME}
        className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-8"
      >
        <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-lg font-bold">
          T
        </div>
        <span>{APP_NAME}</span>
      </Link>

      <Card className="w-full max-w-md">
        <Tabs defaultValue={defaultMode} className="w-full">
          <div className="p-6 pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </div>

          <CardContent>
            {error && <div className="mb-4"><InlineError message={error} /></div>}
            {message && <div className="mb-4"><SuccessMessage message={message} /></div>}

            <GoogleButton onClick={handleGoogleSignIn} loading={loading} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <TabsContent value="login" className="mt-0">
              <LoginForm
                email={email}
                password={password}
                loading={loading}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleEmailSignIn}
              />
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <SignupForm
                fullName={fullName}
                email={email}
                password={password}
                loading={loading}
                onFullNameChange={setFullName}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleEmailSignUp}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">
        <Link href={ROUTES.HOME} className="hover:text-foreground">← Back to Home</Link>
      </p>
    </div>
  );
}
