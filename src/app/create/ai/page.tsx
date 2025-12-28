'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIMagicModal } from '@/components/editor/AIMagicModal';
import { ROUTES, getCanvasDimensions } from '@/lib/constants';
import { useUser } from '@/hooks';
import { createProject } from '@/lib/actions/projects';
import type { CanvasState, ImageLayer } from '@/types';

export default function CreateAIPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackgroundGenerated = async (backgroundUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      // Create thumbnail project with just the background
      await createThumbnailProject(backgroundUrl);
    } catch (err) {
      console.error('Project creation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create thumbnail';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const createThumbnailProject = async (backgroundUrl: string) => {
    try {
      // Use default 16:9 dimensions for the canvas
      const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions('16:9');

      // Build canvas state with just the background layer
      const layers: ImageLayer[] = [];

      // Add background image layer
      const bgLayer: ImageLayer = {
        id: uuidv4(),
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

      // Create canvas state with background only
      const canvasState: CanvasState = {
        width: canvasWidth,
        height: canvasHeight,
        layers,
      };

      // Create project with the background
      const projectResult = await createProject({
        name: 'AI Generated Background',
        video_title: '',
        canvas_state: canvasState,
      });

      if (!projectResult.success || !projectResult.project) {
        throw new Error(projectResult.error || 'Failed to create project');
      }

      toast.success('Background created! Opening editor...');
      router.push(ROUTES.EDITOR(projectResult.project.id));
    } catch (error) {
      console.error('Project creation error:', error);
      toast.error('Failed to create project');
      throw error;
    } finally {
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

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Generate AI Thumbnail
            </h1>
            <p className="text-muted-foreground">
              Describe what you want and let AI create a stunning background
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Creating your thumbnail... This may take up to 30 seconds.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card>
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
                  >
                    Try Again
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Magic Modal */}
          <AIMagicModal
            open={!loading && !error}
            onOpenChange={(open) => {
              if (!open) {
                router.push(ROUTES.CREATE);
              }
            }}
            onBackgroundGenerated={handleBackgroundGenerated}
            userId={user?.id}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
