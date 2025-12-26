'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { APP_NAME, ROUTES } from '@/lib/constants';
import type { User } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  user?: User | null;
  showGuestBanner?: boolean;
  generationsRemaining?: number;
}

export const Navbar = ({
  user,
  showGuestBanner = false,
  generationsRemaining = 1,
}: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.HOME);
    router.refresh();
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const isLandingPage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {showGuestBanner && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-sm">
          <span className="text-amber-600 dark:text-amber-400">
            🎁 Free Trial: {generationsRemaining} AI generation remaining
          </span>
        </div>
      )}
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
          aria-label="Go to homepage"
        >
          <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
            T
          </div>
          <span className="hidden sm:inline-block">{APP_NAME}</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href={ROUTES.DASHBOARD}>
                <Button
                  variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href={ROUTES.CREATE}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                >
                  + Create New
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative size-9 rounded-full"
                    aria-label="User menu"
                  >
                    <Avatar className="size-9">
                      <AvatarImage
                        src={user.avatar_url}
                        alt={user.full_name || user.email}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-sm">
                        {getInitials(user.full_name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={user.avatar_url}
                        alt={user.full_name || user.email}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs">
                        {getInitials(user.full_name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user.full_name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.DASHBOARD}>My Projects</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-600"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {!isLandingPage && (
                <>
                  <Link href={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href={ROUTES.LOGIN}>
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
              {isLandingPage && (
                <>
                  <Link href={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href={ROUTES.LOGIN}>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
