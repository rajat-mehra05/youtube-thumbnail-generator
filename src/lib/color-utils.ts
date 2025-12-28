/**
 * Color Utility Functions for Thumbnail Generation
 * Helps determine optimal text colors based on background
 */

/**
 * Calculate luminance of a color (0-1, where 0 is darkest and 1 is brightest)
 * Based on WCAG standards for contrast calculation
 */
export const calculateLuminance = (hexColor: string): number => {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21 (higher is better contrast)
 */
export const calculateContrast = (color1: string, color2: string): number => {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Determine if a background color is dark or light
 */
export const isDarkColor = (hexColor: string): boolean => {
  return calculateLuminance(hexColor) < 0.5;
};

/**
 * Get optimal text color (white or black) for a given background
 */
export const getOptimalTextColor = (backgroundColor: string): string => {
  return isDarkColor(backgroundColor) ? '#FFFFFF' : '#000000';
};

/**
 * Get optimal text stroke/outline color (opposite of fill color)
 */
export const getOptimalStrokeColor = (fillColor: string): string => {
  return isDarkColor(fillColor) ? '#FFFFFF' : '#000000';
};

/**
 * Generate high-contrast color scheme for thumbnails
 * Returns [accent1, accent2, textFill, textStroke]
 */
export const generateHighContrastScheme = (
  baseColor: string,
  isDarkBackground: boolean = true
): string[] => {
  const textFill = isDarkBackground ? '#FFFFFF' : '#000000';
  const textStroke = isDarkBackground ? '#000000' : '#FFFFFF';
  
  return [
    baseColor,
    adjustBrightness(baseColor, isDarkBackground ? 30 : -30),
    textFill,
    textStroke,
  ];
};

/**
 * Adjust brightness of a hex color
 */
export const adjustBrightness = (hexColor: string, percent: number): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const adjust = (value: number) => {
    const adjusted = value + (value * percent) / 100;
    return Math.max(0, Math.min(255, Math.round(adjusted)));
  };
  
  const newR = adjust(r).toString(16).padStart(2, '0');
  const newG = adjust(g).toString(16).padStart(2, '0');
  const newB = adjust(b).toString(16).padStart(2, '0');
  
  return `#${newR}${newG}${newB}`;
};

/**
 * Validate if color scheme has sufficient contrast for accessibility
 * Returns true if text and background have at least 4.5:1 contrast (WCAG AA)
 */
export const hasGoodContrast = (textColor: string, backgroundColor: string): boolean => {
  const contrast = calculateContrast(textColor, backgroundColor);
  return contrast >= 4.5; // WCAG AA standard for normal text
};

/**
 * Get YouTube-style color schemes optimized for thumbnails
 */
export const YOUTUBE_COLOR_SCHEMES = {
  energetic: ['#FF3366', '#FFA500', '#FFFFFF', '#000000'],
  cool: ['#00D4FF', '#6B5FFF', '#FFFFFF', '#000000'],
  warm: ['#FF6B35', '#FFD23F', '#FFFFFF', '#000000'],
  neon: ['#FF00FF', '#00FFFF', '#FFFFFF', '#000000'],
  classic: ['#FF0000', '#FFFF00', '#FFFFFF', '#000000'],
  professional: ['#2563EB', '#7C3AED', '#FFFFFF', '#000000'],
  vibrant: ['#F97316', '#EC4899', '#FFFFFF', '#000000'],
  dark: ['#8B5CF6', '#6366F1', '#FFFFFF', '#000000'],
} as const;

/**
 * Select best color scheme based on emotion and style
 */
export const selectColorScheme = (
  emotion: string,
  style: string
): string[] => {
  // Map emotion and style to color schemes
  if (emotion === 'excited' || emotion === 'shocked') {
    return YOUTUBE_COLOR_SCHEMES.energetic;
  } else if (emotion === 'curious') {
    return YOUTUBE_COLOR_SCHEMES.cool;
  } else if (emotion === 'happy') {
    return YOUTUBE_COLOR_SCHEMES.vibrant;
  } else if (emotion === 'serious') {
    return YOUTUBE_COLOR_SCHEMES.professional;
  }
  
  // Fallback based on style
  if (style === 'bold_text') {
    return YOUTUBE_COLOR_SCHEMES.classic;
  } else if (style === 'minimal') {
    return YOUTUBE_COLOR_SCHEMES.professional;
  } else if (style === 'colorful') {
    return YOUTUBE_COLOR_SCHEMES.neon;
  } else if (style === 'dark') {
    return YOUTUBE_COLOR_SCHEMES.dark;
  }
  
  return YOUTUBE_COLOR_SCHEMES.energetic;
};

