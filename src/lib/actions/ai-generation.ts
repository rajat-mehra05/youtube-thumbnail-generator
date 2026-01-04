'use server';

import { GoogleGenAI } from '@google/genai';
import type { ImageStyle, AspectRatio, EmotionType } from '@/types';
import { generateCacheKey, checkCache, storeInCache } from './cache';
import { processImageForStorage, uploadToSupabaseStorage, generateImageFilename } from '@/lib/utils/image-processing';
import { buildThumbnailPrompt, sanitizePrompt } from '@/lib/utils/prompt-builder';
import { AI_DEFAULTS, GEMINI_CONFIG, DEFAULT_COLOR_SCHEME } from '@/lib/constants/ai-constants';
import { logger } from '@/lib/utils/logger';

/**
 * Get and validate Gemini API key from environment variables
 * Throws an error if no valid API key is found
 */
const getGeminiApiKey = (): string => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    const errorMessage = 'Gemini API key is missing. Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable.';
    logger.error('Gemini API key validation failed:', {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'set (empty)' : 'not set',
      GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'set (empty)' : 'not set'
    });
    throw new Error(errorMessage);
  }

  return apiKey.trim();
};

/**
 * Convert File to base64 string for Gemini API
 */
const fileToBase64 = async (file: File): Promise<{ data: string; mimeType: string }> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  const mimeType = file.type || 'image/png';

  return { data: base64, mimeType };
};

// Initialize Gemini client with validated API key (fails fast if key is missing)
const genAI = new GoogleGenAI({
  apiKey: getGeminiApiKey()
});

// Types
export interface GenerateImageInput {
  prompt: string;
  imageStyle?: ImageStyle;
  emotion?: EmotionType;
  aspectRatio?: AspectRatio;
  userId?: string;
  sessionId?: string;
  referenceImage?: File;
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
    const systemPrompt = `You are a YouTube thumbnail text expert. Generate short, impactful text for thumbnails.

RULES:
- HEADLINE: 2-8 words max, punchy and attention-grabbing, ALL CAPS works great
- SUBHEADLINE: Optional, 2-6 words, adds context or intrigue
- Use power words that create curiosity, urgency, or emotion
- Text must be complete and make sense on its own
- Match the energy and topic of the video description
- For tutorials: emphasize the skill or outcome
- For entertainment: emphasize drama, humor, or shock value
- For educational: emphasize the key insight or benefit

Respond ONLY with valid JSON: {"headline": "YOUR TEXT", "subheadline": "OPTIONAL TEXT"}`;

    const fullPrompt = `${systemPrompt}\n\nGenerate thumbnail text for this video: "${prompt}"`;

    const response = await genAI.models.generateContent({
      model: GEMINI_CONFIG.TEXT_MODEL,
      contents: fullPrompt,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) return fallback;

    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        headline: parsed.headline || '',
        subheadline: parsed.subheadline || '',
      };
    }

    // Fallback: extract key words
    const words = prompt.split(' ').filter(w => w.length > 2).slice(0, 4);
    return {
      headline: words.join(' ').toUpperCase(),
      subheadline: '',
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
 * Generate an image using Gemini 2.5 Flash Image
 */
export const generateImage = async (
  input: GenerateImageInput
): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const sanitizedPrompt = sanitizePrompt(input.prompt);
    const aspectRatio = input.aspectRatio || AI_DEFAULTS.ASPECT_RATIO;
    const imageStyle = input.imageStyle || AI_DEFAULTS.IMAGE_STYLE;
    const emotion = input.emotion || AI_DEFAULTS.EMOTION;

    // Check cache first (skip cache if reference image is provided)
    const cacheKey = input.referenceImage ? null : generateCacheKey('image', {
      prompt: sanitizedPrompt,
      aspectRatio,
      imageStyle,
      emotion
    });

    // Only check cache if we have a cache key (no reference image)
    if (cacheKey) {
      const cached = await checkCache(cacheKey);
      if (cached && typeof cached === 'object' && 'imageUrl' in cached) {
        logger.debug('Using cached image');
        return { success: true, imageUrl: (cached as { imageUrl: string }).imageUrl };
      }
    }

    // Build the enhanced prompt
    const enhancedPrompt = buildThumbnailPrompt(sanitizedPrompt, imageStyle, emotion, !!input.referenceImage);

    logger.info('Generating image with Gemini 2.5 Flash...', {
      userPrompt: sanitizedPrompt.substring(0, 50),
      imageStyle,
      emotion,
      aspectRatio,
      hasReferenceImage: !!input.referenceImage
    });

    // Build contents array with text and optionally reference image
    const contents: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
      { text: enhancedPrompt }
    ];

    // Add reference image if provided
    if (input.referenceImage) {
      logger.debug('Converting reference image to base64...');
      const imageData = await fileToBase64(input.referenceImage);
      contents.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.data
        }
      });
      logger.debug('Reference image added to request', {
        mimeType: imageData.mimeType,
        dataLength: imageData.data.length
      });
    }

    // Generate image using Gemini
    const response = await genAI.models.generateContent({
      model: GEMINI_CONFIG.IMAGE_MODEL,
      contents,
    });

    // Extract image from response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error('No candidates in Gemini response');
    }

    const firstCandidate = candidates[0];
    if (!firstCandidate?.content?.parts) {
      throw new Error('No parts in Gemini response');
    }

    const parts = firstCandidate.content.parts;
    if (parts.length === 0) {
      throw new Error('No parts in Gemini response');
    }

    // Find the image part
    let imageData: string | null = null;
    let mimeType: string = 'image/png';

    for (const part of parts) {
      if (part.inlineData?.data) {
        imageData = part.inlineData.data;
        mimeType = part.inlineData.mimeType || 'image/png';
        break;
      }
    }

    if (!imageData) {
      throw new Error('No image data found in Gemini response');
    }

    // Convert base64 to data URL
    const imageUrl = `data:${mimeType};base64,${imageData}`;

    // Cache the result (only if we have a cache key)
    if (cacheKey) {
      await storeInCache(cacheKey, 'image_generation', { imageUrl }, AI_DEFAULTS.CACHE_HOURS);
    }

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

    const geminiImageUrl = imageResult.imageUrl;
    logger.imageGeneration(geminiImageUrl.substring(0, 50));

    // Process and store the image
    const processResult = await processImageForStorage(geminiImageUrl);
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