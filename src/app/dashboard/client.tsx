'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProjectGrid } from '@/components/dashboard/ProjectGrid';
import { deleteProject, duplicateProject } from '@/lib/actions/projects';
import { useGuestTransfer } from '@/hooks';
import type { Project } from '@/types';

interface DashboardClientProps {
  initialProjects: Project[];
}

export const DashboardClient = ({ initialProjects }: DashboardClientProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {transferring && (
        <div className="mb-6 p-4 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
          <p className="text-sm text-violet-600 dark:text-violet-400">
            Transferring your guest thumbnail...
          </p>
        </div>
      )}
      <ProjectGrid
        projects={projects}
        loading={loading}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </>
  );
};
