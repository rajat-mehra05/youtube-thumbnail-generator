'use server';

import OpenAI from 'openai';
import type { ImageStyle, AspectRatio, EmotionType } from '@/types';
import { generateCacheKey, checkCache, storeInCache } from './cache';
import { processImageForStorage, uploadToSupabaseStorage, generateImageFilename } from '@/lib/utils/image-processing';
import { buildThumbnailPrompt, sanitizePrompt } from '@/lib/utils/prompt-builder';
import { AI_DEFAULTS, DALLE_CONFIG, DEFAULT_COLOR_SCHEME } from '@/lib/constants/ai-constants';
import { logger } from '@/lib/utils/logger';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

// Types
export interface GenerateImageInput {
  prompt: string;
  imageStyle?: ImageStyle;
  emotion?: EmotionType;
  aspectRatio?: AspectRatio;
  userId?: string;
  sessionId?: string;
}

export interface GenerateThumbnailResult {
  success: boolean;
  backgroundUrl?: string;
  textSuggestions?: {
    headline: string;
    subheadline: string;
  };
  colorScheme?: string[];
  error?: string;
}

/**
 * Generate AI-powered text suggestions for the thumbnail
 */
export const generateTextSuggestionsAI = async (
  prompt: string
): Promise<{ headline: string; subheadline: string }> => {
  const fallback = { headline: '', subheadline: '' };

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a YouTube thumbnail text expert. Generate short, impactful text for thumbnails.

RULES:
- HEADLINE: 2-8 words max, punchy and attention-grabbing, ALL CAPS works great
- SUBHEADLINE: Optional, 2-6 words, adds context or intrigue
- Use power words that create curiosity, urgency, or emotion
- Text must be complete and make sense on its own
- Match the energy and topic of the video description
- For tutorials: emphasize the skill or outcome
- For entertainment: emphasize drama, humor, or shock value
- For educational: emphasize the key insight or benefit

Respond ONLY with valid JSON: {"headline": "YOUR TEXT", "subheadline": "OPTIONAL TEXT"}`
        },
        {
          role: 'user',
          content: `Generate thumbnail text for this video: "${prompt}"`
        }
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return fallback;

    // Parse JSON response
    const parsed = JSON.parse(content);
    return {
      headline: parsed.headline || '',
      subheadline: parsed.subheadline || '',
    };
  } catch (error) {
    logger.error('AI text generation failed:', { error });
    // Extract key words from prompt as fallback
    const words = prompt.split(' ').filter(w => w.length > 2).slice(0, 4);
    return {
      headline: words.join(' ').toUpperCase(),
      subheadline: '',
    };
  }
};

/**
 * Generate an image using DALL-E 3
 */
export const generateImage = async (
  input: GenerateImageInput
): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const sanitizedPrompt = sanitizePrompt(input.prompt);
    const aspectRatio = input.aspectRatio || AI_DEFAULTS.ASPECT_RATIO;
    const imageStyle = input.imageStyle || AI_DEFAULTS.IMAGE_STYLE;
    const emotion = input.emotion || AI_DEFAULTS.EMOTION;

    // Check cache first
    const cacheKey = generateCacheKey('image', {
      prompt: sanitizedPrompt,
      aspectRatio,
      imageStyle,
      emotion
    });

    const cached = await checkCache(cacheKey);
    if (cached && typeof cached === 'object' && 'imageUrl' in cached) {
      logger.debug('Using cached image');
      return { success: true, imageUrl: (cached as { imageUrl: string }).imageUrl };
    }

    // Build the enhanced prompt
    const enhancedPrompt = buildThumbnailPrompt(sanitizedPrompt, imageStyle, emotion);

    logger.info('Generating image with DALL-E...', {
      userPrompt: sanitizedPrompt.substring(0, 50),
      imageStyle,
      emotion,
      aspectRatio
    });

    // Determine DALL-E image size based on aspect ratio
    const { getDallESize } = await import('@/lib/constants');
    const dallESize = getDallESize(aspectRatio);

    const response = await openai.images.generate({
      model: DALLE_CONFIG.MODEL,
      prompt: enhancedPrompt,
      n: 1,
      size: dallESize,
      quality: DALLE_CONFIG.QUALITY,
      style: DALLE_CONFIG.STYLE,
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image generated from DALL-E');
    }

    // Cache the result
    await storeInCache(cacheKey, 'image_generation', { imageUrl }, AI_DEFAULTS.CACHE_HOURS);

    return { success: true, imageUrl };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    logger.error('Image generation error:', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
};

/**
 * Generate a complete thumbnail with background image and text suggestions
 */
export const generateThumbnailComplete = async (
  input: GenerateImageInput
): Promise<GenerateThumbnailResult> => {
  try {
    logger.info('Starting thumbnail generation...');
    const sanitizedPrompt = sanitizePrompt(input.prompt);

    // Generate the background image
    const imageResult = await generateImage(input);
    if (!imageResult.success || !imageResult.imageUrl) {
      return { success: false, error: imageResult.error || 'Failed to generate image' };
    }

    const dallEUrl = imageResult.imageUrl;
    logger.imageGeneration(dallEUrl.substring(0, 50));

    // Process and store the image
    const processResult = await processImageForStorage(dallEUrl);
    if (!processResult.success) {
      return { success: false, error: processResult.error || 'Failed to process image' };
    }

    // Try Supabase storage first
    const filePath = generateImageFilename(input.userId, input.sessionId);
    const uploadResult = await uploadToSupabaseStorage(
      Buffer.from(processResult.backgroundUrl!.split(',')[1], 'base64'),
      filePath,
      'image/jpeg'
    );

    const backgroundUrl = uploadResult.success && uploadResult.url
      ? uploadResult.url
      : processResult.backgroundUrl!;

    // Generate AI-powered text suggestions
    const textSuggestions = await generateTextSuggestionsAI(sanitizedPrompt);

    return {
      success: true,
      backgroundUrl,
      textSuggestions,
      colorScheme: [...DEFAULT_COLOR_SCHEME],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate thumbnail';
    logger.error('Thumbnail generation failed:', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
};

/**
 * Generate an image and store it
 */
export const generateImageAndStore = async (
  input: GenerateImageInput
): Promise<{ success: boolean; backgroundUrl?: string; error?: string }> => {
  const result = await generateThumbnailComplete(input);
  return {
    success: result.success,
    backgroundUrl: result.backgroundUrl,
    error: result.error,
  };
};
