'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateImageId, generateLayerId } from '@/lib/utils/id-generator';
import { handleAsyncApiCall } from '@/lib/utils/api-response';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIThumbnailGenerator } from '@/components/create/AIThumbnailGenerator';
import { ROUTES, getCanvasDimensions } from '@/lib/constants';
import { useUser } from '@/hooks';
import { createProject } from '@/lib/actions/projects';
import type { CanvasState, ImageLayer, TextLayer, CanvasLayer } from '@/types';

interface TextSuggestions {
  headline: string;
  subheadline: string;
}

export default function CreatePage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const handleThumbnailGenerated = async (
    backgroundUrl: string,
    textSuggestions?: TextSuggestions,
    colorScheme?: string[]
  ) => {
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
          toast.error(err);
        },
      }
    );
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!user) {
    router.push(ROUTES.LOGIN);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <AIThumbnailGenerator
          onThumbnailGenerated={handleThumbnailGenerated}
          userId={user.id}
        />
      </main>
      <Footer />
    </div>
  );
}
