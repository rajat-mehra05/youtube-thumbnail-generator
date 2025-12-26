'use client';

import { type ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryProvider>
      {children}
      <Toaster position="bottom-right" richColors />
    </QueryProvider>
  );
};
