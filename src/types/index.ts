// Database types matching Supabase schema

export type TemplateCategory =
  | 'gaming'
  | 'vlog'
  | 'tutorial'
  | 'podcast'
  | 'reaction'
  | 'business';

export type TemplateType = 'full_design' | 'layout_only';

export type EmotionType =
  | 'excited'
  | 'shocked'
  | 'curious'
  | 'happy'
  | 'serious';

export type StylePreference =
  | 'bold_text'
  | 'minimal'
  | 'colorful'
  | 'dark'
  | 'professional';

export type ImageStyle =
  | 'auto'
  | 'cinematic'
  | '3d_scene'
  | 'anime'
  | 'artistic'
  | 'digital_art'
  | 'educational'
  | 'fantasy_world'
  | 'prototyping';

export type AspectRatio = '16:9' | '1:1' | '4:3' | '3:4' | '9:16';

// User type from Supabase Auth
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

// Project types
export interface Project {
  id: string;
  user_id: string;
  name: string;
  video_title?: string;
  topic?: TemplateCategory;
  emotion?: EmotionType;
  style?: StylePreference;
  canvas_state?: CanvasState;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

// Thumbnail types
export interface Thumbnail {
  id: string;
  project_id: string;
  image_url: string;
  is_ai_generated: boolean;
  prompt_used?: string;
  created_at: string;
}

// Template types
export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  type: TemplateType;
  thumbnail_url: string;
  canvas_state: CanvasState;
  is_premium: boolean;
  created_at: string;
}

// Image types
export interface UploadedImage {
  id: string;
  user_id: string;
  project_id?: string;
  storage_path: string;
  public_url: string;
  width: number;
  height: number;
  mime_type: string;
  file_size: number;
  created_at: string;
}

// Guest session types
export interface GuestSession {
  sessionId: string;
  generationsUsed: number;
  generatedConceptId: string | null;
  createdAt: string;
}

export interface GuestSessionDB {
  id: string;
  generations_used: number;
  concept_data: ConceptData | null;
  converted_to_user: string | null;
  created_at: string;
  expires_at: string;
}

// AI Generation types
export interface ConceptData {
  headline: string;
  subheadline?: string;
  text_position?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  layout_hints?: LayoutHint[];
  background_prompt: string;
  color_scheme: string[];
  style: StylePreference;
}

export interface LayoutHint {
  element_type: 'text' | 'image' | 'shape';
  position: { x: number; y: number };
  size: { width: number; height: number };
  z_index: number;
}

export interface GeneratedConcept {
  id: string;
  concept_data: ConceptData;
  preview_url?: string;
  created_at: string;
}

// Canvas state types (Konva-compatible)
export interface CanvasState {
  width: number;
  height: number;
  layers: CanvasLayer[];
}

export type CanvasLayer = TextLayer | ImageLayer | ShapeLayer;

export interface BaseLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  name: string;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: 'normal' | 'bold' | 'italic' | 'bold italic';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  align: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  letterSpacing?: number;
  lineHeight?: number;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'arrow' | 'line';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
}

// Cache types
export interface CacheEntry {
  id: string;
  cache_key: string;
  cache_type: 'llm_response' | 'image_generation';
  data: unknown;
  created_at: string;
  expires_at: string;
}

// Usage tracking types
export interface UsageLog {
  id: string;
  user_id: string;
  action_type: 'ai_generation' | 'image_generation' | 'export';
  credits_used: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form types for AI generation
export interface AIGenerationFormData {
  videoTitle: string;
  topic: TemplateCategory;
  emotion: EmotionType;
  style: StylePreference;
  imageStyle: ImageStyle;
  aspectRatio: AspectRatio;
  referenceImageUrl?: string;
}
