'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ConceptData } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ConceptSelectorProps {
  concepts: ConceptData[];
  onSelect: (concept: ConceptData, index: number) => void;
  onRegenerate?: () => void;
  loading?: boolean;
  selectedIndex?: number;
}

export const ConceptSelector = ({
  concepts,
  onSelect,
  onRegenerate,
  loading = false,
  selectedIndex,
}: ConceptSelectorProps) => {
  const [selected, setSelected] = useState<number>(selectedIndex ?? 0);

  const handleSelect = (index: number) => {
    setSelected(index);
    onSelect(concepts[index], index);
  };

  return (
    <div className="space-y-6">
      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {concepts.map((concept, index) => (
          <Card
            key={index}
            onClick={() => handleSelect(index)}
            className={`cursor-pointer transition-all duration-200 overflow-hidden ${
              selected === index
                ? 'ring-2 ring-violet-500 border-violet-500'
                : 'hover:border-violet-500/50'
            }`}
          >
            <CardContent className="p-0">
              {/* Preview */}
              <div
                className="aspect-video relative"
                style={{
                  background: `linear-gradient(135deg, ${concept.color_scheme?.[0] || '#8B5CF6'} 0%, ${concept.color_scheme?.[1] || '#D946EF'} 100%)`,
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <span
                    className="text-lg md:text-xl font-bold text-white drop-shadow-lg leading-tight"
                    style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {concept.headline}
                  </span>
                  {concept.subheadline && (
                    <span className="text-xs md:text-sm text-white/80 mt-1">
                      {concept.subheadline}
                    </span>
                  )}
                </div>

                {/* Selected indicator */}
                {selected === index && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-violet-500 text-white">Selected</Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-medium">Concept {index + 1}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {concept.style?.replace('_', ' ')} style
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={onRegenerate}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Regenerating...
            </span>
          ) : (
            '🔄 Regenerate'
          )}
        </Button>

        <Button
          onClick={() => onSelect(concepts[selected], selected)}
          className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
        >
          Edit in Canvas →
        </Button>
      </div>
    </div>
  );
};
