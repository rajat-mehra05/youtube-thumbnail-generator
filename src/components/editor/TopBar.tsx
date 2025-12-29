'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Save,
  Download,
  Undo2,
  Redo2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROUTES, AVAILABLE_FONTS, COLOR_PALETTE } from '@/lib/constants';
import type { CanvasLayer, TextLayer } from '@/types';

interface TopBarProps {
  projectName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onExport: (format: 'png' | 'jpg') => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  saving?: boolean;
  exporting?: boolean;
  selectedLayer?: CanvasLayer | null;
  onUpdateLayer?: (id: string, updates: Partial<CanvasLayer>) => void;
  onDeleteLayer?: (id: string) => void;
  onDuplicateLayer?: (id: string) => void;
}

export const TopBar = ({
  projectName,
  onNameChange,
  onSave,
  onExport,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  saving = false,
  exporting = false,
  selectedLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
}: TopBarProps) => {
  const [editingName, setEditingName] = useState(false);

  const isTextLayer = selectedLayer?.type === 'text';
  const textLayer = selectedLayer as TextLayer | undefined;

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-2 gap-2">
      {/* Left Section - Navigation & Project Name */}
      <div className="flex items-center gap-2 min-w-[200px]">
        <Link
          href={ROUTES.DASHBOARD}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Back to projects"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {editingName ? (
          <Input
            value={projectName}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
            autoFocus
            className="h-8 w-40"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="px-2 py-1 rounded hover:bg-muted transition-colors text-sm font-medium truncate max-w-[150px] cursor-pointer"
          >
            {projectName}
          </button>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8"
          aria-label="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8"
          aria-label="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Contextual Toolbar - Shows when layer is selected */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto">
        {selectedLayer ? (
          <>
            {/* Text-specific controls */}
            {isTextLayer && textLayer && onUpdateLayer && (
              <>
                {/* Font Family */}
                <Select
                  value={textLayer.fontFamily}
                  onValueChange={(value) =>
                    onUpdateLayer(textLayer.id, { fontFamily: value })
                  }
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_FONTS.map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Font Size */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onUpdateLayer(textLayer.id, {
                        fontSize: Math.max(8, textLayer.fontSize - 4),
                      })
                    }
                    className="h-8 w-8"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={textLayer.fontSize}
                    onChange={(e) =>
                      onUpdateLayer(textLayer.id, {
                        fontSize: parseInt(e.target.value) || 24,
                      })
                    }
                    className="w-16 h-8 text-center"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onUpdateLayer(textLayer.id, {
                        fontSize: textLayer.fontSize + 4,
                      })
                    }
                    className="h-8 w-8"
                  >
                    +
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Bold/Italic */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={
                      textLayer.fontStyle?.includes('bold') ? 'secondary' : 'ghost'
                    }
                    size="icon"
                    onClick={() => {
                      const isBold = textLayer.fontStyle?.includes('bold');
                      const isItalic = textLayer.fontStyle?.includes('italic');
                      let newStyle: 'normal' | 'bold' | 'italic' | 'bold italic' =
                        'normal';
                      if (!isBold && isItalic) newStyle = 'bold italic';
                      else if (!isBold) newStyle = 'bold';
                      else if (isItalic) newStyle = 'italic';
                      onUpdateLayer(textLayer.id, { fontStyle: newStyle });
                    }}
                    className="h-8 w-8"
                    aria-label="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={
                      textLayer.fontStyle?.includes('italic') ? 'secondary' : 'ghost'
                    }
                    size="icon"
                    onClick={() => {
                      const isBold = textLayer.fontStyle?.includes('bold');
                      const isItalic = textLayer.fontStyle?.includes('italic');
                      let newStyle: 'normal' | 'bold' | 'italic' | 'bold italic' =
                        'normal';
                      if (isBold && !isItalic) newStyle = 'bold italic';
                      else if (!isItalic) newStyle = 'italic';
                      else if (isBold) newStyle = 'bold';
                      onUpdateLayer(textLayer.id, { fontStyle: newStyle });
                    }}
                    className="h-8 w-8"
                    aria-label="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Text Color */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 px-2 gap-2">
                      <div
                        className="w-5 h-5 rounded border border-border"
                        style={{ backgroundColor: textLayer.fill }}
                      />
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 p-2">
                    <div className="grid grid-cols-6 gap-1 mb-2">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            onUpdateLayer(textLayer.id, { fill: color })
                          }
                          className={`w-6 h-6 rounded border-2 transition-all cursor-pointer ${
                            textLayer.fill === color
                              ? 'border-violet-500 scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={textLayer.fill}
                      onChange={(e) =>
                        onUpdateLayer(textLayer.id, { fill: e.target.value })
                      }
                      className="w-full h-8"
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <Separator orientation="vertical" className="h-6" />

                {/* Alignment */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={textLayer.align === 'left' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() =>
                      onUpdateLayer(textLayer.id, { align: 'left' })
                    }
                    className="h-8 w-8"
                    aria-label="Align left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={textLayer.align === 'center' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() =>
                      onUpdateLayer(textLayer.id, { align: 'center' })
                    }
                    className="h-8 w-8"
                    aria-label="Align center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={textLayer.align === 'right' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() =>
                      onUpdateLayer(textLayer.id, { align: 'right' })
                    }
                    className="h-8 w-8"
                    aria-label="Align right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}

            <div className="flex-1" />

            {/* Common Layer Actions */}
            <div className="flex items-center gap-1">
              {/* Visibility Toggle */}
              {onUpdateLayer && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, {
                      visible: !selectedLayer.visible,
                    })
                  }
                  className="h-8 w-8"
                  aria-label={selectedLayer.visible ? 'Hide' : 'Show'}
                >
                  {selectedLayer.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              )}

              {/* Lock Toggle */}
              {onUpdateLayer && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, {
                      locked: !selectedLayer.locked,
                    })
                  }
                  className="h-8 w-8"
                  aria-label={selectedLayer.locked ? 'Unlock' : 'Lock'}
                >
                  {selectedLayer.locked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </Button>
              )}

              <Separator orientation="vertical" className="h-6" />

              {/* Duplicate */}
              {onDuplicateLayer && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDuplicateLayer(selectedLayer.id)}
                  className="h-8 w-8"
                  aria-label="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}

              {/* Delete */}
              {onDeleteLayer && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteLayer(selectedLayer.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Select an element to edit
          </div>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Right Section - Save & Export */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="h-8"
        >
          <Save className="w-4 h-4 mr-1" />
          {saving ? 'Saving...' : 'Save'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              disabled={exporting}
              className="h-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
            >
              <Download className="w-4 h-4 mr-1" />
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('png')}>
              Download as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('jpg')}>
              Download as JPG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

