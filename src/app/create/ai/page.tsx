'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateImageId, generateLayerId } from '@/lib/utils/id-generator';
import { handleAsyncApiCall } from '@/lib/utils/api-response';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIMagicModal } from '@/components/editor/AIMagicModal';
import { ROUTES, getCanvasDimensions } from '@/lib/constants';
import { useUser } from '@/hooks';
import { createProject } from '@/lib/actions/projects';
import type { CanvasState, ImageLayer, TextLayer, CanvasLayer } from '@/types';

interface TextSuggestions {
  headline: string;
  subheadline: string;
}

export default function CreateAIPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackgroundGenerated = async (
    backgroundUrl: string,
    textSuggestions?: TextSuggestions,
    colorScheme?: string[]
  ) => {
    setError(null);
    const success = await createThumbnailProject(backgroundUrl, textSuggestions, colorScheme);
    if (!success) {
      return;
    }
  };

  const createThumbnailProject = async (
    backgroundUrl: string,
    textSuggestions?: TextSuggestions,
    colorScheme?: string[]
  ): Promise<boolean> => {
    return await handleAsyncApiCall(
      async () => {
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
        const canvasState: CanvasState = {
          width: canvasWidth,
          height: canvasHeight,
          layers,
        };

        // Create project with a meaningful name
        const projectName = textSuggestions?.headline
          ? `${textSuggestions.headline} Thumbnail`
          : 'AI Generated Thumbnail';

        return await createProject({
          name: projectName,
          video_title: textSuggestions?.headline || '',
          canvas_state: canvasState,
        });
      },
      {
        onSuccess: (project) => {
          toast.success('Thumbnail created! Opening editor...');
          router.push(ROUTES.EDITOR(project.id));
        },
        onError: (err) => {
          setError(err);
        },
        setLoading,
      }
    );
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
              Enter your video title and let AI create a stunning thumbnail
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
                    type="button"
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
