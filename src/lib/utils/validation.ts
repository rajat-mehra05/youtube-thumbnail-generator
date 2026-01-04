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

/**
 * Whitelist of allowed redirect paths
 * Only relative paths starting with '/' are allowed
 */
const ALLOWED_REDIRECT_PATHS = [
    '/',
    '/dashboard',
    '/create',
    '/create/ai',
    '/try',
    '/editor/guest',
];

/**
 * Get the safe origin for redirect URLs
 * Uses environment variable if available, otherwise falls back to window.location.origin
 * @returns The origin URL (e.g., 'https://example.com' or 'http://localhost:3000')
 */
export const getSafeOrigin = (): string => {
    // In server-side context, use request origin or environment variable
    if (typeof window === 'undefined') {
        // Server-side: prefer environment variable, but this function is mainly for client
        return '';
    }

    // Client-side: use window.location.origin (always correct for current environment)
    // This will be localhost in dev, production domain in prod
    return window.location.origin;
};

/**
 * Validate and sanitize a redirect path to prevent open redirect vulnerabilities
 */
export const validateRedirectPath = (
    redirectPath: string | null | undefined,
    fallback: string = '/dashboard'
): string => {
    if (typeof redirectPath !== 'string') {
        return fallback;
    }

    const path = redirectPath.trim();

    // Basic structural rules
    if (!path.startsWith('/')) return fallback;
    if (path === '//') return fallback;

    // Reject common open-redirect and traversal vectors
    const forbiddenPatterns = [
        '://',          // protocol-based redirects
        '\\',           // Windows path tricks
        '\u0000',       // null byte
    ];

    if (forbiddenPatterns.some(p => path.includes(p))) {
        return fallback;
    }

    // Reject scheme-relative URLs like //evil.com
    if (path.startsWith('//')) return fallback;

    // Reject path traversal (encoded or decoded)
    if (path.includes('..') || path.includes('%2e')) {
        return fallback;
    }

    // Normalize trailing slash, except root
    const normalizedPath =
        path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

    // Explicit dynamic route validation
    if (normalizedPath.startsWith('/editor/')) {
        const projectId = normalizedPath.slice('/editor/'.length);
        if (/^[a-zA-Z0-9_-]+$/.test(projectId)) {
            return normalizedPath;
        }
        return fallback;
    }

    // Static allow-list only
    const isAllowed = ALLOWED_REDIRECT_PATHS.includes(normalizedPath);
    return isAllowed ? normalizedPath : fallback;
};