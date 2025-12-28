'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Sparkles, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { generateImageAndStore } from '@/lib/actions/ai-generation';
import { IMAGE_STYLES, ASPECT_RATIOS, EMOTIONS } from '@/lib/constants';
import type { ImageStyle, AspectRatio, EmotionType } from '@/types';

interface AIMagicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackgroundGenerated: (imageUrl: string) => void;
  userId?: string;
}

export const AIMagicModal = ({
  open,
  onOpenChange,
  onBackgroundGenerated,
  userId,
}: AIMagicModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('cinematic');
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
      // Build enhanced prompt with style and emotion context
      const styleInstructions: Record<ImageStyle, string> = {
        cinematic: 'PHOTOREALISTIC cinematic film photography, professional DSLR camera, dramatic lighting, movie-quality composition',
        '3d_scene': '3D rendered scene, Unreal Engine quality, photorealistic 3D graphics',
        anime: 'High-quality anime illustration, vibrant colors, professional anime art',
        artistic: 'Professional artistic painting, fine art quality',
        digital_art: 'Modern professional digital illustration',
        educational: 'Clean professional educational design',
        fantasy_world: 'Epic fantasy or sci-fi scene, cinematic concept art',
        prototyping: 'Clean modern UI/UX mockup style',
        auto: 'Professional high-quality visuals',
      };

      const emotionContext: Record<EmotionType, string> = {
        excited: 'energetic, vibrant, dynamic atmosphere',
        shocked: 'dramatic, intense, surprising elements',
        curious: 'mysterious, intriguing, thought-provoking mood',
        happy: 'bright, cheerful, positive vibes',
        serious: 'professional, focused, impactful tone',
      };

      const enhancedPrompt = `${prompt}. Style: ${styleInstructions[imageStyle]}. Mood: ${emotionContext[emotion]}. Professional YouTube thumbnail quality, ultra-detailed, dramatic composition, no text or letters in image.`;

      const result = await generateImageAndStore({
        prompt: enhancedPrompt,
        aspectRatio,
        userId,
      });

      if (!result.success || !result.backgroundUrl) {
        throw new Error(result.error || 'Failed to generate background');
      }

      toast.success('Background generated!');
      onBackgroundGenerated(result.backgroundUrl);
      onOpenChange(false);

      // Reset form
      setPrompt('');
      setImageStyle('cinematic');
      setAspectRatio('16:9');
      setEmotion('excited');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate background');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pr-8 hidden">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-violet-500" />
            AI Thumbnail Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2 max-h-[calc(90vh-180px)] overflow-y-auto pr-2">
          {/* Prompt Input */}
          <div className="space-y-3">
            <Label htmlFor="prompt" className="text-base font-semibold flex items-center gap-1">
              Thumbnail Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="prompt"
              placeholder="Describe what you want in your thumbnail... e.g., A person standing on a mountain peak at sunset with dramatic clouds, vibrant orange and purple sky"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              rows={5}
              className="w-full rounded-lg border-2 border-input bg-background px-4 py-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all"
            />
            <p className="text-xs text-muted-foreground pl-1">
              Be specific about subjects, colors, mood, and composition you want.
            </p>
          </div>

          {/* Image Style */}
          <div className="space-y-3">
            <Label htmlFor="imageStyle" className="text-base font-semibold flex items-center gap-1">
              Image Style <span className="text-red-500">*</span>
            </Label>
            <Select value={imageStyle} onValueChange={(value) => setImageStyle(value as ImageStyle)} disabled={loading}>
              <SelectTrigger id="imageStyle" className="h-14 w-full px-4">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="py-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium">{style.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-3">
            <Label htmlFor="aspectRatio" className="text-base font-semibold flex items-center gap-1">
              Aspect Ratio <span className="text-red-500">*</span>
            </Label>
            <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as AspectRatio)} disabled={loading}>
              <SelectTrigger id="aspectRatio" className="h-14 w-full px-4">
                <SelectValue placeholder="Select ratio" />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value} className="py-3">
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
          <div className="space-y-3">
            <Label htmlFor="emotion" className="text-base font-semibold flex items-center gap-1">
              Emotion / Vibe <span className="text-red-500">*</span>
            </Label>
            <Select value={emotion} onValueChange={(value) => setEmotion(value as EmotionType)} disabled={loading}>
              <SelectTrigger id="emotion" className="h-14 w-full px-4">
                <SelectValue placeholder="Select emotion" />
              </SelectTrigger>
              <SelectContent>
                {EMOTIONS.map((em) => (
                  <SelectItem key={em.value} value={em.value} className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{em.emoji}</span>
                      <span>{em.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Prompt Ideas */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-muted-foreground">Quick Ideas</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Person standing on mountain peak at sunset',
                'Vibrant neon city skyline at night',
                'Epic fantasy landscape with dramatic clouds',
                'Modern workspace with laptop and coffee',
                'Colorful abstract explosion of energy',
                'Mysterious forest with misty atmosphere',
              ].map((idea) => (
                <button
                  key={idea}
                  onClick={() => handleQuickPrompt(idea)}
                  disabled={loading}
                  className="p-3 text-sm text-left rounded-lg border border-border hover:border-violet-500/60 hover:bg-violet-500/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
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

