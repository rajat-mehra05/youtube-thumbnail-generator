'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import type { ConceptData, TemplateCategory, EmotionType, StylePreference } from '@/types';
import { generateCacheKey, checkCache, storeInCache } from './cache';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

interface GenerateConceptInput {
  videoTitle: string;
  topic: TemplateCategory;
  emotion: EmotionType;
  style: StylePreference;
  userId?: string;
  sessionId?: string;
}

interface GenerateImageInput {
  prompt: string;
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
    const text = (await result.response).text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Failed to parse AI response');

    const concepts = JSON.parse(jsonMatch[0]) as ConceptData[];
    await storeInCache(cacheKey, 'llm_response', concepts, 24);
    return { success: true, concepts };
  } catch (error) {
    console.error('Concept generation error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate concepts' };
  }
};

const buildConceptPrompt = (input: GenerateConceptInput): string => `You are an expert YouTube thumbnail designer. Generate 3 different thumbnail concepts for a YouTube video.

Video Title: "${input.videoTitle}"
Topic/Niche: ${input.topic}
Desired Emotion: ${input.emotion}
Style Preference: ${input.style}

For each concept, provide:
1. A short, punchy headline text (max 4 words, all caps)
2. An optional subheadline (max 6 words)
3. Background image prompt for DALL-E (describe a scene, not text)
4. Color scheme (array of 3-4 hex colors)
5. Layout hints for element positioning

Return ONLY valid JSON in this exact format:
[
  {
    "headline": "SHOCKING RESULTS",
    "subheadline": "You won't believe this",
    "layout_hints": [
      {"element_type": "text", "position": {"x": 640, "y": 200}, "size": {"width": 800, "height": 120}, "z_index": 3},
      {"element_type": "image", "position": {"x": 900, "y": 400}, "size": {"width": 400, "height": 400}, "z_index": 2}
    ],
    "background_prompt": "Abstract gradient background with dramatic lighting, cinematic feel, purple and orange tones",
    "color_scheme": ["#8B5CF6", "#F97316", "#FFFFFF", "#1F2937"],
    "style": "${input.style}"
  }
]

Generate exactly 3 unique concepts with different visual approaches. Focus on high-contrast, attention-grabbing designs.`;

export const generateImage = async (
  input: GenerateImageInput
): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const cacheKey = generateCacheKey('image', { prompt: input.prompt });
    const cached = await checkCache(cacheKey);
    if (cached && typeof cached === 'object' && 'imageUrl' in cached) {
      return { success: true, imageUrl: (cached as { imageUrl: string }).imageUrl };
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `YouTube thumbnail background image: ${input.prompt}. High quality, 16:9 aspect ratio, vibrant colors, professional photography style. No text or letters in the image.`,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image generated');
    await storeInCache(cacheKey, 'image_generation', { imageUrl }, 168);
    return { success: true, imageUrl };
  } catch (error) {
    console.error('Image generation error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to generate image' };
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