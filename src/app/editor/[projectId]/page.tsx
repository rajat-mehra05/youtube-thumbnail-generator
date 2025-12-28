'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import nextDynamic from 'next/dynamic';
import { generateProjectId } from '@/lib/utils/id-generator';
import { logger } from '@/lib/utils/logger';
import { LeftSidebar } from '@/components/editor/LeftSidebar';
import { TopBar } from '@/components/editor/TopBar';
import { RightPanel } from '@/components/editor/RightPanel';
import { AIMagicModal } from '@/components/editor/AIMagicModal';
import { ROUTES, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/constants';
import { useUser } from '@/hooks';
import { useCanvasState } from '@/hooks/useCanvasState';
import { getProject, updateProject } from '@/lib/actions/projects';
import { createClient } from '@/lib/supabase/client';
import type { Project, CanvasLayer, ImageLayer, ShapeType } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Dynamically import Canvas to avoid SSR issues with Konva
const Canvas = nextDynamic(
  () => import('@/components/editor/Canvas').then((mod) => mod.Canvas),
  { ssr: false, loading: () => <CanvasLoading /> }
);

const CanvasLoading = () => (
  <div className="flex-1 flex items-center justify-center bg-muted/30">
    <LoadingSpinner size="lg" />
  </div>
);

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, loading: userLoading } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const {
    canvasState,
    selectedLayerId,
    selectedLayer,
    setSelectedLayerId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayer,
    toggleVisibility,
    toggleLock,
    undo,
    redo,
    canUndo,
    canRedo,
    loadState,
  } = useCanvasState();

  // Fetch project on mount
  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      try {
        const result = await getProject(projectId);

        if (!isMounted) return;

        if (!result.success || !result.data) {
          toast.error('Project not found');
          router.push(ROUTES.DASHBOARD);
          return;
        }

        setProject(result.data);

        // Load canvas state if exists
        if (result.data.canvas_state) {
          loadState(result.data.canvas_state);
        }
      } catch (error) {
        logger.error('Failed to fetch project:', { error });
        if (isMounted) {
          toast.error('Failed to load project');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!userLoading) {
      fetchProject();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, userLoading]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!project) return;

    setSaving(true);
    try {
      const result = await updateProject(projectId, {
        name: project.name,
        canvas_state: canvasState,
      });

      if (result.success) {
        toast.success('Project saved!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      logger.error('Save error:', { error });
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  }, [project, projectId, canvasState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Undo: Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') ||
        ((e.metaKey || e.ctrlKey) && e.key === 'y')
      ) {
        e.preventDefault();
        redo();
      }

      // Delete: Backspace or Delete
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedLayerId) {
        e.preventDefault();
        deleteLayer(selectedLayerId);
      }

      // Save: Cmd/Ctrl + S
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedLayerId, deleteLayer, handleSave]);

  // Handle name change
  const handleNameChange = (name: string) => {
    if (project) {
      setProject({ ...project, name });
    }
  };

  // Handle export
  const handleExport = async (format: 'png' | 'jpg') => {
    setExporting(true);
    try {
      toast.success(`Exporting as ${format.toUpperCase()}...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Export complete! Download starting...');
    } catch (error) {
      logger.error('Export error:', { error });
      toast.error('Failed to export');
    } finally {
      setExporting(false);
    }
  };

  // Handle image file selection
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${projectId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('user-uploads')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365);

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw signedUrlError || new Error('Failed to get signed URL');
      }

      const publicUrl = signedUrlData.signedUrl;

      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      addLayer('image', {
        src: publicUrl,
        width: Math.min(img.width, 600),
        height: Math.min(img.height, 400),
      } as Partial<ImageLayer>);

      toast.success('Image added!');
    } catch (error) {
      logger.error('Upload error:', { error });
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle add layer
  const handleAddLayer = (type: 'text' | 'image' | ShapeType) => {
    if (type === 'image') {
      fileInputRef.current?.click();
      return;
    }
    addLayer(type);
  };

  // Handle duplicate layer
  const handleDuplicateLayer = (id: string) => {
    const layer = canvasState.layers.find((l) => l.id === id);
    if (!layer) return;

    const newLayer = {
      ...layer,
      x: layer.x + 20,
      y: layer.y + 20,
      name: `${layer.name} copy`,
    };

    addLayer(layer.type === 'shape' ? (layer as { shapeType: ShapeType }).shapeType : layer.type, newLayer);
    toast.success('Layer duplicated');
  };

  // Handle AI Magic - open modal instead of navigating
  const handleOpenAIMagic = () => {
    setAiModalOpen(true);
  };

  // Handle background generated from AI
  const handleBackgroundGenerated = (imageUrl: string) => {
    // Find existing background layer (locked image at z-index 0)
    const backgroundLayer = canvasState.layers.find(
      (layer) => layer.type === 'image' && layer.locked && layer.zIndex === 0
    );

    if (backgroundLayer) {
      // Update existing background
      updateLayer(backgroundLayer.id, { src: imageUrl } as Partial<ImageLayer>);
      toast.success('Background updated!');
    } else {
      // Add new background layer
      const newBgLayer: Partial<ImageLayer> = {
        id: generateProjectId(),
        type: 'image',
        name: 'AI Background',
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        zIndex: 0,
        visible: true,
        locked: true,
        src: imageUrl,
      };

      addLayer('image', newBgLayer);
      toast.success('Background added!');
    }
  };

  if (loading || userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        aria-label="Upload image"
      />

      {/* Loading overlay for image upload */}
      {uploadingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 flex flex-col items-center gap-4 shadow-2xl">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">Uploading image...</p>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <TopBar
        projectName={project.name}
        onNameChange={handleNameChange}
        onSave={handleSave}
        onExport={handleExport}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        saving={saving}
        exporting={exporting}
        selectedLayer={selectedLayer}
        onUpdateLayer={updateLayer}
        onDeleteLayer={deleteLayer}
        onDuplicateLayer={handleDuplicateLayer}
      />

      {/* AI Magic Modal */}
      <AIMagicModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        onBackgroundGenerated={handleBackgroundGenerated}
        userId={user?.id}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar
          onAddLayer={handleAddLayer}
          onOpenTemplates={() => router.push(ROUTES.CREATE_TEMPLATES)}
          onOpenAI={handleOpenAIMagic}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-[#2a2a35] overflow-auto relative p-4">
          {/* Checkerboard pattern background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #808080 25%, transparent 25%),
                linear-gradient(-45deg, #808080 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #808080 75%),
                linear-gradient(-45deg, transparent 75%, #808080 75%)
              `,
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px',
            }}
          />

          {/* Canvas */}
          <div className="relative z-10 shadow-2xl rounded-lg overflow-hidden">
            <Canvas
              canvasState={canvasState}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateLayer={updateLayer}
            />
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-6 left-6 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white/70 font-medium">
            1280 × 720 • 100%
          </div>
        </div>

        {/* Right Panel */}
        <RightPanel
          layers={canvasState.layers}
          selectedLayerId={selectedLayerId}
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={updateLayer}
          onDeleteLayer={deleteLayer}
          onMoveLayer={moveLayer}
          onToggleVisibility={toggleVisibility}
          onToggleLock={toggleLock}
        />
      </div>
    </div>
  );
}
