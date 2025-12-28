/**
 * Extract a meaningful error message from an unknown error value
 * @param error - The error to extract message from
 * @param fallback - Fallback message if error cannot be parsed
 * @returns A string error message
 */
export const extractErrorMessage = (error: unknown, fallback: string): string => {
    // Check if it's a proper Error instance
    if (error instanceof Error) {
        return error.message;
    }

    // Check if it's an object with a message property
    if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = (error as { message: unknown }).message;

        // Ensure the message is actually a string
        if (typeof message === 'string') {
            return message;
        }

        // If message exists but isn't a string, convert it safely
        if (message !== null && message !== undefined) {
            return String(message);
        }
    }

    // Check if it's a string directly
    if (typeof error === 'string') {
        return error;
    }

    // Fallback to the provided fallback message
    return fallback;
};