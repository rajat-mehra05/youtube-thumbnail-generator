'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { InlineError } from '@/components/ui/error-message';
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
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Utility to create change handlers that clear errors
  const createChangeHandler = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    if (formErrors.length > 0) setFormErrors([]);
  };

  const handleVideoTitleChange = createChangeHandler(setVideoTitle);
  const handleTopicChange = createChangeHandler(setTopic);
  const handleEmotionChange = createChangeHandler(setEmotion);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateAIGenerationForm({ videoTitle, topic, emotion });
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    // Clear any previous errors
    setFormErrors([]);
    onSubmit({
      videoTitle,
      topic: topic as TemplateCategory,      // Cast to strict type after validation
      emotion: emotion as EmotionType,      // Cast to strict type after validation
      imageStyle,
      aspectRatio,
      referenceImageUrl
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VideoTitleField value={videoTitle} onChange={handleVideoTitleChange} disabled={disabled || loading} />
      <TopicSelect value={topic} onChange={handleTopicChange} disabled={disabled || loading} />
      <EmotionSelect value={emotion} onChange={handleEmotionChange} disabled={disabled || loading} />
      <ImageStyleSelect value={imageStyle} onChange={setImageStyle} disabled={disabled || loading} />
      <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} disabled={disabled || loading} />
      {showReferenceUpload && (
        <ReferenceImageField
          value={referenceImageUrl}
          onChange={setReferenceImageUrl}
          disabled={disabled || loading}
        />
      )}

      {formErrors.length > 0 && (
        <div className="space-y-2">
          {formErrors.map((error, index) => (
            <InlineError key={index} message={error} />
          ))}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || disabled}
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