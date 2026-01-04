'use client';

interface ReadOnlyOverlayProps {
    onSignUp?: () => void;
}

export const ReadOnlyOverlay = ({ onSignUp }: ReadOnlyOverlayProps) => (
    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
        <div className="text-center p-4 pointer-events-auto">
            <p className="text-sm font-medium mb-2">Sign up to edit</p>
            <p className="text-xs text-muted-foreground">
                Create an account to unlock editing features
            </p>
            {onSignUp && (
                <button
                    onClick={onSignUp}
                    className="mt-3 text-sm text-violet-600 hover:text-violet-500 font-medium"
                >
                    Sign up now →
                </button>
            )}
        </div>
    </div>
);