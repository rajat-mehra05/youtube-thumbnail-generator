'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/lib/constants';

interface ToolbarProps {
  projectName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onExport: (format: 'png' | 'jpg') => void;
  saving?: boolean;
  exporting?: boolean;
}

export const Toolbar = ({
  projectName,
  onNameChange,
  onSave,
  onExport,
  saving = false,
  exporting = false,
}: ToolbarProps) => {
  const [editing, setEditing] = useState(false);

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.DASHBOARD}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Projects
        </Link>

        {/* Project name */}
        {editing ? (
          <Input
            value={projectName}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setEditing(false);
            }}
            autoFocus
            className="h-8 w-48"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-sm font-medium hover:text-violet-500 transition-colors"
          >
            {projectName}
            <span className="text-muted-foreground">✏️</span>
          </button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              disabled={exporting}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
            >
              {exporting ? 'Exporting...' : 'Export ▼'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('png')}>
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('jpg')}>
              Export as JPG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
