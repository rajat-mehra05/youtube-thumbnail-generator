'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getGuestSession } from '@/lib/guest-session';
import { useCanvasState } from '@/hooks/useCanvasState';
import { LeftSidebar } from '@/components/editor/LeftSidebar';
import { TopBar } from '@/components/editor/TopBar';
import { RightPanel } from '@/components/editor/RightPanel';
import { AuthWallModal } from '@/components/auth/AuthWallModal';
import { ROUTES } from '@/lib/constants';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { logger } from '@/lib/utils/logger';
import {
    GuestCanvasArea,
    DisabledEditorPanel,
} from '@/components/guest';

export default function GuestEditorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showAuthWall, setShowAuthWall] = useState(false);

    const {
        canvasState,
        loadState,
    } = useCanvasState();

    // Compute initial project name from session (outside effect to avoid setState in effect)
    const initialProjectName = useMemo(() => {
        const session = getGuestSession();
        return session?.textSuggestions?.headline
            ? `${session.textSuggestions.headline} Thumbnail`
            : 'My Thumbnail';
    }, []);

    const [projectName, setProjectName] = useState(initialProjectName);

    // Load guest session data
    useEffect(() => {
        const session = getGuestSession();

        if (!session || !session.canvasState) {
            logger.error('No thumbnail found. Please generate one first.');
            router.push(ROUTES.TRY);
            return;
        }

        // Load canvas state
        loadState(session.canvasState);

        // Defer loading state update to avoid synchronous setState in effect
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [router, loadState]);

    // Single handler for all read-only actions - shows auth wall
    const handleRequireAuth = () => {
        setShowAuthWall(true);
    };

    // Wrapper handlers that match expected signatures but block guest actions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleMoveLayer = (_id: string, _direction: 'up' | 'down') => {
        handleRequireAuth();
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleToggleVisibility = (_id: string) => {
        handleRequireAuth();
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleToggleLock = (_id: string) => {
        handleRequireAuth();
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            {/* Top Bar - Read-only mode */}
            <TopBar
                projectName={projectName}
                onNameChange={setProjectName}
                onSave={handleRequireAuth}
                onExport={handleRequireAuth}
                saving={false}
                exporting={false}
                selectedLayer={null}
                onUpdateLayer={handleRequireAuth}
                onDeleteLayer={handleRequireAuth}
                onDuplicateLayer={handleRequireAuth}
            />

            {/* Main Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Disabled */}
                <DisabledEditorPanel onSignUp={handleRequireAuth}>
                    <LeftSidebar
                        onAddLayer={handleRequireAuth}
                        onOpenAI={handleRequireAuth}
                    />
                </DisabledEditorPanel>

                {/* Canvas Area */}
                <GuestCanvasArea
                    canvasState={canvasState}
                    onRequireAuth={handleRequireAuth}
                />

                {/* Right Panel - Disabled */}
                <DisabledEditorPanel onSignUp={handleRequireAuth}>
                    <RightPanel
                        layers={canvasState.layers}
                        selectedLayerId={null}
                        selectedLayer={null}
                        onSelectLayer={() => { }}
                        onUpdateLayer={handleRequireAuth}
                        onDeleteLayer={handleRequireAuth}
                        onMoveLayer={handleMoveLayer}
                        onToggleVisibility={handleToggleVisibility}
                        onToggleLock={handleToggleLock}
                    />
                </DisabledEditorPanel>
            </div>

            {/* Auth Wall Modal */}
            <AuthWallModal
                open={showAuthWall}
                onOpenChange={setShowAuthWall}
                title="Sign up to edit your thumbnail"
                description="Create a free account to unlock full editing features, save your projects, and export your designs."
            />
        </div>
    );
}