'use client';

interface PreviewModeCardProps {
    onSignUp: () => void;
}

export const PreviewModeCard = ({ onSignUp }: PreviewModeCardProps) => (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 max-w-md mx-4 border border-border shadow-2xl pointer-events-auto">
            <h3 className="text-lg font-semibold mb-2">Preview Mode</h3>
            <p className="text-sm text-muted-foreground mb-4">
                You&apos;re viewing your generated thumbnail in read-only mode. Sign up to edit, save, and export your designs.
            </p>
            <button
                onClick={onSignUp}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
            >
                Sign up to Edit
            </button>
        </div>
    </div>
);