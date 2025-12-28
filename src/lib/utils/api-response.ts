import { toast } from 'sonner';
import { extractErrorMessage, isError } from '@/lib/utils/error-handling';
import type { ApiResponse, ApiSuccess, ApiFailure } from '@/types/api';

/**
 * API response handling utilities
 * All functions now use strict typing with no 'any' types
 */

/**
 * Handle API response with standardized success/error handling
 */
export const handleApiResponse = <T>(
  response: ApiResponse<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    successMessage?: string;
    showToast?: boolean;
  } = {}
): boolean => {
  const { onSuccess, onError, successMessage, showToast = true } = options;

  if (response.success) {
    if (successMessage && showToast) {
      toast.success(successMessage);
    }
    onSuccess?.(response.data as T);
    return true;
  } else {
    const errorMessage = response.error || 'An error occurred';
    if (showToast) {
      toast.error(errorMessage);
    }
    onError?.(errorMessage);
    return false;
  }
};

/**
 * Create a standardized API response
 */
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string
): ApiResponse<T> => ({
  success,
  data,
  error,
});

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown, fallback: string = 'An error occurred'): string => {
  return extractErrorMessage(error, fallback);
};

/**
 * Create API error response
 */
export const createApiError = (error: unknown, fallback?: string): ApiFailure => ({
  success: false,
  error: getErrorMessage(error, fallback || 'An error occurred'),
});

/**
 * Handle async API calls with loading state
 */
export const handleAsyncApiCall = <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    successMessage?: string;
    showToast?: boolean;
    setLoading?: (loading: boolean) => void;
  } = {}
): Promise<boolean> => {
  const { setLoading, ...responseOptions } = options;

  return (async () => {
    try {
      setLoading?.(true);
      const response = await apiCall();
      return handleApiResponse(response, responseOptions);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      if (responseOptions.showToast !== false) {
        toast.error(errorMessage);
      }
      responseOptions.onError?.(errorMessage);
      return false;
    } finally {
      setLoading?.(false);
    }
  })();
};
