'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { deleteProject, duplicateProject, bulkDeleteProjects, deleteAllProjects } from '@/lib/actions/projects/mutate';
import { useGuestTransfer } from '@/hooks';
import type { Project } from '@/types';

interface DashboardClientProps {
  initialProjects: Project[];
}

export const DashboardClient = ({ initialProjects }: DashboardClientProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  // Handle guest transfer if applicable
  const { transferring, transferred, projectId } = useGuestTransfer();

  useEffect(() => {
    if (transferred && projectId) {
      toast.success('Your guest thumbnail has been transferred!');
    }
  }, [transferred, projectId]);


  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      const result = await deleteProject(id);

      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success('Project deleted');
      } else {
        toast.error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    setLoading(true);
    try {
      const result = await duplicateProject(id);

      if (result.success && result.project) {
        setProjects((prev) => [result.project!, ...prev]);
        toast.success('Project duplicated');
      } else {
        toast.error(result.error || 'Failed to duplicate project');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelection = (id: string) => {
    setSelectedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProjects.size === projects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(projects.map((p) => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedProjects.size;
    if (count === 0) return;

    if (!confirm(`Are you sure you want to delete ${count} project${count !== 1 ? 's' : ''}?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await bulkDeleteProjects(Array.from(selectedProjects));

      if (result.success) {
        setProjects((prev) => prev.filter((p) => !selectedProjects.has(p.id)));
        setSelectedProjects(new Set());
        setSelectionMode(false);
        toast.success(`${count} project${count !== 1 ? 's' : ''} deleted`);
      } else {
        toast.error(result.error || 'Failed to delete projects');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (projects.length === 0) return;

    if (!confirm(`Are you sure you want to delete ALL ${projects.length} projects? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteAllProjects();

      if (result.success) {
        setProjects([]);
        setSelectedProjects(new Set());
        setSelectionMode(false);
        toast.success(`All projects deleted (${result.deletedCount || 0} items)`);
      } else {
        toast.error(result.error || 'Failed to delete all projects');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedProjects(new Set());
  };

  return (
    <>
      {transferring && (
        <div className="mb-6 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
          <p className="text-sm text-violet-600 dark:text-violet-400">
            Transferring your guest thumbnail...
          </p>
        </div>
      )}

      {/* Bulk Action Toolbar */}
      {projects.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          {!selectionMode ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectionMode(true)}
              disabled={loading}
            >
              Select Projects
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={loading}
              >
                {selectedProjects.size === projects.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={loading || selectedProjects.size === 0}
              >
                Delete Selected ({selectedProjects.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelSelection}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          )}

          {!selectionMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAll}
              disabled={loading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete All Projects
            </Button>
          )}
        </div>
      )}

      <ProjectGrid
        projects={projects}
        loading={loading}
        selectionMode={selectionMode}
        selectedProjects={selectedProjects}
        onToggleSelection={handleToggleSelection}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </>
  );
};
