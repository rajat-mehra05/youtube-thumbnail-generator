'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateProjectId, generateImageId } from '@/lib/utils/id-generator';
import { logger } from '@/lib/utils/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ROUTES, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { useUser } from '@/hooks';
import { createProject } from '@/lib/actions/projects';
import { createClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ImageDropzone } from '@/components/upload';
import type { CanvasState, ImageLayer } from '@/types';

export default function CreateUploadPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [projectName, setProjectName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // Generate a unique project ID for the file path
      const tempProjectId = generateProjectId();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${tempProjectId}/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get signed URL for the uploaded image
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('user-uploads')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw signedUrlError || new Error('Failed to get signed URL');
      }

      const imageUrl = signedUrlData.signedUrl;

      // Get image dimensions
      const img = new Image();
      img.src = preview || URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      // Calculate dimensions to fit canvas while maintaining aspect ratio
      const aspectRatio = img.width / img.height;
      let layerWidth = CANVAS_WIDTH;
      let layerHeight = CANVAS_WIDTH / aspectRatio;

      if (layerHeight > CANVAS_HEIGHT) {
        layerHeight = CANVAS_HEIGHT;
        layerWidth = CANVAS_HEIGHT * aspectRatio;
      }

      // Center the image on canvas
      const x = (CANVAS_WIDTH - layerWidth) / 2;
      const y = (CANVAS_HEIGHT - layerHeight) / 2;

      // Create initial canvas state with the uploaded image as background
      const imageLayer: ImageLayer = {
        id: generateImageId(),
        type: 'image',
        name: 'Background Image',
        x,
        y,
        width: layerWidth,
        height: layerHeight,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        zIndex: 0,
        visible: true,
        locked: false,
        src: imageUrl,
      };

      const initialCanvasState: CanvasState = {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        layers: [imageLayer],
      };

      // Create the project with the initial canvas state
      const result = await createProject({
        name: projectName || 'Uploaded Thumbnail',
        canvas_state: initialCanvasState,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create project');
      }

      toast.success('Project created!');
      router.push(ROUTES.EDITOR(result.data.id));
    } catch (error) {
      logger.error('Upload error:', { error });
      toast.error('Failed to create project. Make sure storage is set up.');
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Link href={ROUTES.CREATE} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">← Back to Create</Link>
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Image</CardTitle>
              <CardDescription>Start with your own image and customize it in the editor.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name (optional)</Label>
                  <Input id="projectName" placeholder="My Awesome Thumbnail" value={projectName} onChange={(e) => setProjectName(e.target.value)} disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <ImageDropzone preview={preview} onFileChange={(f, p) => { setFile(f); setPreview(p); }} disabled={loading} />
                </div>
                <Button type="submit" disabled={!file || loading} className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                  {loading ? <span className="flex items-center gap-2"><LoadingSpinner size="sm" />Creating project...</span> : 'Continue to Editor →'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}