'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/utils/logger';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GuestAIForm, TrialUsedCard } from '@/components/guest';
import { AuthWallModal } from '@/components/auth/AuthWallModal';
import { ROUTES } from '@/lib/constants';
import { getOrCreateGuestSession, getRemainingGenerations, hasRemainingGenerations, incrementGuestGenerations } from '@/lib/guest-session';
import { syncGuestSession } from '@/lib/actions/guest-session';
import { generateImageAndStore } from '@/lib/actions/ai-generation';
import type { TemplateCategory, EmotionType, StylePreference, ImageStyle } from '@/types';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { InlineError } from '@/components/ui/error-message';

// Map StylePreference to ImageStyle for backward compatibility
const styleToImageStyle: Record<StylePreference, ImageStyle> = {
  bold_text: 'cinematic',
  minimal: 'educational',
  colorful: 'digital_art',
  dark: 'cinematic',
  professional: 'educational',
};

export default function TryPage() {
  const [loading, setLoading] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState(1);
  const [showAuthWall, setShowAuthWall] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrCreateGuestSession();
    setGenerationsRemaining(getRemainingGenerations());
  }, []);

  const handleSubmit = async (data: { videoTitle: string; topic: TemplateCategory; emotion: EmotionType; style: StylePreference }) => {
    if (!hasRemainingGenerations()) {
      setShowAuthWall(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const session = getOrCreateGuestSession();

      // Map style preference to image style
      const imageStyle = styleToImageStyle[data.style] || 'cinematic';

      // Generate the image directly
      const result = await generateImageAndStore({
        prompt: data.videoTitle,
        imageStyle,
        emotion: data.emotion,
        sessionId: session.sessionId,
      });

      if (!result.success || !result.backgroundUrl) {
        throw new Error(result.error || 'Failed to generate thumbnail');
      }

      incrementGuestGenerations();
      setGenerationsRemaining(getRemainingGenerations());
      setGeneratedImageUrl(result.backgroundUrl);

      // Sync session to server
      await syncGuestSession(session.sessionId, session.generationsUsed + 1);

      // Show auth wall to prompt signup
      setShowAuthWall(true);
    } catch (err) {
      logger.error('Generation error:', { error: err });
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const noGenerationsLeft = generationsRemaining === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showGuestBanner generationsRemaining={generationsRemaining} />

      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              ← Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Try AI Thumbnail Generator</h1>
            <p className="text-muted-foreground">Describe your video and let AI create a stunning thumbnail.</p>
          </div>

          {noGenerationsLeft && !generatedImageUrl && <TrialUsedCard />}

          {loading && (
            <Card>
              <CardContent className="py-12">
                <LoadingCard message="Creating your thumbnail... This may take up to 30 seconds." />
              </CardContent>
            </Card>
          )}

          {!noGenerationsLeft && !generatedImageUrl && !loading && (
            <Card>
              <CardHeader>
                <CardTitle>Tell us about your video</CardTitle>
                <CardDescription>Fill in the details and we&apos;ll generate a thumbnail for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <GuestAIForm onSubmit={handleSubmit} loading={loading} disabled={noGenerationsLeft} />
                {error && <div className="mt-4"><InlineError message={error} /></div>}
              </CardContent>
            </Card>
          )}

          {/* Generated Image Preview */}
          {generatedImageUrl && (
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-center text-xl">✨ Your Thumbnail Is Ready!</CardTitle>
                <CardDescription className="text-center">Sign up to access the editor and customize your thumbnail.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg overflow-hidden border border-border">
                  <div className="aspect-video relative">
                    <Image
                      src={generatedImageUrl}
                      alt="Generated thumbnail"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => setShowAuthWall(true)}
                    className="w-full max-w-sm h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                  >
                    Sign Up to Edit & Download →
                  </Button>
                  <p className="text-sm text-muted-foreground">Your thumbnail will be saved to your account</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      <AuthWallModal
        open={showAuthWall}
        onOpenChange={setShowAuthWall}
        title={generatedImageUrl ? 'Your thumbnail is ready!' : 'Sign up to continue'}
        description={generatedImageUrl ? 'Create an account to access the editor and download your thumbnail.' : 'You need an account to generate more thumbnails.'}
      />
    </div>
  );
}
