'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  Type,
  Image,
  Shapes,
  Upload,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ShapeType } from '@/types';

type SidebarTab = 'elements' | 'text' | 'uploads' | 'ai' | null;

interface LeftSidebarProps {
  onAddLayer: (type: 'text' | 'image' | ShapeType) => void;
  onOpenAI?: () => void;
}

const SIDEBAR_ITEMS = [
  { id: 'elements' as const, icon: Shapes, label: 'Elements' },
  { id: 'text' as const, icon: Type, label: 'Text' },
  { id: 'uploads' as const, icon: Upload, label: 'Uploads' },
  { id: 'ai' as const, icon: Sparkles, label: 'AI Magic' },
];

export const LeftSidebar = ({
  onAddLayer,
  onOpenAI,
}: LeftSidebarProps) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>(null);

  const handleTabClick = (tabId: SidebarTab) => {
    // Special case: AI tab should directly open the modal instead of showing panel
    if (tabId === 'ai' && onOpenAI) {
      onOpenAI();
      return;
    }
    setActiveTab(activeTab === tabId ? null : tabId);
  };

  const handleClose = () => setActiveTab(null);

  return (
    <div className="flex h-full">
      {/* Icon Rail */}
      <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`
                w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5
                transition-all duration-200 group cursor-pointer
                ${isActive
                  ? 'bg-violet-500/10 text-violet-500'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Panel */}
      {activeTab && (
        <div className="w-72 bg-card border-r border-border flex flex-col animate-in slide-in-from-left-2 duration-200">
          {/* Panel Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-border">
            <h2 className="font-semibold capitalize">{activeTab}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'elements' && (
              <ElementsPanel onAddLayer={onAddLayer} />
            )}
            {activeTab === 'text' && <TextPanel onAddLayer={onAddLayer} />}
            {activeTab === 'uploads' && <UploadsPanel onAddLayer={onAddLayer} />}
          </div>
        </div>
      )}
    </div>
  );
};

// Elements Panel
const ElementsPanel = ({
  onAddLayer,
}: {
  onAddLayer: (type: 'text' | 'image' | ShapeType) => void;
}) => (
  <div className="space-y-6">
    {/* Shapes Section */}
    <div>
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">Shapes</h3>
      <div className="grid grid-cols-3 gap-2">
        {[
          { shape: 'rectangle', icon: '▢', label: 'Rectangle' },
          { shape: 'circle', icon: '○', label: 'Circle' },
          { shape: 'triangle', icon: '△', label: 'Triangle' },
          { shape: 'star', icon: '☆', label: 'Star' },
          { shape: 'arrow', icon: '→', label: 'Arrow' },
          { shape: 'line', icon: '—', label: 'Line' },
        ].map((item) => (
          <button
            key={item.shape}
            onClick={() => onAddLayer(item.shape as ShapeType)}
            className="aspect-square rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-violet-500/50 transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>

    <Separator />

    {/* Graphics Section */}
    <div>
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">
        Graphics
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onAddLayer('image')}
          className="p-4 rounded-xl border border-dashed border-border hover:border-violet-500/50 hover:bg-muted/50 transition-all flex flex-col items-center gap-2 cursor-pointer"
          aria-label="Add image layer"
        >
          <Image className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm">Add Image</span>
        </button>
        <button
          onClick={() => onAddLayer('rectangle')}
          className="p-4 rounded-xl border border-dashed border-border hover:border-violet-500/50 hover:bg-muted/50 transition-all flex flex-col items-center gap-2 cursor-pointer"
        >
          <LayoutGrid className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm">Add Frame</span>
        </button>
      </div>
    </div>
  </div>
);

// Text Panel
const TextPanel = ({
  onAddLayer,
}: {
  onAddLayer: (type: 'text' | 'image' | ShapeType) => void;
}) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      Click to add text to your design
    </p>

    {/* Text Style Presets */}
    <div className="space-y-3">
      <button
        onClick={() => onAddLayer('text')}
        className="w-full p-4 rounded-xl border border-border hover:border-violet-500/50 hover:bg-muted/50 transition-all text-left cursor-pointer"
      >
        <span className="text-3xl font-bold">Add a heading</span>
      </button>

      <button
        onClick={() => onAddLayer('text')}
        className="w-full p-3 rounded-xl border border-border hover:border-violet-500/50 hover:bg-muted/50 transition-all text-left cursor-pointer"
      >
        <span className="text-xl font-semibold">Add a subheading</span>
      </button>

      <button
        onClick={() => onAddLayer('text')}
        className="w-full p-3 rounded-xl border border-border hover:border-violet-500/50 hover:bg-muted/50 transition-all text-left cursor-pointer"
      >
        <span className="text-base">Add body text</span>
      </button>
    </div>

    <Separator />

    {/* Font Combinations */}
    <div>
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">
        Font Combinations
      </h3>
      <div className="space-y-2">
        {[
          { heading: 'Montserrat', body: 'Open Sans' },
          { heading: 'Oswald', body: 'Roboto' },
          { heading: 'Bebas Neue', body: 'Lato' },
        ].map((combo) => (
          <button
            key={combo.heading}
            onClick={() => onAddLayer('text')}
            className="w-full p-3 rounded-lg border border-border hover:border-violet-500/50 hover:bg-muted/50 transition-all text-left"
          >
            <p
              className="font-bold text-lg"
              style={{ fontFamily: combo.heading }}
            >
              {combo.heading}
            </p>
            <p
              className="text-sm text-muted-foreground"
              style={{ fontFamily: combo.body }}
            >
              {combo.body}
            </p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Uploads Panel
const UploadsPanel = ({
  onAddLayer,
}: {
  onAddLayer: (type: 'text' | 'image' | ShapeType) => void;
}) => (
  <div className="space-y-4">
    <Button
      onClick={() => onAddLayer('image')}
      className="w-full h-24 border-2 border-dashed border-border bg-transparent hover:bg-muted/50 hover:border-violet-500/50 text-foreground"
      variant="ghost"
    >
      <div className="flex flex-col items-center gap-2">
        <Upload className="w-6 h-6" />
        <span>Upload an image</span>
      </div>
    </Button>

    <Separator />

    <div>
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">
        Recent Uploads
      </h3>
      <div className="text-center py-8 text-muted-foreground text-sm">
        <p>No uploads yet</p>
        <p className="text-xs mt-1">Images you upload will appear here</p>
      </div>
    </div>
  </div>
);



