'use client';

import { Suspense } from 'react';
import { TemplatesContent } from './content';

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
        </div>
      }
    >
      <TemplatesContent />
    </Suspense>
  );
}
