'use client';

import { ReactNode } from 'react';
import { ReadOnlyOverlay } from './ReadOnlyOverlay';

interface DisabledEditorPanelProps {
    children: ReactNode;
    onSignUp?: () => void;
}

export const DisabledEditorPanel = ({ children, onSignUp }: DisabledEditorPanelProps) => (
    <div className="relative">
        {children}
        <ReadOnlyOverlay onSignUp={onSignUp} />
    </div>
);