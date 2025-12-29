'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { logger } from '@/lib/utils/logger';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error('Application error:', { error });
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-500/5 via-background to-orange-500/5">
            {/* Background pattern */}
            <div
                className="fixed inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="max-w-lg w-full relative">
                <div className="text-center space-y-6">
                    {/* Error illustration */}
                    <div className="relative">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30 relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 animate-pulse" />
                            <span className="text-5xl relative z-10">⚠️</span>
                        </div>
                    </div>

                    {/* Error message */}
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-bold">Oops! Something went wrong</h1>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We encountered an unexpected error. Don&apos;t worry, it&apos;s not your fault!
                        </p>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-left">
                                <summary className="cursor-pointer font-medium text-sm text-red-600 dark:text-red-400">
                                    Error Details (Development)
                                </summary>
                                <pre className="mt-2 text-xs overflow-auto max-h-32 text-red-600 dark:text-red-400">
                                    {error.message}
                                </pre>
                            </details>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                        <Button
                            onClick={reset}
                            size="lg"
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                        >
                            Try Again
                        </Button>
                        <Link href={ROUTES.HOME}>
                            <Button variant="outline" size="lg">
                                Go Home
                            </Button>
                        </Link>
                    </div>

                    {/* Help text */}
                    <p className="text-sm text-muted-foreground pt-4">
                        If this problem persists, please{' '}
                        <a href="mailto:support@example.com" className="text-violet-600 hover:underline">
                            contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
