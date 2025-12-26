'use client';

import { Badge } from '@/components/ui/badge';

interface GuestBannerProps {
  generationsRemaining: number;
}

export const GuestBanner = ({ generationsRemaining }: GuestBannerProps) => {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-500/20 px-4 py-3">
      <div className="container flex items-center justify-center gap-3 text-sm">
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        >
          🎁 Free Trial
        </Badge>
        <span className="text-amber-600 dark:text-amber-400 font-medium">
          {generationsRemaining} AI generation{generationsRemaining !== 1 ? 's' : ''}{' '}
          remaining
        </span>
      </div>
    </div>
  );
};
