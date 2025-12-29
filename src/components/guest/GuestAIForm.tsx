'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TemplateCategory, EmotionType, StylePreference } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { isNonEmptyString } from '@/lib/utils/validation';

interface GuestAIFormProps {
  onSubmit: (data: { videoTitle: string; topic: TemplateCategory; emotion: EmotionType; style: StylePreference }) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const GuestAIForm = ({ onSubmit, loading = false, disabled = false }: GuestAIFormProps) => {
  const [videoTitle, setVideoTitle] = useState('');
  const [topic, setTopic] = useState<TemplateCategory | ''>('');
  const [emotion, setEmotion] = useState<EmotionType | ''>('');
  const [style, setStyle] = useState<StylePreference | ''>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = isNonEmptyString(videoTitle) && !!topic && !!emotion;
    if (!isValid) return;
    onSubmit({
      videoTitle,
      topic: topic as TemplateCategory,
      emotion: emotion as EmotionType,
      style: style || 'bold_text'
    });
  };

  const isValid = isNonEmptyString(videoTitle) && !!topic && !!emotion;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Video Title */}
      <div className="space-y-2">
        <Label htmlFor="videoTitle" className="text-base font-medium">
          Video Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="videoTitle"
          placeholder="e.g., Next.js Crash Course for Beginners"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          disabled={disabled || loading}
          className="h-12"
        />
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <Label htmlFor="topic" className="text-base font-medium">
          Topic <span className="text-red-500">*</span>
        </Label>
        <Select value={topic} onValueChange={(value) => setTopic(value as TemplateCategory)} disabled={disabled || loading}>
          <SelectTrigger id="topic" className="h-12">
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gaming">Gaming</SelectItem>
            <SelectItem value="vlog">Vlog / Lifestyle</SelectItem>
            <SelectItem value="tutorial">Tutorial / How-to</SelectItem>
            <SelectItem value="podcast">Podcast / Interview</SelectItem>
            <SelectItem value="reaction">Reaction / Commentary</SelectItem>
            <SelectItem value="business">Business / Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Emotion */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Mood / Vibe <span className="text-red-500">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'excited', label: 'Excited', emoji: '🤩' },
            { value: 'shocked', label: 'Shocked', emoji: '😱' },
            { value: 'curious', label: 'Curious', emoji: '🤔' },
            { value: 'happy', label: 'Happy', emoji: '😊' },
            { value: 'serious', label: 'Serious', emoji: '😐' },
          ].map((em) => (
            <Button
              key={em.value}
              type="button"
              onClick={() => setEmotion(em.value as EmotionType)}
              disabled={disabled || loading}
              variant="outline"
              className={`px-4 py-2 rounded-full text-sm font-medium ${emotion === em.value ? 'bg-violet-500 text-white border-violet-500' : ''
                }`}
            >
              {em.emoji} {em.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Style */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Style Preference <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'bold_text', label: 'Bold Text' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'colorful', label: 'Colorful' },
            { value: 'dark', label: 'Dark' },
            { value: 'professional', label: 'Professional' },
          ].map((st) => (
            <Button
              key={st.value}
              type="button"
              onClick={() => setStyle(style === st.value ? '' : (st.value as StylePreference))}
              disabled={disabled || loading}
              variant="outline"
              className={`px-4 py-2 rounded-full text-sm font-medium ${style === st.value ? 'bg-violet-500 text-white border-violet-500' : ''
                }`}
            >
              {st.label}
            </Button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isValid || loading || disabled}
        className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            Generating your thumbnail...
          </span>
        ) : (
          'Generate My Thumbnail →'
        )}
      </Button>
    </form>
  );
};