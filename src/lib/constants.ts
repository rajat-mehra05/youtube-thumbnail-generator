// Application constants

export const APP_NAME = 'ThumbnailAI';
export const APP_DESCRIPTION = 'Create stunning YouTube thumbnails in seconds with AI';

// Canvas dimensions (YouTube thumbnail standard)
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const CANVAS_ASPECT_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT;

// Preview dimensions (for editor) - larger for better editing
export const PREVIEW_WIDTH = 1024;
export const PREVIEW_HEIGHT = 576;

// Template categories with labels
export const TEMPLATE_CATEGORIES = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'vlog', label: 'Vlog / Lifestyle' },
  { value: 'tutorial', label: 'Tutorial / How-to' },
  { value: 'podcast', label: 'Podcast / Interview' },
  { value: 'reaction', label: 'Reaction / Commentary' },
  { value: 'business', label: 'Business / Marketing' },
] as const;

// Emotions with labels
export const EMOTIONS = [
  { value: 'excited', label: 'Excited', emoji: '🤩' },
  { value: 'shocked', label: 'Shocked', emoji: '😱' },
  { value: 'curious', label: 'Curious', emoji: '🤔' },
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'serious', label: 'Serious', emoji: '😐' },
] as const;

// Style preferences
export const STYLE_PREFERENCES = [
  { value: 'bold_text', label: 'Bold Text' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'colorful', label: 'Colorful' },
  { value: 'dark', label: 'Dark' },
  { value: 'professional', label: 'Professional' },
] as const;

// Image styles for AI generation
export const IMAGE_STYLES = [
  { value: 'auto', label: 'Auto', description: 'Let AI decide the best style' },
  { value: 'cinematic', label: 'Cinematic', description: 'Photorealistic, movie-like' },
  { value: '3d_scene', label: '3D Scene', description: '3D rendered environments' },
  { value: 'anime', label: 'Anime', description: 'Anime/manga illustration' },
  { value: 'artistic', label: 'Artistic', description: 'Painterly, artistic style' },
  { value: 'digital_art', label: 'Digital Art', description: 'Modern digital artwork' },
  { value: 'educational', label: 'Educational', description: 'Clean, informative' },
  { value: 'fantasy_world', label: 'Fantasy World', description: 'Fantasy & sci-fi' },
  { value: 'prototyping', label: 'Prototyping & Mockup', description: 'UI/UX mockups' },
] as const;

// Aspect ratios for thumbnails
export const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9', description: 'YouTube Standard', width: 1280, height: 720, dallESize: '1792x1024' },
  { value: '1:1', label: '1:1', description: 'Square (Instagram)', width: 1024, height: 1024, dallESize: '1024x1024' },
  { value: '4:3', label: '4:3', description: 'Classic', width: 1024, height: 768, dallESize: '1024x1024' },
  { value: '3:4', label: '3:4', description: 'Portrait', width: 768, height: 1024, dallESize: '1024x1024' },
  { value: '9:16', label: '9:16', description: 'Vertical (Shorts)', width: 720, height: 1280, dallESize: '1024x1792' },
] as const;

// Helper function to get canvas dimensions based on aspect ratio
export const getCanvasDimensions = (aspectRatio: string) => {
  const ratio = ASPECT_RATIOS.find(r => r.value === aspectRatio);
  return ratio ? { width: ratio.width, height: ratio.height } : { width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
};

// Helper function to get DALL-E image size based on aspect ratio
export const getDallESize = (aspectRatio: string): '1024x1024' | '1792x1024' | '1024x1792' => {
  const ratio = ASPECT_RATIOS.find(r => r.value === aspectRatio);
  return (ratio?.dallESize as '1024x1024' | '1792x1024' | '1024x1792') || '1792x1024';
};

// Guest limits
export const GUEST_MAX_GENERATIONS = 1;
export const GUEST_SESSION_EXPIRY_HOURS = 24;

// Upload limits
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_DIMENSION = 4096;

// Default fonts available in the editor
export const AVAILABLE_FONTS = [
  'Inter',
  'Montserrat',
  'Poppins',
  'Roboto',
  'Open Sans',
  'Oswald',
  'Bebas Neue',
  'Impact',
  'Anton',
  'Bangers',
] as const;

// Default colors palette
export const COLOR_PALETTE = [
  '#FFFFFF', // White
  '#000000', // Black
  '#FF0000', // Red
  '#FF6B00', // Orange
  '#FFDD00', // Yellow
  '#00FF00', // Green
  '#00DDFF', // Cyan
  '#0066FF', // Blue
  '#8B00FF', // Purple
  '#FF00AA', // Pink
] as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  TRY: '/try',
  DASHBOARD: '/dashboard',
  CREATE: '/create',
  CREATE_AI: '/create/ai',
  CREATE_UPLOAD: '/create/upload',
  CREATE_TEMPLATES: '/create/templates',
  EDITOR: (projectId: string) => `/editor/${projectId}`,
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/create',
  '/editor',
] as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/try',
] as const;
