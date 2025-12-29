import { v4 as uuidv4 } from 'uuid';

/**
 * ID generation utilities
 */

/**
 * Generate a unique ID using UUID v4
 */
export const generateId = (): string => uuidv4();

/**
 * Generate a project ID with prefix
 */
export const generateProjectId = (): string => `project_${generateId()}`;

/**
 * Generate a layer ID with prefix
 */
export const generateLayerId = (): string => `layer_${generateId()}`;

/**
 * Generate an image ID with prefix
 */
export const generateImageId = (): string => `image_${generateId()}`;

/**
 * Generate a session ID with prefix
 */
export const generateSessionId = (): string => `session_${generateId()}`;

/**
 * Cache parameter types - only allow serializable values
 */
type CacheParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Generate a cache key with prefix
 */
export const generateCacheKey = (type: string, params: CacheParams): string => {
  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${String(value ?? 'null')}`)
    .join('|');
  return `${type}_${paramString}`;
};
