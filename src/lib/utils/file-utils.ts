import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '@/lib/constants';

/**
 * File validation and utility functions
 * Strict TypeScript with no 'any' types
 */

// MIME type union for allowed image types
type AllowedMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

// Create typed array of allowed MIME types
const ALLOWED_MIME_TYPES: readonly AllowedMimeType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
] as const;

/**
 * Validate file size against maximum allowed size
 */
export const validateFileSize = (file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

/**
 * Validate file type against allowed image types
 */
export const validateFileType = (file: File): boolean => {
  return ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType);
};

/**
 * Type guard to check if a MIME type is allowed
 */
export const isAllowedMimeType = (mimeType: string): mimeType is AllowedMimeType => {
  return ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType);
};

/**
 * Validate image file (both size and type)
 */
export const validateImageFile = (file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!validateFileType(file)) {
    errors.push(`File type not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
  }

  if (!validateFileSize(file, maxSizeMB)) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)}MB`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file is an image based on extension
 */
export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
};
