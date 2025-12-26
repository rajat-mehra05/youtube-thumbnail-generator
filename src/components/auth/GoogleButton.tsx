'use client';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export const GoogleButton = ({ onClick, loading }: GoogleButtonProps) => (
  <Button
    onClick={onClick}
    disabled={loading}
    variant="outline"
    className="w-full h-12 text-base"
  >
    {loading ? (
      <span className="flex items-center gap-2">
        <LoadingSpinner size="sm" />
        Connecting...
      </span>
    ) : (
      <span className="flex items-center gap-2">
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </span>
    )}
  </Button>
);
