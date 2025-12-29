'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Wand2 } from 'lucide-react';
import { logger } from '@/lib/utils/logger';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { generateThumbnailComplete } from '@/lib/actions/ai-generation';
import { IMAGE_STYLES, ASPECT_RATIOS, EMOTIONS } from '@/lib/constants';
import type { ImageStyle, AspectRatio, EmotionType } from '@/types';

interface TextSuggestions {
  headline: string;
  subheadline: string;
}

interface AIMagicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackgroundGenerated: (
    imageUrl: string,
    textSuggestions?: TextSuggestions,
    colorScheme?: string[]
  ) => void;
  userId?: string;
}

export const AIMagicModal = ({
  open,
  onOpenChange,
  onBackgroundGenerated,
  userId,
}: AIMagicModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('educational');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [emotion, setEmotion] = useState<EmotionType>('excited');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    try {
      // Use the new complete thumbnail generation
      const result = await generateThumbnailComplete({
        prompt: prompt.trim(),
        imageStyle,
        emotion,
        aspectRatio,
        userId,
      });

      if (!result.success || !result.backgroundUrl) {
        throw new Error(result.error || 'Failed to generate thumbnail');
      }

      toast.success('Thumbnail generated successfully!');

      // Pass back the background URL, text suggestions, and color scheme
      onBackgroundGenerated(
        result.backgroundUrl,
        result.textSuggestions,
        result.colorScheme
      );
      onOpenChange(false);

      // Reset form
      setPrompt('');
      setImageStyle('educational');
      setAspectRatio('16:9');
      setEmotion('excited');
    } catch (error) {
      logger.error('AI generation error:', { error });
      toast.error(error instanceof Error ? error.message : 'Failed to generate thumbnail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>AI Thumbnail Generator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 max-h-[calc(90vh-100px)] overflow-y-auto pr-2">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-base font-semibold flex items-center gap-1">
              Video Title / Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="prompt"
              placeholder="Enter your video title or describe your thumbnail...

Examples:
• Next.js Crash Course for Beginners
• 10 JavaScript Tips You Need to Know
• My Morning Routine 2024"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              rows={5}
              className="w-full rounded-lg border-2 border-input bg-background px-4 py-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all"
              aria-label="Video title or thumbnail description"
            />
            <p className="text-xs text-muted-foreground pl-1">
              Enter your video title - we&apos;ll create relevant visuals automatically.
            </p>
          </div>

          {/* Image Style */}
          <div className="space-y-2">
            <Label htmlFor="imageStyle" className="text-base font-semibold flex items-center gap-1">
              Image Style <span className="text-red-500">*</span>
            </Label>
            <Select value={imageStyle} onValueChange={(value) => setImageStyle(value as ImageStyle)} disabled={loading}>
              <SelectTrigger id="imageStyle" className="h-12 w-full px-4">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="py-2">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{style.label}</span>
                      <span className="text-xs text-muted-foreground">{style.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label htmlFor="aspectRatio" className="text-base font-semibold flex items-center gap-1">
              Aspect Ratio <span className="text-red-500">*</span>
            </Label>
            <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as AspectRatio)} disabled={loading}>
              <SelectTrigger id="aspectRatio" className="h-12 w-full px-4">
                <SelectValue placeholder="Select ratio" />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value} className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{ratio.label}</span>
                      <span className="text-xs text-muted-foreground">- {ratio.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Emotion/Vibe */}
          <div className="space-y-2">
            <Label htmlFor="emotion" className="text-base font-semibold flex items-center gap-1">
              Mood / Vibe <span className="text-red-500">*</span>
            </Label>
            <Select value={emotion} onValueChange={(value) => setEmotion(value as EmotionType)} disabled={loading}>
              <SelectTrigger id="emotion" className="h-12 w-full px-4">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {EMOTIONS.map((em) => (
                  <SelectItem key={em.value} value={em.value} className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{em.emoji}</span>
                      <span>{em.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
              aria-label="Generate thumbnail"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating... (up to 30s)
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Thumbnail
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
