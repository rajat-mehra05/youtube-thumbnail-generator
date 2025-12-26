'use client';

import { Suspense } from 'react';
import { LoginContent } from './content';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
