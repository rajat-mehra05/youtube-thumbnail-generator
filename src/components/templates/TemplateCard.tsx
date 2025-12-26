'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  return (
    <Card
      onClick={() => onSelect(template)}
      className="cursor-pointer overflow-hidden group hover:border-violet-500/50 hover:shadow-lg transition-all duration-200"
    >
      <CardContent className="p-0">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {template.thumbnail_url ? (
            <img
              src={template.thumbnail_url}
              alt={template.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
              <span className="text-3xl">🖼️</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-medium text-sm">Use Template</span>
          </div>

          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className={`text-xs ${
                template.type === 'full_design'
                  ? 'bg-violet-500/90 text-white'
                  : 'bg-white/90 text-gray-900'
              }`}
            >
              {template.type === 'full_design' ? 'Full Design' : 'Layout Only'}
            </Badge>
          </div>

          {/* Premium badge */}
          {template.is_premium && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-amber-500 text-white text-xs">PRO</Badge>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-medium text-sm truncate">{template.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {template.category.replace('_', ' ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
