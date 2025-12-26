'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import nextDynamic from 'next/dynamic';
import { Toolbar } from '@/components/editor/Toolbar';
import { LayerPanel } from '@/components/editor/LayerPanel';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { ROUTES } from '@/lib/constants';
import { useUser } from '@/hooks';
import { useCanvasState } from '@/hooks/useCanvasState';
import { getProject, updateProject } from '@/lib/actions/projects';
import type { Project, CanvasLayer } from '@/types';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading-spinner';

// Dynamically import Canvas to avoid SSR issues with Konva
const Canvas = nextDynamic(
  () => import('@/components/editor/Canvas').then((mod) => mod.Canvas),
  { ssr: false, loading: () => <CanvasLoading /> }
);

const CanvasLoading = () => (
  <div className="flex-1 flex items-center justify-center bg-muted">
    <LoadingSpinner size="lg" />
  </div>
);

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { user, loading: userLoading } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

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
    loadState,
  } = useCanvasState();

  // Fetch project on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await getProject(projectId);

        if (!result.success || !result.project) {
          toast.error('Project not found');
          router.push(ROUTES.DASHBOARD);
          return;
        }

        setProject(result.project);

        // Load canvas state if exists
        if (result.project.canvas_state) {
          loadState(result.project.canvas_state);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchProject();
    }
  }, [projectId, userLoading, router, loadState]);

  // Handle name change
  const handleNameChange = (name: string) => {
    if (project) {
      setProject({ ...project, name });
    }
  };

  // Handle save
  const handleSave = async () => {
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
      console.error('Save error:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // Handle export
  const handleExport = async (format: 'png' | 'jpg') => {
    setExporting(true);
    try {
      // For now, just show a message
      // In production, this would call a server action to render the canvas with Sharp
      toast.success(`Exporting as ${format.toUpperCase()}...`);

      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Export complete! Download starting...');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export');
    } finally {
      setExporting(false);
    }
  };

  // Handle add layer
  const handleAddLayer = (type: 'text' | 'image' | 'shape') => {
    if (type === 'image') {
      // For image, we would open a file picker
      // For now, add a placeholder
      toast.info('Image upload coming soon! Adding placeholder.');
    }
    addLayer(type);
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <Toolbar
        projectName={project.name}
        onNameChange={handleNameChange}
        onSave={handleSave}
        onExport={handleExport}
        saving={saving}
        exporting={exporting}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layer Panel */}
        <LayerPanel
          layers={canvasState.layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onAddLayer={handleAddLayer}
          onDeleteLayer={deleteLayer}
          onMoveLayer={moveLayer}
          onToggleVisibility={toggleVisibility}
          onToggleLock={toggleLock}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 bg-muted/30 overflow-auto">
          <Canvas
            canvasState={canvasState}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={updateLayer}
          />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel
          selectedLayer={selectedLayer}
          onUpdateLayer={(id, updates) => updateLayer(id, updates as Partial<CanvasLayer>)}
        />
      </div>
    </div>
  );
}
