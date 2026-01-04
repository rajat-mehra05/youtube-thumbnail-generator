'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateImageId, generateLayerId } from '@/lib/utils/id-generator';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIThumbnailGenerator } from '@/components/create/AIThumbnailGenerator';
import { AuthWallModal } from '@/components/auth/AuthWallModal';
import { getCanvasDimensions } from '@/lib/constants';
import { getOrCreateGuestSession, getRemainingGenerations, hasRemainingGenerations, incrementGuestGenerations, updateGuestSessionCanvas } from '@/lib/guest-session';
import { syncGuestSession } from '@/lib/actions/guest-session';
import type { CanvasState, ImageLayer, TextLayer, CanvasLayer } from '@/types';

interface TextSuggestions {
  headline: string;
  subheadline: string;
}

export default function TryPage() {
  const router = useRouter();
  const [generationsRemaining, setGenerationsRemaining] = useState(() => getRemainingGenerations());
  const [showAuthWall, setShowAuthWall] = useState(false);

  const sessionId = useMemo(() => {
    const session = getOrCreateGuestSession();
    return session.sessionId;
  }, []);

  const handleThumbnailGenerated = async (
    backgroundUrl: string,
    textSuggestions?: TextSuggestions,
    colorScheme?: string[]
  ) => {
    // Increment generations used (only called after successful generation)
    incrementGuestGenerations();
    setGenerationsRemaining(getRemainingGenerations());

    // Get updated session
    const session = getOrCreateGuestSession();

    // Create canvas state for guest
    const canvasState = createCanvasState(backgroundUrl, textSuggestions, colorScheme);

    // Store canvas state in guest session
    updateGuestSessionCanvas(canvasState, textSuggestions || undefined);

    // Sync session to server (with image URL)
    await syncGuestSession(session.sessionId, session.generationsUsed, backgroundUrl);

    // Redirect to guest editor
    toast.success('Thumbnail generated! Opening editor...');
    router.push('/editor/guest');
  };

  const createCanvasState = (
    backgroundUrl: string,
    textSuggestions?: TextSuggestions,
    colorScheme?: string[]
  ): CanvasState => {
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions('16:9');
    const layers: CanvasLayer[] = [];

    // Add background image layer
    const bgLayer: ImageLayer = {
      id: generateImageId(),
      type: 'image',
      name: 'Background',
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      zIndex: 0,
      visible: true,
      locked: true,
      src: backgroundUrl,
    };
    layers.push(bgLayer);

    // Get text colors from color scheme or use defaults
    const textFill = colorScheme?.[2] || '#FFFFFF';
    const textStroke = colorScheme?.[3] || '#000000';

    // Add headline text layer if suggestions provided
    if (textSuggestions?.headline) {
      const headlineLayer: TextLayer = {
        id: generateLayerId(),
        type: 'text',
        name: 'Headline',
        x: canvasWidth / 2 - 400,
        y: canvasHeight / 2 - 60,
        width: 800,
        height: 120,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        zIndex: 1,
        visible: true,
        locked: false,
        text: textSuggestions.headline,
        fontSize: 72,
        fontFamily: 'Impact',
        fontStyle: 'bold',
        fill: textFill,
        stroke: textStroke,
        strokeWidth: 4,
        align: 'center',
        verticalAlign: 'middle',
      };
      layers.push(headlineLayer);
    }

    // Add subheadline text layer if provided
    if (textSuggestions?.subheadline) {
      const subheadlineLayer: TextLayer = {
        id: generateLayerId(),
        type: 'text',
        name: 'Subheadline',
        x: canvasWidth / 2 - 300,
        y: canvasHeight / 2 + 60,
        width: 600,
        height: 60,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        zIndex: 2,
        visible: true,
        locked: false,
        text: textSuggestions.subheadline,
        fontSize: 36,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        fill: textFill,
        stroke: textStroke,
        strokeWidth: 2,
        align: 'center',
        verticalAlign: 'middle',
      };
      layers.push(subheadlineLayer);
    }

    // Create canvas state
    return {
      width: canvasWidth,
      height: canvasHeight,
      layers,
    };
  };

  // Intercept generation attempts - show auth wall if no generations left
  const handleBeforeGenerate = (): boolean => {
    if (!hasRemainingGenerations()) {
      setShowAuthWall(true);
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showGuestBanner generationsRemaining={generationsRemaining} />

      <main className="flex-1">
        <AIThumbnailGenerator
          onThumbnailGenerated={handleThumbnailGenerated}
          sessionId={sessionId || undefined}
          onBeforeGenerate={handleBeforeGenerate}
        />
      </main>

      <Footer />

      <AuthWallModal
        open={showAuthWall}
        onOpenChange={setShowAuthWall}
        title="Sign up to continue"
        description="You've used your free generation. Create an account to generate unlimited thumbnails and access the editor."
      />
    </div>
  );
}
