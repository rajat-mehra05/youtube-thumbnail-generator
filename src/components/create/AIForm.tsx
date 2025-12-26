'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { TemplateCategory, EmotionType, StylePreference } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { VideoTitleField, TopicSelect, EmotionSelect, StyleSelect, ReferenceImageField } from './form-fields';

interface AIFormProps {
  onSubmit: (data: { videoTitle: string; topic: TemplateCategory; emotion: EmotionType; style: StylePreference; referenceImageUrl?: string }) => void;
  loading?: boolean;
  disabled?: boolean;
  showReferenceUpload?: boolean;
}

export const AIForm = ({ onSubmit, loading = false, disabled = false, showReferenceUpload = true }: AIFormProps) => {
  const [videoTitle, setVideoTitle] = useState('');
  const [topic, setTopic] = useState<TemplateCategory | ''>('');
  const [emotion, setEmotion] = useState<EmotionType | ''>('');
  const [style, setStyle] = useState<StylePreference | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !topic || !emotion) return;
    onSubmit({ videoTitle, topic, emotion, style: style || 'bold_text' });
  };

  const isValid = videoTitle.trim().length > 0 && topic && emotion;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VideoTitleField value={videoTitle} onChange={setVideoTitle} disabled={disabled || loading} />
      <TopicSelect value={topic} onChange={setTopic} disabled={disabled || loading} />
      <EmotionSelect value={emotion} onChange={setEmotion} disabled={disabled || loading} />
      <StyleSelect value={style} onChange={setStyle} disabled={disabled || loading} />
      {showReferenceUpload && <ReferenceImageField />}
      <Button type="submit" disabled={!isValid || loading || disabled} className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
        {loading ? <span className="flex items-center gap-2"><LoadingSpinner size="sm" />Generating concepts...</span> : 'Generate Concepts →'}
      </Button>
    </form>
  );
};