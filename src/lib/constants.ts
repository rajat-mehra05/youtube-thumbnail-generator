// Application constants

export const APP_NAME = 'ThumbnailAI';
export const APP_DESCRIPTION = 'Create stunning YouTube thumbnails in seconds with AI';

// Canvas dimensions (YouTube thumbnail standard)
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const CANVAS_ASPECT_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT;

// Preview dimensions (for editor)
export const PREVIEW_WIDTH = 640;
export const PREVIEW_HEIGHT = 360;

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
