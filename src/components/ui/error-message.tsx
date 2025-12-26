import { Button } from './button';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage = ({
    title = 'Something went wrong',
    message,
    onRetry,
    className,
}: ErrorMessageProps) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-md mb-4">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm">
                    Try Again
                </Button>
            )}
        </div>
    );
};

export const InlineError = ({ message }: { message: string }) => {
    return (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <span>{message}</span>
        </div>
    );
};
