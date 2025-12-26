'use client';

import { CommonProperties, TextProperties } from './properties';
import type { CanvasLayer, TextLayer } from '@/types';

interface PropertiesPanelProps {
  selectedLayer: CanvasLayer | null;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
}

export const PropertiesPanel = ({ selectedLayer, onUpdateLayer }: PropertiesPanelProps) => {
  if (!selectedLayer) {
    return (
      <div className="w-72 border-l border-border bg-card p-4">
        <div className="text-center text-muted-foreground text-sm py-8">
          Select a layer to edit its properties
        </div>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<CanvasLayer>) => {
    onUpdateLayer(selectedLayer.id, updates);
  };

  return (
    <div className="w-72 border-l border-border bg-card overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Properties</h2>
        <p className="text-sm text-muted-foreground capitalize">{selectedLayer.type} Layer</p>
      </div>

      <div className="p-4">
        <CommonProperties layer={selectedLayer} onUpdate={handleUpdate} />
        {selectedLayer.type === 'text' && (
          <TextProperties layer={selectedLayer as TextLayer} onUpdate={handleUpdate} />
        )}
      </div>
    </div>
  );
};
