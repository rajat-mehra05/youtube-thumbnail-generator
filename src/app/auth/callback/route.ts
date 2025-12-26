import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { transferGuestDataToUser } from '@/lib/actions/guest-session';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Check for guest session to transfer
      const cookieStore = await cookies();
      
      // Try to get guest session ID from a cookie (we'll need to set this on the client)
      // For now, we'll redirect and let the client handle the transfer
      
      // Redirect to the intended destination
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
