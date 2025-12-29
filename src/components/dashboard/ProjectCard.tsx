'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/lib/constants';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export const ProjectCard = ({
  project,
  selectionMode = false,
  isSelected = false,
  onToggleSelection,
  onDelete,
  onDuplicate,
}: ProjectCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(project.updated_at), {
    addSuffix: true,
  });

  const handleCardClick = (e: React.MouseEvent) => {
    if (selectionMode) {
      e.preventDefault();
      onToggleSelection?.(project.id);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleSelection?.(project.id);
  };

  return (
    <Card
      className={`group overflow-hidden hover:shadow-lg transition-all duration-200 ${selectionMode ? 'cursor-pointer' : ''
        } ${isSelected ? 'ring-2 ring-violet-500 border-violet-500' : 'hover:border-violet-500/30'
        }`}
      onClick={handleCardClick}
    >
      <div className={selectionMode ? 'pointer-events-none' : ''}>
        <Link href={ROUTES.EDITOR(project.id)}>
          <CardContent className="p-0">
            <div className="aspect-video bg-muted relative overflow-hidden">
              {project.thumbnail_url ? (
                <Image
                  src={project.thumbnail_url}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
                  <div className="text-4xl">🖼️</div>
                </div>
              )}

              {/* Selection Checkbox */}
              {selectionMode && (
                <div
                  className="absolute top-3 left-3 pointer-events-auto z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 rounded border-2 border-white bg-white/90 checked:bg-violet-600 checked:border-violet-600 cursor-pointer"
                    aria-label={`Select ${project.name}`}
                  />
                </div>
              )}

              {/* Selected Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-violet-600/20 pointer-events-none" />
              )}

              {/* Hover overlay - hide in selection mode */}
              {!selectionMode && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shadow-lg"
                  >
                    Edit Project
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Link>
      </div>

      <CardFooter className="p-3 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-sm truncate">{project.name}</h3>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>

        {!selectionMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Project options"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={ROUTES.EDITOR(project.id)}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(project.id)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(project.id)}
                className="text-red-600 focus:text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};
