'use client';

import { useState } from 'react';
import {
  Layers,
  Settings2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AVAILABLE_FONTS, COLOR_PALETTE } from '@/lib/constants';
import type { CanvasLayer, TextLayer } from '@/types';

interface RightPanelProps {
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  selectedLayer: CanvasLayer | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
}

export const RightPanel = ({
  layers,
  selectedLayerId,
  selectedLayer,
  onSelectLayer,
  onUpdateLayer,
  onMoveLayer,
  onToggleVisibility,
  onToggleLock,
}: RightPanelProps) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties');

  // Sort layers by z-index (highest first)
  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return 'T';
      case 'image':
        return '🖼';
      case 'shape':
        return '◻';
      default:
        return '◻';
    }
  };

  return (
    <div className="w-72 border-l border-border bg-card flex flex-col h-full">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'properties' | 'layers')}
        className="flex flex-col h-full"
      >
        {/* Tab Headers */}
        <div className="border-b border-border">
          <TabsList className="w-full h-12 bg-transparent rounded-none p-0 gap-0">
            <TabsTrigger
              value="properties"
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-violet-500 gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Design
            </TabsTrigger>
            <TabsTrigger
              value="layers"
              className="flex-1 h-full rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-violet-500 gap-2"
            >
              <Layers className="w-4 h-4" />
              Layers
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Properties Tab */}
        <TabsContent value="properties" className="flex-1 m-0 overflow-y-auto">
          {selectedLayer ? (
            <div className="p-4 space-y-6">
              {/* Position & Size */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Position
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedLayer.x)}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          x: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedLayer.y)}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          y: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Size
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">W</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedLayer.width)}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          width: parseFloat(e.target.value) || 100,
                        })
                      }
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">H</Label>
                    <Input
                      type="number"
                      value={Math.round(selectedLayer.height)}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          height: parseFloat(e.target.value) || 100,
                        })
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Rotation & Opacity */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Rotation
                    </Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={Math.round(selectedLayer.rotation)}
                        onChange={(e) =>
                          onUpdateLayer(selectedLayer.id, {
                            rotation: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-8"
                      />
                      <span className="text-xs text-muted-foreground">°</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Opacity
                    </Label>
                    <Input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={selectedLayer.opacity}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          opacity: parseFloat(e.target.value),
                        })
                      }
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Text-specific Properties */}
              {selectedLayer.type === 'text' && (
                <TextLayerProperties
                  layer={selectedLayer as TextLayer}
                  onUpdate={(updates) =>
                    onUpdateLayer(selectedLayer.id, updates)
                  }
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Settings2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Select an element to edit its properties
              </p>
            </div>
          )}
        </TabsContent>

        {/* Layers Tab */}
        <TabsContent value="layers" className="flex-1 m-0 overflow-y-auto">
          <div className="p-2 space-y-1">
            {sortedLayers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No layers yet</p>
                <p className="text-xs mt-1">
                  Add elements from the left sidebar
                </p>
              </div>
            ) : (
              sortedLayers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => onSelectLayer(layer.id)}
                  className={`
                    group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
                    ${selectedLayerId === layer.id
                      ? 'bg-violet-500/10 ring-1 ring-violet-500/30'
                      : 'hover:bg-muted'
                    }
                  `}
                >
                  {/* Drag Handle */}
                  <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />

                  {/* Layer Icon */}
                  <div
                    className={`
                      w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium
                      ${layer.type === 'text'
                        ? 'bg-blue-500/10 text-blue-500'
                        : layer.type === 'image'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-purple-500/10 text-purple-500'
                      }
                    `}
                  >
                    {getLayerIcon(layer.type)}
                  </div>

                  {/* Layer Name */}
                  <span className="flex-1 text-sm truncate">{layer.name}</span>

                  {/* Quick Actions (visible on hover) */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(layer.id, 'up');
                      }}
                      className="h-6 w-6"
                      aria-label="Move up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(layer.id, 'down');
                      }}
                      className="h-6 w-6"
                      aria-label="Move down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Visibility */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(layer.id);
                    }}
                    className={`h-6 w-6 ${!layer.visible ? 'text-muted-foreground' : ''
                      }`}
                    aria-label={layer.visible ? 'Hide' : 'Show'}
                  >
                    {layer.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </Button>

                  {/* Lock */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(layer.id);
                    }}
                    className={`h-6 w-6 ${layer.locked ? 'text-amber-500' : ''
                      }`}
                    aria-label={layer.locked ? 'Unlock' : 'Lock'}
                  >
                    {layer.locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Text Layer Properties Component
const TextLayerProperties = ({
  layer,
  onUpdate,
}: {
  layer: TextLayer;
  onUpdate: (updates: Partial<TextLayer>) => void;
}) => (
  <div className="space-y-6">
    {/* Text Content */}
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Text Content
      </Label>
      <Input
        value={layer.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Enter text..."
      />
    </div>

    {/* Font */}
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Font
      </Label>
      <Select
        value={layer.fontFamily}
        onValueChange={(value) => onUpdate({ fontFamily: value })}
      >
        <SelectTrigger>
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
    </div>

    {/* Colors */}
    <div className="space-y-3">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Text Color
      </Label>
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => onUpdate({ fill: color })}
            className={`w-6 h-6 rounded-md border-2 transition-all cursor-pointer ${layer.fill === color
                ? 'border-violet-500 scale-110'
                : 'border-transparent hover:scale-105'
              }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <Input
        type="color"
        value={layer.fill}
        onChange={(e) => onUpdate({ fill: e.target.value })}
        className="w-full h-8"
      />
    </div>

    {/* Stroke */}
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Stroke
      </Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={layer.stroke || '#000000'}
          onChange={(e) => onUpdate({ stroke: e.target.value })}
          className="w-12 h-8"
        />
        <Input
          type="number"
          min={0}
          max={20}
          value={layer.strokeWidth || 0}
          onChange={(e) =>
            onUpdate({ strokeWidth: parseFloat(e.target.value) || 0 })
          }
          placeholder="Width"
          className="flex-1 h-8"
        />
      </div>
    </div>
  </div>
);