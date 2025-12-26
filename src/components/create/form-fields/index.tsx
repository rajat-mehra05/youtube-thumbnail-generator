'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEMPLATE_CATEGORIES, EMOTIONS, STYLE_PREFERENCES } from '@/lib/constants';
import type { TemplateCategory, EmotionType, StylePreference } from '@/types';

interface VideoTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const VideoTitleField = ({ value, onChange, disabled }: VideoTitleFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="videoTitle" className="text-base font-medium">Video Title <span className="text-red-500">*</span></Label>
    <Input id="videoTitle" placeholder="e.g., How I Made $10K in 30 Days" value={value} onChange={(e) => onChange(e.target.value)} className="h-12 text-base" disabled={disabled} required />
    <p className="text-sm text-muted-foreground">Enter your YouTube video title or main topic</p>
  </div>
);

interface TopicSelectProps {
  value: TemplateCategory | '';
  onChange: (value: TemplateCategory) => void;
  disabled?: boolean;
}

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

interface EmotionSelectProps {
  value: EmotionType | '';
  onChange: (value: EmotionType) => void;
  disabled?: boolean;
}

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

interface StyleSelectProps {
  value: StylePreference | '';
  onChange: (value: StylePreference | '') => void;
  disabled?: boolean;
}

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

export const ReferenceImageField = () => (
  <div className="space-y-2">
    <Label className="text-base font-medium">Reference Image <span className="text-muted-foreground font-normal">(optional)</span></Label>
    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-violet-500/50 transition-colors cursor-pointer">
      <div className="text-3xl mb-2">📷</div>
      <p className="text-sm text-muted-foreground">Drop your face photo or product image here</p>
      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
    </div>
  </div>
);
