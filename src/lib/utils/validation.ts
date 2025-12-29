/**
 * Form validation utilities
 */

/**
 * Check if a string is non-empty after trimming whitespace
 */
export const isNonEmptyString = (str: string): boolean => str.trim().length > 0;

/**
 * Validate that all required form fields are present
 * Uses generic constraint to allow any object type while maintaining type safety
 */
export const validateRequiredFields = <T extends Record<string, unknown>>(fields: T): boolean => {
    return Object.values(fields).every(field =>
        field !== null && field !== undefined && field !== ''
    );
};

/**
 * Validate form data for AI generation
 */
export const validateAIGenerationForm = (data: {
    videoTitle: string;
    topic: string;
    emotion: string;
}): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!isNonEmptyString(data.videoTitle)) {
        errors.push('Video title is required');
    }

    if (!data.topic) {
        errors.push('Topic is required');
    }

    if (!data.emotion) {
        errors.push('Emotion is required');
    }

    return { isValid: errors.length === 0, errors };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

