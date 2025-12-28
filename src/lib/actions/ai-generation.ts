'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import type { ConceptData, TemplateCategory, EmotionType, StylePreference } from '@/types';
import { generateCacheKey, checkCache, storeInCache } from './cache';
import { processImageForStorage, uploadToSupabaseStorage, generateImageFilename } from '@/lib/utils/image-processing';
import { logger } from '@/lib/utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

interface GenerateConceptInput {
  videoTitle: string;
  topic: TemplateCategory;
  emotion: EmotionType;
  style: StylePreference;
  imageStyle?: string;
  aspectRatio?: string;
  userId?: string;
  sessionId?: string;
}

interface GenerateImageInput {
  prompt: string;
  aspectRatio?: string;
  userId?: string;
  sessionId?: string;
}

export const generateConcepts = async (
  input: GenerateConceptInput
): Promise<{ success: boolean; concepts?: ConceptData[]; error?: string }> => {
  try {
    const cacheKey = generateCacheKey('concept', {
      videoTitle: input.videoTitle, topic: input.topic, emotion: input.emotion, style: input.style,
    });

    const cached = await checkCache(cacheKey);
    if (cached) return { success: true, concepts: cached as ConceptData[] };

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = buildConceptPrompt(input);
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();

    let concepts: ConceptData[];

    // First try to parse as JSON array
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        concepts = JSON.parse(arrayMatch[0]) as ConceptData[];
      } catch (error) {
        throw new Error('Failed to parse AI response as JSON array');
      }
    } else {
      // If no array found, try to parse as single JSON object
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          const singleConcept = JSON.parse(objectMatch[0]) as ConceptData;
          concepts = [singleConcept];
        } catch (error) {
          throw new Error('Failed to parse AI response as JSON object');
        }
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    }

    await storeInCache(cacheKey, 'llm_response', concepts, 24);
    return { success: true, concepts };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate concepts';
    logger.error('Concept generation error:', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
};

const buildConceptPrompt = (input: GenerateConceptInput): string => {
  const imageStyle = input.imageStyle || 'cinematic';

  const styleInstructions: Record<string, string> = {
    cinematic: 'PHOTOREALISTIC cinematic film photography, professional DSLR camera shot, dramatic natural lighting, movie-quality composition, ultra-detailed, 8K quality, like a Hollywood film still',
    '3d_scene': '3D rendered scene with Unreal Engine 5 quality, photorealistic 3D graphics, professional 3D visualization, ray-traced lighting, highly detailed textures',
    anime: 'High-quality anime illustration, studio-quality animation art style, vibrant bold colors, professional manga artist quality, sharp clean lines',
    artistic: 'Professional fine art painting, museum-quality artwork, masterful brushwork, rich colors and textures, painterly style',
    digital_art: 'Modern professional digital illustration, contemporary digital art style, clean and polished, trending on ArtStation quality',
    educational: 'Clean professional educational content style, clear informative visual design, modern minimalist approach, high contrast and clarity',
    fantasy_world: 'Epic fantasy or sci-fi scene with concept art quality, otherworldly cinematic environments, dramatic atmospheric lighting, high detail',
    prototyping: 'Clean modern UI/UX mockup style, professional product design, minimal contemporary aesthetic, sleek and polished',
    auto: 'Professional high-quality visuals with cinematic composition and dramatic lighting',
  };

  const styleInstruction = styleInstructions[imageStyle] || styleInstructions.auto;

  return `You are an expert YouTube thumbnail designer. Generate 1 high-impact thumbnail concept for a YouTube video.

Video Title: "${input.videoTitle}"
Topic/Niche: ${input.topic}
Desired Emotion: ${input.emotion}
Image Style: ${imageStyle}

CRITICAL DESIGN RULES FOR PROFESSIONAL YOUTUBE THUMBNAILS:
1. Text MUST be BOLD, LARGE, and HIGHLY READABLE with maximum contrast
2. Text should NEVER overlap faces or main subjects - position in clear empty areas
3. Use EXTREME CONTRAST for text: White fill (#FFFFFF) with thick black stroke (#000000) is best
4. Background must have designated clear areas for text placement
5. Image style must be: ${styleInstruction}

For the concept, provide:
1. A short, punchy headline (2-4 words, ALL CAPS, attention-grabbing, YouTube-optimized)
2. An optional subheadline (3-6 words max, supporting text)
3. Background image prompt emphasizing the specified style
4. High-contrast color scheme optimized for maximum readability
5. Strategic text position in clear areas

Return ONLY valid JSON (single concept):
{
  "headline": "AMAZING RESULT",
  "subheadline": "Must Watch",
  "text_position": "bottom",
  "background_prompt": "${styleInstruction}, composition with large clear space at bottom for text, dramatic and eye-catching, professional YouTube thumbnail aesthetic, no text or letters in image, ultra-detailed background",
  "color_scheme": ["#FF3366", "#FFA500", "#FFFFFF", "#000000"],
  "style": "${imageStyle}"
}

CRITICAL REQUIREMENTS:
- Background prompt MUST emphasize: ${styleInstruction}
- Background prompt MUST specify clear space for text at the chosen position
- Background prompt MUST include "no text or letters in image"
- Third color (#FFFFFF white) is TEXT FILL for maximum visibility
- Fourth color (#000000 black) is TEXT STROKE for bold contrast
- text_position options: "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"
- Choose text_position based on where the background will have empty space

Focus on creating a professional, high-impact YouTube thumbnail with crystal-clear readable text and stunning ${imageStyle} visuals.`;
};

export const generateImage = async (
  input: GenerateImageInput
): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const aspectRatio = input.aspectRatio || '16:9';
    const cacheKey = generateCacheKey('image', { prompt: input.prompt, aspectRatio });
    const cached = await checkCache(cacheKey);
    if (cached && typeof cached === 'object' && 'imageUrl' in cached) {
      return { success: true, imageUrl: (cached as { imageUrl: string }).imageUrl };
    }

    // Determine DALL-E image size based on aspect ratio
    const { getDallESize } = await import('@/lib/constants');
    const dallESize = getDallESize(aspectRatio);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Professional YouTube thumbnail background image: ${input.prompt}. PHOTOREALISTIC, ultra-detailed, 8K quality, dramatic lighting, cinematic composition, vibrant colors, professional photography. CRITICAL: No text, letters, or words in the image. Clear composition for text overlay.`,
      n: 1,
      size: dallESize,
      quality: 'hd',
      style: 'vivid',
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image generated');
    await storeInCache(cacheKey, 'image_generation', { imageUrl }, 168);
    return { success: true, imageUrl };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    logger.error('Image generation error:', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const generateThumbnail = async (input: GenerateConceptInput): Promise<{
  success: boolean; concept?: ConceptData; backgroundUrl?: string; error?: string;
}> => {
  const conceptResult = await generateConcepts(input);
  if (!conceptResult.success || !conceptResult.concepts?.length) {
    return { success: false, error: conceptResult.error || 'Failed to generate concepts' };
  }

  const concept = conceptResult.concepts[0];
  const imageResult = await generateImage({ prompt: concept.background_prompt, userId: input.userId, sessionId: input.sessionId });

  if (!imageResult.success) {
    return { success: true, concept, error: 'Background image generation failed, but concept is ready' };
  }
  return { success: true, concept, backgroundUrl: imageResult.imageUrl };
};

export const generateImageAndStore = async (
  input: GenerateImageInput
): Promise<{ success: boolean; backgroundUrl?: string; error?: string }> => {
  try {
    logger.info('Starting image generation...');

    // Generate the image with aspect ratio support
    const imageResult = await generateImage({ ...input, aspectRatio: input.aspectRatio });
    if (!imageResult.success || !imageResult.imageUrl) {
      return { success: false, error: imageResult.error || 'Failed to generate image' };
    }

    const dallEUrl = imageResult.imageUrl;
    logger.imageGeneration(dallEUrl.substring(0, 50));

    // Process and store the image
    const processResult = await processImageForStorage(dallEUrl);
    if (!processResult.success) {
      return processResult;
    }

    // Try Supabase storage first (if configured)
    const filePath = generateImageFilename(input.userId, input.sessionId);
    const uploadResult = await uploadToSupabaseStorage(
      Buffer.from(processResult.backgroundUrl!.split(',')[1], 'base64'),
      filePath,
      'image/jpeg'
    );

    if (uploadResult.success) {
      return { success: true, backgroundUrl: uploadResult.url };
    }

    // Fallback to base64 data URL
    logger.debug('Using base64 fallback for image storage');
    return processResult;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    logger.error('Image generation failed:', { error: errorMessage });
    return {
      success: false,
      error: errorMessage
    };
  }
};