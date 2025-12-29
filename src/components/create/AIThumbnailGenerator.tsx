'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logger } from '@/lib/utils/logger';
import { generateThumbnailComplete } from '@/lib/actions/ai-generation';
import { IMAGE_STYLES, ASPECT_RATIOS } from '@/lib/constants';
import type { ImageStyle, AspectRatio } from '@/types';

interface TextSuggestions {
  headline: string;
  subheadline: string;
}

interface AIThumbnailGeneratorProps {
  onThumbnailGenerated: (
    backgroundUrl: string,
    textSuggestions?: TextSuggestions,
    colorScheme?: string[]
  ) => void;
  userId?: string;
  sessionId?: string;
  onBeforeGenerate?: () => boolean;
}

export const AIThumbnailGenerator = ({
  onThumbnailGenerated,
  userId,
  sessionId,
  onBeforeGenerate,
}: AIThumbnailGeneratorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('educational');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be less than 10MB');
        return;
      }

      setReferenceImage(file);
      toast.success('Reference image added');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your thumbnail');
      return;
    }

    // Check if generation is allowed (for guest limits, etc.)
    if (onBeforeGenerate && !onBeforeGenerate()) {
      return;
    }

    setLoading(true);
    try {
      const result = await generateThumbnailComplete({
        prompt: prompt.trim(),
        imageStyle,
        emotion: 'excited', // Default emotion for now
        aspectRatio,
        userId,
        sessionId,
        referenceImage: referenceImage || undefined,
      });

      if (!result.success || !result.backgroundUrl) {
        throw new Error(result.error || 'Failed to generate thumbnail');
      }

      toast.success('Thumbnail generated successfully!');

      onThumbnailGenerated(
        result.backgroundUrl,
        result.textSuggestions,
        result.colorScheme
      );
    } catch (error) {
      logger.error('AI generation error:', { error });
      toast.error(error instanceof Error ? error.message : 'Failed to generate thumbnail');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="w-full p-4 pt-8">
      {/* Main container */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Create Your Thumbnail
            </h1>
            <p className="text-muted-foreground">
              Describe your video and let AI generate a stunning thumbnail
            </p>
          </div>

          {/* Input Container with integrated controls */}
          <div className="space-y-4">
            {/* Main Input Field with integrated controls */}
            <div className="relative">
              <div className="relative w-full min-h-[120px] rounded-xl border-2 border-input bg-background focus-within:border-violet-500 transition-all">
                {/* Text Input Area */}
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What would you like to create?"
                  className="w-full h-full min-h-[80px] px-4 pt-4 pb-20 text-base bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground resize-none disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                />

                {/* Bottom Controls Row - Inside input field */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 border-t border-border/50">
                  {/* Left side controls */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Upload Button */}
                    <button
                      onClick={handleFileUpload}
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      aria-label="Upload reference image"
                      type="button"
                    >
                      <Upload className="w-5 h-5" />
                    </button>

                    {/* Style Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer border-0 bg-transparent">
                          <span>{IMAGE_STYLES.find(s => s.value === imageStyle)?.label || 'Style'}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {IMAGE_STYLES.map((style) => (
                          <DropdownMenuItem
                            key={style.value}
                            onClick={() => setImageStyle(style.value as ImageStyle)}
                            className="cursor-pointer"
                          >
                            <div>
                              <div className="font-medium">{style.label}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Aspect Ratio Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer border-0 bg-transparent">
                          <span>{ASPECT_RATIOS.find(r => r.value === aspectRatio)?.label || 'Aspect Ratio'}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {ASPECT_RATIOS.map((ratio) => (
                          <DropdownMenuItem
                            key={ratio.value}
                            onClick={() => setAspectRatio(ratio.value as AspectRatio)}
                            className="cursor-pointer"
                          >
                            <div>
                              <div className="font-medium">{ratio.label}</div>
                              <div className="text-xs text-muted-foreground">{ratio.description}</div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Generate Button - Right side */}
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-lg px-4 sm:px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    size="sm"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                        <span className="sm:hidden">...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Generate</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Reference Image Indicator */}
            {referenceImage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-violet-500 rounded-full" />
                Reference image: {referenceImage.name}
                <button
                  onClick={() => {
                    setReferenceImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-destructive hover:text-destructive/80 ml-2 cursor-pointer"
                  type="button"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Loading State */}
          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-full">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-violet-700 dark:text-violet-300 font-medium">
                  Creating your thumbnail... This may take up to 30 seconds.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
