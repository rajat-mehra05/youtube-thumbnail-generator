import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { validateRedirectPath } from '@/lib/utils/validation';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectParam = searchParams.get('redirect');

  // Validate and sanitize redirect path to prevent open redirects
  const safeRedirect = validateRedirectPath(redirectParam, '/dashboard');

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Redirect to the validated safe destination
      // Guest session transfer is handled on the client side
      return NextResponse.redirect(`${origin}${safeRedirect}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
