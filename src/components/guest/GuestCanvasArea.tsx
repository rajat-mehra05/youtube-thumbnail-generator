'use client';

import nextDynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PreviewModeCard } from './PreviewModeCard';
import type { CanvasState } from '@/types';

const Canvas = nextDynamic(
    () => import('@/components/editor/Canvas').then((mod) => mod.Canvas),
    { ssr: false, loading: () => <CanvasLoading /> }
);

const CanvasLoading = () => (
    <div className="flex-1 flex items-center justify-center bg-muted/30">
        <LoadingSpinner size="lg" />
    </div>
);

interface GuestCanvasAreaProps {
    canvasState: CanvasState;
    onRequireAuth: () => void;
}

export const GuestCanvasArea = ({ canvasState, onRequireAuth }: GuestCanvasAreaProps) => (
    <div className="flex-1 flex items-center justify-center bg-[#2a2a35] overflow-auto relative p-4">
        {/* Checkerboard pattern background */}
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `
          linear-gradient(45deg, #808080 25%, transparent 25%),
          linear-gradient(-45deg, #808080 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #808080 75%),
          linear-gradient(-45deg, transparent 75%, #808080 75%)
        `,
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
            }}
        />

        {/* Canvas - Read-only mode */}
        <div className="relative z-10 shadow-2xl rounded-lg overflow-hidden">
            <Canvas
                canvasState={canvasState}
                selectedLayerId={null}
                onSelectLayer={() => { }}
                onUpdateLayer={onRequireAuth}
                previewMode={true}
            />
        </div>

        {/* Preview Mode Overlay */}
        <PreviewModeCard onSignUp={onRequireAuth} />

        {/* Zoom indicator */}
        <div className="absolute bottom-6 left-6 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white/70 font-medium z-30">
            {canvasState.width} × {canvasState.height} • 100%
        </div>
    </div>
);