'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { VideoTitleField, TopicSelect, EmotionSelect, ImageStyleSelect, AspectRatioSelect, ReferenceImageField } from './form-fields';
import { validateAIGenerationForm } from '@/lib/utils/validation';
import type { TemplateCategory, EmotionType, ImageStyle, AspectRatio } from '@/types';

interface AIFormProps {
  onSubmit: (data: {
    videoTitle: string;
    topic: TemplateCategory;
    emotion: EmotionType;
    imageStyle: ImageStyle;
    aspectRatio: AspectRatio;
    referenceImageUrl?: string;
  }) => void;
  loading?: boolean;
  disabled?: boolean;
  showReferenceUpload?: boolean;
}

export const AIForm = ({ onSubmit, loading = false, disabled = false, showReferenceUpload = false }: AIFormProps) => {
  const [videoTitle, setVideoTitle] = useState('');
  const [topic, setTopic] = useState<TemplateCategory | ''>('');
  const [emotion, setEmotion] = useState<EmotionType | ''>('');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateAIGenerationForm({ videoTitle, topic, emotion });
    if (!validation.isValid) return;
    onSubmit({
      videoTitle,
      topic: topic as TemplateCategory,      // Cast to strict type after validation
      emotion: emotion as EmotionType,      // Cast to strict type after validation
      imageStyle,
      aspectRatio,
      referenceImageUrl
    });
  };

  const validation = validateAIGenerationForm({ videoTitle, topic, emotion });
  const isValid = validation.isValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VideoTitleField value={videoTitle} onChange={setVideoTitle} disabled={disabled || loading} />
      <TopicSelect value={topic} onChange={setTopic} disabled={disabled || loading} />
      <EmotionSelect value={emotion} onChange={setEmotion} disabled={disabled || loading} />
      <ImageStyleSelect value={imageStyle} onChange={setImageStyle} disabled={disabled || loading} />
      <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} disabled={disabled || loading} />
      {showReferenceUpload && (
        <ReferenceImageField
          value={referenceImageUrl}
          onChange={setReferenceImageUrl}
          disabled={disabled || loading}
        />
      )}
      <Button
        type="submit"
        disabled={!isValid || loading || disabled}
        className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            Generating thumbnail...
          </span>
        ) : (
          'Generate Thumbnail →'
        )}
      </Button>
    </form>
  );
};