'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from './ProjectCard';
import { ROUTES } from '@/lib/constants';
import type { Project } from '@/types';

interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  selectionMode?: boolean;
  selectedProjects?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export const ProjectGrid = ({
  projects,
  loading = false,
  selectionMode = false,
  selectedProjects = new Set(),
  onToggleSelection,
  onDelete,
  onDuplicate,
}: ProjectGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="aspect-video" />
            </CardContent>
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <span className="text-4xl">🎨</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Create your first thumbnail project and start designing!
        </p>
        <Link href={ROUTES.CREATE}>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-700 hover:to-fuchsia-700 transition-colors cursor-pointer">
            <span>+</span> Create New Project
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {/* Create New Card - hide in selection mode */}
      {!selectionMode && (
        <Link href={ROUTES.CREATE}>
          <Card className="overflow-hidden border-dashed hover:border-violet-500/50 hover:bg-violet-500/5 transition-all cursor-pointer h-full">
            <CardContent className="p-0 h-full flex items-center justify-center aspect-video">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-violet-600">+</span>
                </div>
                <p className="font-medium text-sm">Create New</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Project Cards */}
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          selectionMode={selectionMode}
          isSelected={selectedProjects.has(project.id)}
          onToggleSelection={onToggleSelection}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};
