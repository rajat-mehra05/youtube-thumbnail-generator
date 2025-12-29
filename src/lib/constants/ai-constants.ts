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

// DALL-E configuration
export const DALLE_CONFIG = {
    MODEL: 'dall-e-3' as const,
    QUALITY: 'hd' as const,
    STYLE: 'vivid' as const,
} as const;

// Default color scheme for thumbnails
export const DEFAULT_COLOR_SCHEME = ['#8B5CF6', '#D946EF', '#FFFFFF', '#000000'] as const;
