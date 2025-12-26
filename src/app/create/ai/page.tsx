'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIForm } from '@/components/create/AIForm';
import { ConceptSelector } from '@/components/create/ConceptSelector';
import { ROUTES } from '@/lib/constants';
import { useUser } from '@/hooks';
import { generateConcepts } from '@/lib/actions/ai-generation';
import { createProject, updateProject } from '@/lib/actions/projects';
import type { TemplateCategory, EmotionType, StylePreference, ConceptData } from '@/types';
import { LoadingCard } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

export default function CreateAIPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [step, setStep] = useState<'form' | 'select'>('form');
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState<ConceptData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    videoTitle: string;
    topic: TemplateCategory;
    emotion: EmotionType;
    style: StylePreference;
  } | null>(null);

  const handleFormSubmit = async (data: {
    videoTitle: string;
    topic: TemplateCategory;
    emotion: EmotionType;
    style: StylePreference;
  }) => {
    setLoading(true);
    setError(null);
    setFormData(data);

    try {
      const result = await generateConcepts({
        videoTitle: data.videoTitle,
        topic: data.topic,
        emotion: data.emotion,
        style: data.style,
        userId: user?.id,
      });

      if (!result.success || !result.concepts) {
        throw new Error(result.error || 'Failed to generate concepts');
      }

      setConcepts(result.concepts);
      setStep('select');
      toast.success('Concepts generated!');
    } catch (err) {
      console.error('Generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate concepts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!formData) return;
    await handleFormSubmit(formData);
  };

  const handleSelectConcept = async (concept: ConceptData) => {
    setLoading(true);

    try {
      // Create a new project
      const projectResult = await createProject({
        name: concept.headline || formData?.videoTitle || 'AI Generated Thumbnail',
        video_title: formData?.videoTitle,
      });

      if (!projectResult.success || !projectResult.project) {
        throw new Error(projectResult.error || 'Failed to create project');
      }

      // Navigate to editor
      router.push(ROUTES.EDITOR(projectResult.project.id));
    } catch (error) {
      console.error('Project creation error:', error);
      toast.error('Failed to create project');
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Back link */}
          <Link
            href={ROUTES.CREATE}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            ← Back to Create
          </Link>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={`flex items-center gap-2 ${step === 'form' ? 'text-violet-600' : 'text-muted-foreground'
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'form'
                  ? 'bg-violet-500 text-white'
                  : 'bg-muted text-muted-foreground'
                  }`}
              >
                1
              </div>
              <span className="hidden sm:inline">Describe</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div
              className={`flex items-center gap-2 ${step === 'select' ? 'text-violet-600' : 'text-muted-foreground'
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'select'
                  ? 'bg-violet-500 text-white'
                  : 'bg-muted text-muted-foreground'
                  }`}
              >
                2
              </div>
              <span className="hidden sm:inline">Select</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="py-12">
                <LoadingCard message="Generating AI concepts... This may take up to 30 seconds." />
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card>
              <CardContent className="py-6">
                <ErrorMessage
                  title="Generation Failed"
                  message={error}
                  onRetry={() => {
                    setError(null);
                    if (formData) handleFormSubmit(formData);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 1: Form */}
          {step === 'form' && !loading && !error && (
            <Card>
              <CardHeader>
                <CardTitle>Tell us about your video</CardTitle>
                <CardDescription>
                  Provide details and AI will generate thumbnail concepts for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIForm onSubmit={handleFormSubmit} loading={loading} />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Concept */}
          {step === 'select' && concepts && !loading && (
            <Card>
              <CardHeader>
                <CardTitle>Choose a concept</CardTitle>
                <CardDescription>
                  Select the concept you like best. You can customize it in the editor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConceptSelector
                  concepts={concepts}
                  onSelect={handleSelectConcept}
                  onRegenerate={handleRegenerate}
                  loading={loading}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
