import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-orange-500/10" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />
    <div
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />
    <div className="container mx-auto px-4 relative py-24 md:py-32 lg:py-40">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600" />
          </span>
          AI-Powered Thumbnail Generator
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Create Stunning{' '}
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">
            YouTube Thumbnails
          </span>{' '}
          in Seconds
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Stop spending hours on thumbnails. Describe your video, and our AI creates eye-catching designs that boost your click-through rate.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={ROUTES.TRY}>
            <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25">
              ✨ Try Free — No Signup
            </Button>
          </Link>
          <Link href={ROUTES.LOGIN}>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg">Get Started</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-6">1 free AI generation • No credit card required</p>
      </div>
    </div>
  </section>
);
