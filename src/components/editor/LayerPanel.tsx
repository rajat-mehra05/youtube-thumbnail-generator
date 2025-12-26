'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CanvasLayer } from '@/types';

interface LayerPanelProps {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onAddLayer: (type: 'text' | 'image' | 'shape') => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
}

export const LayerPanel = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onMoveLayer,
  onToggleVisibility,
  onToggleLock,
}: LayerPanelProps) => {
  // Sort layers by z-index (highest first for display)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return '📝';
      case 'image':
        return '🖼️';
      case 'shape':
        return '⬜';
      default:
        return '📦';
    }
  };

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Layers</h2>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedLayers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No layers yet
          </div>
        ) : (
          sortedLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedLayerId === layer.id
                  ? 'bg-violet-500/10 border border-violet-500/30'
                  : 'hover:bg-muted'
              }`}
            >
              <span className="text-lg">{getLayerIcon(layer.type)}</span>
              <span className="flex-1 text-sm truncate">{layer.name}</span>

              {/* Visibility toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className={`p-1 rounded hover:bg-muted-foreground/10 text-xs ${
                  layer.visible ? 'text-foreground' : 'text-muted-foreground'
                }`}
                title={layer.visible ? 'Hide layer' : 'Show layer'}
              >
                {layer.visible ? '👁️' : '👁️‍🗨️'}
              </button>

              {/* Lock toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(layer.id);
                }}
                className={`p-1 rounded hover:bg-muted-foreground/10 text-xs ${
                  layer.locked ? 'text-amber-500' : 'text-muted-foreground'
                }`}
                title={layer.locked ? 'Unlock layer' : 'Lock layer'}
              >
                {layer.locked ? '🔒' : '🔓'}
              </button>
            </div>
          ))
        )}
      </div>

      <Separator />

      {/* Add Layer Buttons */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground mb-2">Add Layer</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLayer('text')}
            className="flex flex-col gap-1 h-auto py-2"
          >
            <span>📝</span>
            <span className="text-xs">Text</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLayer('image')}
            className="flex flex-col gap-1 h-auto py-2"
          >
            <span>🖼️</span>
            <span className="text-xs">Image</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddLayer('shape')}
            className="flex flex-col gap-1 h-auto py-2"
          >
            <span>⬜</span>
            <span className="text-xs">Shape</span>
          </Button>
        </div>
      </div>

      {/* Selected Layer Actions */}
      {selectedLayerId && (
        <>
          <Separator />
          <div className="p-4 space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMoveLayer(selectedLayerId, 'up')}
                className="flex-1"
              >
                ↑ Up
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMoveLayer(selectedLayerId, 'down')}
                className="flex-1"
              >
                ↓ Down
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteLayer(selectedLayerId)}
              className="w-full"
            >
              Delete Layer
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
