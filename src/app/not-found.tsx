import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-500/5 via-background to-fuchsia-500/5">
            {/* Background pattern */}
            <div
                className="fixed inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="max-w-lg w-full relative text-center space-y-6">
                {/* 404 illustration */}
                <div className="relative">
                    <div className="inline-flex items-center justify-center space-x-2">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-2 border-violet-500/30 flex items-center justify-center">
                            <span className="text-4xl font-bold text-violet-600">4</span>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-2 border-violet-500/30 flex items-center justify-center animate-pulse">
                            <span className="text-4xl">🔍</span>
                        </div>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-2 border-violet-500/30 flex items-center justify-center">
                            <span className="text-4xl font-bold text-violet-600">4</span>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold">Page Not Found</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Link href={ROUTES.HOME}>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                        >
                            Go Home
                        </Button>
                    </Link>
                    <Link href={ROUTES.DASHBOARD}>
                        <Button variant="outline" size="lg">
                            My Projects
                        </Button>
                    </Link>
                </div>

                {/* Popular pages */}
                <div className="pt-8">
                    <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Link href={ROUTES.TRY}>
                            <Button variant="ghost" size="sm">
                                Try Free
                            </Button>
                        </Link>
                        <Link href={ROUTES.CREATE}>
                            <Button variant="ghost" size="sm">
                                Create
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
