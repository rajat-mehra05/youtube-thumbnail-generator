import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { ROUTES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { getProjects } from '@/lib/actions/projects';
import { DashboardClient } from './client';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch projects
  const { projects = [] } = await getProjects();

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

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground mt-1">
                {projects.length === 0
                  ? 'Create your first thumbnail'
                  : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <Link href={ROUTES.CREATE}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
              >
                + Create New
              </Button>
            </Link>
          </div>

          {/* Project Grid - Client component for interactivity */}
          <DashboardClient initialProjects={projects} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
