import type {
  Project,
  Template,
  Thumbnail,
} from './index';

/**
 * Centralized API response and error types
 * No 'any' types allowed - strict TypeScript enforcement
 */

// Base API Response type - no default generic parameter
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Specific API response types for common operations
export type ProjectResponse = ApiResponse<Project>;
export type ProjectsResponse = ApiResponse<Project[]>;
export type ProjectMutationResponse = ApiResponse<Project>;
export type ProjectDeletionResponse = ApiResponse<{ deletedCount: number }>;

export type TemplateResponse = ApiResponse<Template>;
export type TemplatesResponse = ApiResponse<Template[]>;

export type ThumbnailResponse = ApiResponse<Thumbnail>;
export type ThumbnailsResponse = ApiResponse<Thumbnail[]>;

export type ImageGenerationResponse = ApiResponse<{ imageUrl: string }>;
export type ImageUploadResponse = ApiResponse<{ backgroundUrl: string }>;

// Bulk operations
export type BulkDeleteResponse = ApiResponse<{ deletedCount: number }>;

// Error types with proper structure
export type ApiError = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

// Type guard for API errors
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
};

// Type guard for API responses
export const isApiResponse = <T>(
  response: unknown
): response is ApiResponse<T> => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    typeof (response as ApiResponse<T>).success === 'boolean'
  );
};

// Utility type for successful responses
export type ApiSuccess<T> = ApiResponse<T> & { success: true; data: T };

// Utility type for error responses
export type ApiFailure = ApiResponse<never> & { success: false; error: string };

// Type guard for successful responses
export const isApiSuccess = <T>(
  response: ApiResponse<T>
): response is ApiSuccess<T> => {
  return response.success === true && response.data !== undefined;
};

// Type guard for failed responses
export const isApiFailure = (
  response: ApiResponse<unknown>
): response is ApiFailure => {
  return response.success === false && response.error !== undefined;
};

// Generic result type for operations that may succeed or fail
export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

// Convert API response to Result type
export const apiResponseToResult = <T>(
  response: ApiResponse<T>
): Result<T, string> => {
  if (isApiSuccess(response)) {
    return { success: true, data: response.data };
  } else {
    return { success: false, error: response.error || 'Unknown error' };
  }
};