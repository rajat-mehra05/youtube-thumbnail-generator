/**
 * AI Generation Constants
 */

import type { ImageStyle, EmotionType } from '@/types';

// Default values for AI generation
export const AI_DEFAULTS = {
    IMAGE_STYLE: 'cinematic' as ImageStyle,
    EMOTION: 'excited' as EmotionType,
    ASPECT_RATIO: '16:9' as const,
    CACHE_HOURS: 168, // 7 days
} as const;

// Gemini configuration
export const GEMINI_CONFIG = {
    IMAGE_MODEL: 'gemini-2.5-flash-image' as const,
    TEXT_MODEL: 'gemini-2.5-flash' as const,
} as const;

// Default color scheme for thumbnails
export const DEFAULT_COLOR_SCHEME = ['#8B5CF6', '#D946EF', '#FFFFFF', '#000000'] as const;
