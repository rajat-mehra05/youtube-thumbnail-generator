/**
 * Component prop interfaces - strict TypeScript definitions
 * No 'any' types allowed in component props
 */

import type { ReactNode, FormEvent } from 'react';
import type {
  TemplateCategory,
  EmotionType,
  StylePreference,
  ImageStyle,
  AspectRatio,
  ShapeType,
  Project,
  CanvasLayer
} from './index';

// Form field component props
export interface VideoTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export interface TopicSelectProps {
  value: TemplateCategory | '';
  onChange: (value: TemplateCategory | '') => void;
  disabled?: boolean;
}

export interface EmotionSelectProps {
  value: EmotionType | '';
  onChange: (value: EmotionType | '') => void;
  disabled?: boolean;
}

export interface StyleSelectProps {
  value: StylePreference | '';
  onChange: (value: StylePreference | '') => void;
  disabled?: boolean;
}

export interface ImageStyleSelectProps {
  value: ImageStyle;
  onChange: (value: ImageStyle) => void;
  disabled?: boolean;
}

export interface AspectRatioSelectProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  disabled?: boolean;
}

export interface ReferenceImageFieldProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

// Editor component props
export interface CanvasProps {
  canvasState: import('./index').CanvasState;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  previewMode?: boolean;
}

export interface LeftSidebarProps {
  onAddLayer: (type: 'text' | 'image' | ShapeType) => void;
  onOpenTemplates?: () => void;
  onOpenAI?: () => void;
}

export interface LayerPanelProps {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onAddLayer: (type: 'text' | 'image' | 'shape') => void;
}

export interface PropertiesPanelProps {
  selectedLayer: CanvasLayer | null;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
}

export interface ToolbarProps {
  projectName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  saving: boolean;
  exporting: boolean;
}

// Dashboard component props
export interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  selectionMode?: boolean;
  selectedProjects?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export interface ProjectCardProps {
  project: Project;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onClick?: () => void;
}

// Upload component props
export interface ImageDropzoneProps {
  onFileChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
  maxSizeMB?: number;
}

export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Template component props
export interface TemplateGridProps {
  templates: import('./index').Template[];
  loading?: boolean;
  onSelect: (template: import('./index').Template) => void;
}

export interface TemplateCardProps {
  template: import('./index').Template;
  onSelect: () => void;
}

// Authentication component props
export interface AuthWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export interface LoginFormProps {
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading?: boolean;
  error?: string;
}

export interface SignupFormProps {
  onFullNameChange: (fullName: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading?: boolean;
  error?: string;
}

export interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// Page component props
export interface DashboardClientProps {
  initialProjects: Project[];
}

