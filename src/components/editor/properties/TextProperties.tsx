'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AVAILABLE_FONTS, COLOR_PALETTE } from '@/lib/constants';
import type { TextLayer } from '@/types';

interface TextPropertiesProps {
  layer: TextLayer;
  onUpdate: (updates: Partial<TextLayer>) => void;
}

export const TextProperties = ({ layer, onUpdate }: TextPropertiesProps) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="text-content">Text</Label>
      <Input id="text-content" value={layer.text} onChange={(e) => onUpdate({ text: e.target.value })} />
    </div>

    <div className="space-y-2">
      <Label>Font</Label>
      <Select value={layer.fontFamily} onValueChange={(value) => onUpdate({ fontFamily: value })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {AVAILABLE_FONTS.map((font) => <SelectItem key={font} value={font}>{font}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Font Size</Label>
      <Input type="number" value={layer.fontSize} onChange={(e) => onUpdate({ fontSize: parseFloat(e.target.value) || 24 })} />
    </div>

    <div className="space-y-2">
      <Label>Style</Label>
      <Select value={layer.fontStyle} onValueChange={(value: 'normal' | 'bold' | 'italic' | 'bold italic') => onUpdate({ fontStyle: value })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="bold">Bold</SelectItem>
          <SelectItem value="italic">Italic</SelectItem>
          <SelectItem value="bold italic">Bold Italic</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label>Text Color</Label>
      <div className="flex flex-wrap gap-2">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            onClick={() => onUpdate({ fill: color })}
            className={`w-6 h-6 rounded-full border-2 transition-all ${layer.fill === color ? 'border-violet-500 scale-110' : 'border-transparent hover:scale-105'}`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <Input type="color" value={layer.fill} onChange={(e) => onUpdate({ fill: e.target.value })} className="h-8 w-full" />
    </div>

    <div className="space-y-2">
      <Label>Stroke Color</Label>
      <div className="flex gap-2">
        <Input type="color" value={layer.stroke || '#000000'} onChange={(e) => onUpdate({ stroke: e.target.value })} className="h-8 w-16" />
        <Input type="number" min={0} max={20} value={layer.strokeWidth || 0} onChange={(e) => onUpdate({ strokeWidth: parseFloat(e.target.value) || 0 })} placeholder="Width" className="flex-1" />
      </div>
    </div>

    <div className="space-y-2">
      <Label>Alignment</Label>
      <div className="flex gap-2">
        {(['left', 'center', 'right'] as const).map((align) => (
          <button
            key={align}
            onClick={() => onUpdate({ align })}
            className={`flex-1 p-2 rounded border text-sm ${layer.align === align ? 'bg-violet-500 text-white border-violet-500' : 'border-border hover:bg-muted'}`}
          >
            {align === 'left' && '⬅️'}
            {align === 'center' && '↔️'}
            {align === 'right' && '➡️'}
          </button>
        ))}
      </div>
    </div>
  </div>
);
