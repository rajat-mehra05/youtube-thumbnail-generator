'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ROUTES } from '@/lib/constants';
import { useUser } from '@/hooks';
import { createProject } from '@/lib/actions/projects';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ImageDropzone } from '@/components/upload';

export default function CreateUploadPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [projectName, setProjectName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select an image'); return; }
    setLoading(true);
    try {
      const result = await createProject({ name: projectName || 'Uploaded Thumbnail' });
      if (!result.success || !result.project) throw new Error(result.error || 'Failed to create project');
      router.push(ROUTES.EDITOR(result.project.id));
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to create project');
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