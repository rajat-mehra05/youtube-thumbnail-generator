import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-3',
};

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-violet-500 border-t-transparent',
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export const LoadingOverlay = ({ message = 'Loading...' }: { message?: string }) => {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="xl" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
};

export const LoadingCard = ({ message = 'Loading...' }: { message?: string }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center py-12 gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
};
