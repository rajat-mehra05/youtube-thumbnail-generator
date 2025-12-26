import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MethodCard } from '@/components/create/MethodCard';
import { ROUTES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Create New Thumbnail',
};

export default async function CreatePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const methods = [
    {
      href: ROUTES.CREATE_AI,
      icon: '✨',
      title: 'AI Magic',
      description: 'Describe your video and let AI generate stunning thumbnail concepts for you.',
      badge: 'Recommended',
    },
    {
      href: ROUTES.CREATE_UPLOAD,
      icon: '📤',
      title: 'Upload Image',
      description: 'Start with your own image. Perfect for using your photos or screenshots.',
    },
    {
      href: ROUTES.CREATE_TEMPLATES,
      icon: '📋',
      title: 'Templates',
      description: 'Choose from 50+ professionally designed templates for every niche.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        user={{
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          created_at: user.created_at,
        }}
      />

      <main className="flex-1 py-8 md:py-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back link */}
          <Link
            href={ROUTES.DASHBOARD}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            ← Back to Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              How do you want to create?
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Choose a method to start creating your YouTube thumbnail. You can
              always combine methods in the editor.
            </p>
          </div>

          {/* Method Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {methods.map((method) => (
              <MethodCard key={method.title} {...method} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
