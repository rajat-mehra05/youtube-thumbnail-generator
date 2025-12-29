/**
 * Thumbnail Prompt Templates
 * Centralized prompt templates for AI thumbnail generation
 */

import type { ImageStyle, EmotionType } from '@/types';

// Style-specific visual instructions
export const STYLE_VISUAL_INSTRUCTIONS: Record<ImageStyle, string> = {
    cinematic: 'PHOTOREALISTIC cinematic film photography, professional DSLR camera quality, dramatic natural lighting, movie-quality composition, ultra-detailed, 8K quality',
    '3d_scene': 'High-end 3D rendered scene, Unreal Engine 5 quality, photorealistic 3D rendering with ray-traced lighting, professional 3D visualization',
    anime: 'Professional anime illustration style, studio-quality anime art, vibrant bold colors, clean linework with dynamic shading',
    artistic: 'Fine art painting style, museum-quality artwork, masterful brushwork, rich harmonious colors',
    digital_art: 'Modern digital illustration, trending ArtStation quality, clean polished digital aesthetic, bold colors with smooth gradients',
    educational: 'Clean professional educational content style, modern minimalist approach, high contrast for readability, organized structured composition',
    fantasy_world: 'Epic fantasy/sci-fi scene, concept art quality, otherworldly imaginative settings, dramatic atmospheric lighting',
    prototyping: 'Clean modern UI/UX mockup style, professional product design, contemporary tech mockup aesthetic',
    auto: 'Professional high-quality visuals, cinematic composition, dramatic yet balanced lighting',
};

// Emotion-specific atmosphere instructions
export const EMOTION_ATMOSPHERE_INSTRUCTIONS: Record<EmotionType, string> = {
    excited: 'Energetic vibrant atmosphere, bright uplifting colors, dynamic composition, sense of movement and energy',
    shocked: 'Dramatic intense atmosphere, high contrast lighting, bold striking colors, tension and impact',
    curious: 'Mysterious intriguing atmosphere, subtle layered lighting, thought-provoking depth',
    happy: 'Bright cheerful atmosphere, warm inviting colors, welcoming positive composition',
    serious: 'Professional focused atmosphere, clean structured lighting, authoritative confident composition',
};

// Main thumbnail prompt template - AI interprets the topic naturally
export const BASE_THUMBNAIL_PROMPT = `Create a professional YouTube thumbnail background image.

USER'S VIDEO DESCRIPTION:
"{userPrompt}"

CRITICAL INTERPRETATION RULES:
- Interpret the topic THEMATICALLY and CONCEPTUALLY, never literally
- "Crash course" means tutorial/lesson, NOT a car crash
- "Killing it" means success, NOT violence
- Focus on what would visually represent this video's content to viewers
- Create imagery viewers would associate with this type of content

VISUAL STYLE:
{styleInstructions}

MOOD & ATMOSPHERE:
{emotionInstructions}

COMPOSITION REQUIREMENTS:
- Professional YouTube thumbnail aesthetic (16:9 mindset)
- Clear focal point with visual hierarchy
- Leave space for text overlay (top or bottom third)
- Eye-catching but not cluttered
- High visual impact at small preview sizes

RESTRICTIONS:
- NO text, letters, words, numbers, or typography in the image
- NO watermarks or logos
- Focus purely on visual imagery and atmosphere

Create a stunning thumbnail background that captures the essence of the video topic.`;
