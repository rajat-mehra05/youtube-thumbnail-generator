'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { CanvasLayer } from '@/types';

interface CommonPropertiesProps {
  layer: CanvasLayer;
  onUpdate: (updates: Partial<CanvasLayer>) => void;
}

export const CommonProperties = ({ layer, onUpdate }: CommonPropertiesProps) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="layer-name">Name</Label>
      <Input id="layer-name" value={layer.name} onChange={(e) => onUpdate({ name: e.target.value })} />
    </div>

    <div className="space-y-2">
      <Label>Position</Label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">X</Label>
          <Input type="number" value={Math.round(layer.x)} onChange={(e) => onUpdate({ x: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Y</Label>
          <Input type="number" value={Math.round(layer.y)} onChange={(e) => onUpdate({ y: parseFloat(e.target.value) || 0 })} />
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <Label>Size</Label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Width</Label>
          <Input type="number" value={Math.round(layer.width)} onChange={(e) => onUpdate({ width: parseFloat(e.target.value) || 100 })} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Height</Label>
          <Input type="number" value={Math.round(layer.height)} onChange={(e) => onUpdate({ height: parseFloat(e.target.value) || 100 })} />
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground">Rotation</Label>
          <Input type="number" value={Math.round(layer.rotation)} onChange={(e) => onUpdate({ rotation: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Opacity</Label>
          <Input type="number" min={0} max={1} step={0.1} value={layer.opacity} onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) || 1 })} />
        </div>
      </div>
    </div>

    <Separator />
  </div>
);
