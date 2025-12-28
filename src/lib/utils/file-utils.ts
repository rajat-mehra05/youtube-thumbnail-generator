import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '@/lib/constants';

/**
 * File validation and utility functions
 */

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
  return ALLOWED_IMAGE_TYPES.includes(file.type as any);
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
