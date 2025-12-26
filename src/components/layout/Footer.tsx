import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl tracking-tight mb-4"
            >
              <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
                T
              </div>
              <span>{APP_NAME}</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Create stunning YouTube thumbnails in seconds with AI. Boost your
              click-through rate with eye-catching designs.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/try"
                  className="hover:text-foreground transition-colors"
                >
                  Try Free
                </Link>
              </li>
              <li>
                <Link
                  href="/create/templates"
                  className="hover:text-foreground transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/create/ai"
                  className="hover:text-foreground transition-colors"
                >
                  AI Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <p>Made with ❤️ for content creators</p>
        </div>
      </div>
    </footer>
  );
};
