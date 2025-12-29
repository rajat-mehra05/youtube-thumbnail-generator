import { toast } from 'sonner';
import { extractErrorMessage, isError } from '@/lib/utils/error-handling';
import type { ApiResponse, ApiSuccess, ApiFailure } from '@/types/api';
import { isApiSuccess, isApiFailure } from '@/types/api';

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

  if (isApiSuccess(response)) {
    if (successMessage && showToast) {
      toast.success(successMessage);
    }
    onSuccess?.(response.data);
    return true;
  } else {
    // Handle both explicit failures and success responses with missing data
    const errorMessage = isApiFailure(response)
      ? response.error
      : 'Success response received but data is missing';
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
