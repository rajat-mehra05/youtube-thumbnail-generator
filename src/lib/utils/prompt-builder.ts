/**
 * Prompt Builder Utilities
 * Simple utilities for building AI thumbnail prompts
 */

import type { ImageStyle, EmotionType } from '@/types';
import {
    STYLE_VISUAL_INSTRUCTIONS,
    EMOTION_ATMOSPHERE_INSTRUCTIONS,
    BASE_THUMBNAIL_PROMPT,
} from '@/lib/prompts/thumbnail-prompts';
import { AI_DEFAULTS } from '@/lib/constants/ai-constants';

/**
 * Build the thumbnail generation prompt
 * AI interprets the user's prompt naturally without explicit mappings
 */
export const buildThumbnailPrompt = (
    userPrompt: string,
    imageStyle: ImageStyle = AI_DEFAULTS.IMAGE_STYLE,
    emotion: EmotionType = AI_DEFAULTS.EMOTION,
    hasReferenceImage: boolean = false
): string => {
    const styleInstructions = STYLE_VISUAL_INSTRUCTIONS[imageStyle] || STYLE_VISUAL_INSTRUCTIONS.auto;
    const emotionInstructions = EMOTION_ATMOSPHERE_INSTRUCTIONS[emotion] || EMOTION_ATMOSPHERE_INSTRUCTIONS.excited;

    let prompt = BASE_THUMBNAIL_PROMPT
        .replace('{userPrompt}', userPrompt)
        .replace('{styleInstructions}', styleInstructions)
        .replace('{emotionInstructions}', emotionInstructions);

    // Add reference image instruction if provided
    if (hasReferenceImage) {
        prompt += ' IMPORTANT: Incorporate visual elements and style inspiration from the provided reference image while maintaining the overall composition and text placement suitable for a YouTube thumbnail.';
    }

    return prompt;
};

/**
 * Sanitize user prompt
 */
export const sanitizePrompt = (prompt: string): string => {
    let sanitized = prompt.trim();
    if (sanitized.length > 500) {
        sanitized = sanitized.substring(0, 500);
    }
    return sanitized.replace(/\s+/g, ' ');
};
