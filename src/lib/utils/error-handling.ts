/**
 * Error handling utilities with strict TypeScript types
 * No 'any' types allowed - proper type guards and safety
 */

/**
 * Type guard to check if a value is an Error instance
 */
export const isError = (error: unknown): error is Error => {
    return error instanceof Error;
};

/**
 * Type guard to check if a value is an object with a message property
 */
export const hasMessageProperty = (obj: unknown): obj is { message: unknown } => {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'message' in obj
    );
};

/**
 * Type guard to check if a value is a string
 */
export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

/**
 * Safely extract a string message from various error types
 */
const extractStringMessage = (message: unknown): string | null => {
    if (isString(message)) {
        return message;
    }

    if (message !== null && message !== undefined) {
        return String(message);
    }

    return null;
};

/**
 * Extract a meaningful error message from an unknown error value
 * @param error - The error to extract message from
 * @param fallback - Fallback message if error cannot be parsed
 * @returns A string error message
 */
export const extractErrorMessage = (error: unknown, fallback: string): string => {
    // Check if it's a proper Error instance
    if (isError(error)) {
        return error.message;
    }

    // Check if it's an object with a message property
    if (hasMessageProperty(error)) {
        const message = extractStringMessage(error.message);
        if (message !== null) {
            return message;
        }
    }

    // Check if it's a string directly
    if (isString(error)) {
        return error;
    }

    // Fallback to the provided fallback message
    return fallback;
};

/**
 * Create a standardized error message with context
 */
export const createErrorMessage = (
    operation: string,
    error: unknown,
    context?: Record<string, unknown>
): string => {
    const baseMessage = extractErrorMessage(error, `Failed to ${operation}`);
    if (context && Object.keys(context).length > 0) {
        const contextStr = Object.entries(context)
            .map(([key, value]) => `${key}: ${String(value)}`)
            .join(', ');
        return `${baseMessage} (${contextStr})`;
    }
    return baseMessage;
};

/**
 * Type-safe error wrapper for async operations
 */
export const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: Record<string, unknown>
): Promise<{ success: true; data: T } | { success: false; error: string }> => {
    try {
        const data = await operation();
        return { success: true, data };
    } catch (error) {
        const errorMessage = createErrorMessage(operationName, error, context);
        return { success: false, error: errorMessage };
    }
};