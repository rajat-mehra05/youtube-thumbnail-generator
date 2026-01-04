import { logger } from './logger';

/**
 * Image processing utilities
 */

/**
 * Convert buffer to base64 data URL
 */
export const convertToBase64DataUrl = (buffer: Buffer, mimeType: string = 'image/png'): string => {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

/**
 * Compress image buffer using Sharp (if available)
 */
export const compressImageBuffer = async (buffer: Buffer, quality: number = 85): Promise<{
  buffer: Buffer;
  mimeType: string;
}> => {
  try {
    const sharp = await import('sharp').catch(() => null);
    if (sharp?.default) {
      logger.debug('Compressing image with sharp...');

      const originalSize = buffer.length;
      const compressedBuffer = await sharp.default(buffer)
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();

      const finalSize = compressedBuffer.length;
      logger.debug(`Compressed image: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(finalSize / 1024 / 1024).toFixed(2)}MB`);

      return {
        buffer: Buffer.from(compressedBuffer),
        mimeType: 'image/jpeg',
      };
    }
  } catch {
    logger.warn('Sharp compression failed, using original buffer');
  }

  return {
    buffer,
    mimeType: 'image/png',
  };
};

/**
 * Download image from URL and convert to buffer
 */
export const downloadImageAsBuffer = async (url: string): Promise<Buffer> => {
  logger.debug(`Downloading image from: ${url.substring(0, 100)}...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  logger.debug(`Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)}MB image`);

  return buffer;
};

/**
 * Process image for storage (download, compress, convert to data URL)
 * Handles both regular URLs and data URLs (base64)
 */
export const processImageForStorage = async (imageUrl: string): Promise<{
  success: boolean;
  backgroundUrl?: string;
  error?: string;
}> => {
  try {
    let buffer: Buffer;

    // Check if it's already a data URL
    if (imageUrl.startsWith('data:')) {
      // Extract base64 data from data URL
      const base64Match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!base64Match) {
        throw new Error('Invalid data URL format');
      }

      const base64Data = base64Match[2];
      buffer = Buffer.from(base64Data, 'base64');

      logger.debug(`Processing data URL (${(buffer.length / 1024 / 1024).toFixed(2)}MB)`);
    } else {
      // Download the image from URL
      buffer = await downloadImageAsBuffer(imageUrl);
    }

    // Compress the image
    const { buffer: finalBuffer, mimeType: finalMimeType } = await compressImageBuffer(buffer);

    // Convert to base64 data URL
    const dataUrl = convertToBase64DataUrl(finalBuffer, finalMimeType);

    logger.debug(`Created data URL (${(dataUrl.length / 1024 / 1024).toFixed(2)}MB)`);

    return {
      success: true,
      backgroundUrl: dataUrl,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
    logger.error('Image processing failed:', { error: errorMessage });
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Upload image buffer to Supabase storage
 */
export const uploadToSupabaseStorage = async (
  buffer: Buffer,
  filePath: string,
  contentType: string = 'image/png'
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    logger.debug('Attempting Supabase storage upload...');

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
        cacheControl: '31536000',
      });

    if (uploadError) {
      logger.warn('Supabase upload failed:', { error: uploadError.message });
      return { success: false, error: uploadError.message };
    }

    // Try public URL first
    const { data: publicUrlData } = supabase.storage
      .from('generated-images')
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      logger.debug('Using Supabase public URL');
      return { success: true, url: publicUrlData.publicUrl };
    }

    // Fallback to signed URL
    const { data: signedData } = await supabase.storage
      .from('generated-images')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);

    if (signedData?.signedUrl) {
      logger.debug('Using Supabase signed URL');
      return { success: true, url: signedData.signedUrl };
    }

    return { success: false, error: 'Failed to get Supabase URL' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Storage upload failed';
    logger.error('Supabase storage error:', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
};

/**
 * Generate unique filename for AI-generated images
 */
export const generateImageFilename = (userId?: string, sessionId?: string): string => {
  const userPrefix = userId || sessionId || 'guest';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${userPrefix}/ai-generated/ai-bg-${timestamp}-${random}.png`;
};
