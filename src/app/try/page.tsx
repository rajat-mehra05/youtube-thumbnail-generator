'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GuestAIForm, TrialUsedCard, ConceptPreview } from '@/components/guest';
import { AuthWallModal } from '@/components/auth/AuthWallModal';
import { ROUTES } from '@/lib/constants';
import { getOrCreateGuestSession, getRemainingGenerations, hasRemainingGenerations, incrementGuestGenerations, storeGeneratedConcept } from '@/lib/guest-session';
import { syncGuestSession } from '@/lib/actions/guest-session';
import { generateConcepts } from '@/lib/actions/ai-generation';
import type { TemplateCategory, EmotionType, StylePreference, ConceptData } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { InlineError } from '@/components/ui/error-message';

export default function TryPage() {
  const [loading, setLoading] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState(1);
  const [showAuthWall, setShowAuthWall] = useState(false);
  const [generatedConcepts, setGeneratedConcepts] = useState<ConceptData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrCreateGuestSession();
    setGenerationsRemaining(getRemainingGenerations());
  }, []);

  const handleSubmit = async (data: { videoTitle: string; topic: TemplateCategory; emotion: EmotionType; style: StylePreference }) => {
    if (!hasRemainingGenerations()) { setShowAuthWall(true); return; }

    setLoading(true);
    setError(null);

    try {
      const session = getOrCreateGuestSession();
      const result = await generateConcepts({ videoTitle: data.videoTitle, topic: data.topic, emotion: data.emotion, style: data.style, sessionId: session.sessionId });

      if (!result.success || !result.concepts) throw new Error(result.error || 'Failed to generate concepts');

      incrementGuestGenerations();
      setGenerationsRemaining(getRemainingGenerations());
      setGeneratedConcepts(result.concepts);
      storeGeneratedConcept(uuidv4());
      await syncGuestSession(session.sessionId, session.generationsUsed + 1, result.concepts[0]);
      setShowAuthWall(true);
    } catch (err) {
      console.error('Generation error:', err);
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
            <p className="text-muted-foreground">Describe your video and let AI create a stunning thumbnail concept.</p>
          </div>

          {noGenerationsLeft && !generatedConcepts && <TrialUsedCard />}

          {loading && (
            <Card><CardContent className="py-12"><LoadingCard message="Creating your thumbnail concept... This may take a moment." /></CardContent></Card>
          )}

          {!noGenerationsLeft && !generatedConcepts && !loading && (
            <Card>
              <CardHeader>
                <CardTitle>Tell us about your video</CardTitle>
                <CardDescription>Fill in the details and we&apos;ll generate a thumbnail concept for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <GuestAIForm onSubmit={handleSubmit} loading={loading} disabled={noGenerationsLeft} />
                {error && <div className="mt-4"><InlineError message={error} /></div>}
              </CardContent>
            </Card>
          )}

          {generatedConcepts && <ConceptPreview concepts={generatedConcepts} onSignUp={() => setShowAuthWall(true)} />}
        </div>
      </main>

      <Footer />

      <AuthWallModal
        open={showAuthWall}
        onOpenChange={setShowAuthWall}
        title={generatedConcepts ? 'Your thumbnails are ready!' : 'Sign up to continue'}
        description={generatedConcepts ? 'Create an account to access the editor and download your thumbnails.' : 'You need an account to generate more thumbnails.'}
      />
    </div>
  );
}
