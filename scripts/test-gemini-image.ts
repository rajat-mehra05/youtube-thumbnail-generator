/**
 * Test script for Google Gemini API image generation
 * Run with: npx tsx scripts/test-gemini-image.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

import fs from 'fs';

// Load .env.local file
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables');
    console.log('Please create a .env.local file with GEMINI_API_KEY=your_api_key');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generateImage = async (prompt: string): Promise<void> => {
    console.log('🚀 Starting Gemini image generation...');
    console.log(`📝 Prompt: "${prompt}"`);
    console.log('');

    try {
        // Use Gemini 2.0 Flash with image generation capabilities
        // Note: Image generation requires the experimental model
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                responseModalities: ['image', 'text'],
            } as any,
        });

        const result = await model.generateContent(prompt);
        const response = result.response;

        console.log('📦 Response received');

        // Check for image parts in the response
        const parts = response.candidates?.[0]?.content?.parts;

        if (!parts || parts.length === 0) {
            console.error('❌ No parts in response');
            console.log('Full response:', JSON.stringify(response, null, 2));
            return;
        }

        let imageFound = false;

        for (const part of parts) {
            if ('inlineData' in part && part.inlineData) {
                const { data, mimeType } = part.inlineData;

                // Determine file extension from mime type
                const extension = mimeType?.includes('png') ? 'png' :
                    mimeType?.includes('webp') ? 'webp' : 'jpg';

                // Create output directory if it doesn't exist
                const outputDir = path.join(process.cwd(), 'generated-images');
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                // Generate filename with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `thumbnail-backpacking-${timestamp}.${extension}`;
                const filepath = path.join(outputDir, filename);

                // Decode base64 and save to file
                const imageBuffer = Buffer.from(data, 'base64');
                fs.writeFileSync(filepath, imageBuffer);

                console.log(`✅ Image saved successfully!`);
                console.log(`📁 Path: ${filepath}`);
                console.log(`📊 Size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
                console.log(`🖼️  Type: ${mimeType}`);

                imageFound = true;
            } else if ('text' in part && part.text) {
                console.log('📝 Text response:', part.text);
            }
        }

        if (!imageFound) {
            console.log('⚠️  No image data found in response');
            console.log('Response parts:', JSON.stringify(parts, null, 2));
        }

    } catch (error) {
        console.error('❌ Error generating image:', error);

        if (error instanceof Error) {
            console.error('Error message:', error.message);

            // Check if it's an API error
            if (error.message.includes('not supported') || error.message.includes('model')) {
                console.log('\n💡 Tip: Image generation may require a specific model or API version.');
                console.log('   Try using the Imagen API instead for dedicated image generation.');
            }
        }
    }
};

// Main execution
const prompt = 'Generate a YouTube thumbnail image of a guy backpacking in Europe. Show a young traveler with a large backpack standing in front of iconic European architecture (like the Eiffel Tower or Colosseum visible in the background). Bright, vibrant colors, golden hour lighting, travel adventure mood. High quality, 16:9 aspect ratio for YouTube thumbnail.';

generateImage(prompt);

