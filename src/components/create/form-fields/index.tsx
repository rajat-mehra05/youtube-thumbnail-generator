'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { logger } from '@/lib/utils/logger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMPLATE_CATEGORIES, EMOTIONS, STYLE_PREFERENCES, IMAGE_STYLES, ASPECT_RATIOS } from '@/lib/constants';
import type { TemplateCategory, EmotionType, StylePreference, ImageStyle, AspectRatio } from '@/types';
import type {
  VideoTitleFieldProps,
  TopicSelectProps,
  EmotionSelectProps,
  StyleSelectProps,
  ImageStyleSelectProps,
  AspectRatioSelectProps,
  ReferenceImageFieldProps
} from '@/types/components';

export const VideoTitleField = ({ value, onChange, disabled, required }: VideoTitleFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="videoTitle" className="text-base font-medium">
      Video Title {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id="videoTitle"
      placeholder="e.g., How I Made $10K in 30 Days"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="h-12 text-base"
      disabled={disabled}
      required={required}
    />
    <p className="text-sm text-muted-foreground">Enter your YouTube video title or main topic</p>
  </div>
);

export const TopicSelect = ({ value, onChange, disabled }: TopicSelectProps) => (
  <div className="space-y-2">
    <Label htmlFor="topic" className="text-base font-medium">Topic / Niche <span className="text-red-500">*</span></Label>
    <Select value={value} onValueChange={(v) => onChange(v as TemplateCategory)} disabled={disabled}>
      <SelectTrigger id="topic" className="h-12 text-base"><SelectValue placeholder="Select a category" /></SelectTrigger>
      <SelectContent>
        {TEMPLATE_CATEGORIES.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

export const EmotionSelect = ({ value, onChange, disabled }: EmotionSelectProps) => (
  <div className="space-y-2">
    <Label className="text-base font-medium">Emotion / Vibe <span className="text-red-500">*</span></Label>
    <div className="flex flex-wrap gap-2">
      {EMOTIONS.map((em) => (
        <Button key={em.value} type="button" onClick={() => onChange(em.value as EmotionType)} disabled={disabled} variant="outline"
          className={`px-4 py-2 rounded-full text-sm font-medium ${value === em.value ? 'bg-violet-500 text-white border-violet-500' : ''}`} aria-pressed={value === em.value}>
          {em.emoji} {em.label}
        </Button>
      ))}
    </div>
  </div>
);


export const StyleSelect = ({ value, onChange, disabled }: StyleSelectProps) => (
  <div className="space-y-2">
    <Label className="text-base font-medium">Style Preference <span className="text-muted-foreground font-normal">(optional)</span></Label>
    <div className="flex flex-wrap gap-2">
      {STYLE_PREFERENCES.map((st) => (
        <Button key={st.value} type="button" onClick={() => onChange(value === st.value ? '' : (st.value as StylePreference))} disabled={disabled} variant="outline"
          className={`px-4 py-2 rounded-full text-sm font-medium ${value === st.value ? 'bg-violet-500 text-white border-violet-500' : ''}`} aria-pressed={value === st.value}>
          {st.label}
        </Button>
      ))}
    </div>
  </div>
);


// Image Style Selector

export const ImageStyleSelect = ({ value, onChange, disabled }: ImageStyleSelectProps) => (
  <div className="space-y-3">
    <Label className="text-base font-medium">
      Image Style <span className="text-red-500">*</span>
    </Label>
    <p className="text-sm text-muted-foreground">Choose the visual style for your thumbnail</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {IMAGE_STYLES.map((style) => (
        <button
          key={style.value}
          type="button"
          onClick={() => onChange(style.value as ImageStyle)}
          disabled={disabled}
          className={`
            p-4 rounded-lg border-2 text-left transition-all
            ${value === style.value
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-border hover:border-violet-500/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="font-medium text-sm mb-1">{style.label}</div>
          <div className="text-xs text-muted-foreground">{style.description}</div>
        </button>
      ))}
    </div>
  </div>
);

// Aspect Ratio Selector

export const AspectRatioSelect = ({ value, onChange, disabled }: AspectRatioSelectProps) => (
  <div className="space-y-3">
    <Label className="text-base font-medium">
      Aspect Ratio <span className="text-red-500">*</span>
    </Label>
    <p className="text-sm text-muted-foreground">Choose dimensions for your thumbnail</p>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {ASPECT_RATIOS.map((ratio) => (
        <button
          key={ratio.value}
          type="button"
          onClick={() => onChange(ratio.value as AspectRatio)}
          disabled={disabled}
          className={`
            p-4 rounded-lg border-2 text-center transition-all
            ${value === ratio.value
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-border hover:border-violet-500/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="font-bold text-base mb-1">{ratio.label}</div>
          <div className="text-xs text-muted-foreground">{ratio.description}</div>
        </button>
      ))}
    </div>
  </div>
);

export const ReferenceImageField = ({ value, onChange, disabled }: ReferenceImageFieldProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to safely revoke object URLs
  const revokePreviewUrl = useCallback((url: string | null) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        revokePreviewUrl(preview);
      }
    };
  }, [preview, revokePreviewUrl]);

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      // Revoke the previous preview URL to prevent memory leaks
      if (preview) {
        revokePreviewUrl(preview);
      }

      // Create a local preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // For now, we'll use the object URL as the value
      // In production, you would upload to Supabase Storage here
      onChange?.(objectUrl);
    } catch (error) {
      logger.error('Upload error:', { error });
      alert('Failed to process image');
    } finally {
      setUploading(false);
    }
  }, [onChange, preview, revokePreviewUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    // Revoke the current preview URL to prevent memory leaks
    if (preview) {
      revokePreviewUrl(preview);
    }

    setPreview(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        Reference Image{' '}
        <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || uploading}
        aria-label="Upload reference image"
      />

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <div className="relative aspect-video w-full">
            <Image
              src={preview}
              alt="Reference image preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
            ${dragActive
              ? 'border-violet-500 bg-violet-500/5'
              : 'border-border hover:border-violet-500/50 hover:bg-muted/30'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              <p className="text-sm text-muted-foreground">Processing...</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {dragActive
                  ? 'Drop your image here'
                  : 'Drop your face photo or product image here'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 10MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                disabled={disabled}
              >
                Choose File
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
