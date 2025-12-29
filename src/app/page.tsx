import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import {
  HeroSection,
  ShowcaseSection,
  FeaturesSection,
  CTASection,
} from '@/components/home';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user ? { id: user.id, email: user.email || '', created_at: user.created_at } : null} />
      <main className="flex-1">
        <HeroSection />
        <ShowcaseSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
