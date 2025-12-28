/**
 * String formatting and manipulation utilities
 */

/**
 * Truncate a string to a maximum length and add ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
};

/**
 * Truncate a URL for display/logging purposes
 */
export const truncateUrl = (url: string, maxLength: number = 100): string => {
    return truncateString(url, maxLength);
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert a string to title case
 */
export const toTitleCase = (str: string): string => {
    return str.split(' ')
        .map(word => capitalize(word))
        .join(' ');
};

/**
 * Remove extra whitespace from a string
 */
export const normalizeWhitespace = (str: string): string => {
    return str.trim().replace(/\s+/g, ' ');
};

/**
 * Check if a string is empty or contains only whitespace
 */
export const isEmptyOrWhitespace = (str: string): boolean => {
    return !str || str.trim().length === 0;
};

/**
 * Generate a slug from a string
 */
export const slugify = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Format a number as a string with leading zeros
 */
export const padNumber = (num: number, width: number): string => {
    return num.toString().padStart(width, '0');
};

/**
 * Extract initials from a name
 */
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
};
