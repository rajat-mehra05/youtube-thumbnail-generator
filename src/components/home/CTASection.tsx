import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export const CTASection = () => (
  <section className="py-16 md:py-24">
    <div className="container">
      <div className="relative max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your First Thumbnail?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Join thousands of creators who save hours every week with AI-powered thumbnail generation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={ROUTES.TRY}>
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-violet-600 hover:bg-white/90">
                Try Free Now
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN}>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);
