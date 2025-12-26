'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ConceptData } from '@/types';

interface ConceptPreviewProps {
  concepts: ConceptData[];
  onSignUp: () => void;
}

export const ConceptPreview = ({ concepts, onSignUp }: ConceptPreviewProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader>
      <CardTitle className="text-center text-xl">✨ Your Thumbnail Concepts Are Ready!</CardTitle>
      <CardDescription className="text-center">Sign up to access the editor and customize your thumbnail.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {concepts.map((concept, index) => (
          <div
            key={index}
            className="aspect-video rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 relative overflow-hidden blur-sm"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-xs font-bold text-white/80 line-clamp-2">{concept.headline}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={onSignUp}
          className="w-full max-w-sm h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
        >
          Sign Up to Access →
        </Button>
        <p className="text-sm text-muted-foreground">Your concepts will be saved to your account</p>
      </div>
    </CardContent>
  </Card>
);
