'use client';

import { Button } from '@/components/ui/button';
import { TEMPLATE_CATEGORIES } from '@/lib/constants';
import type { TemplateCategory, TemplateType } from '@/types';

interface CategoryFilterProps {
  selectedCategory: TemplateCategory | 'all';
  selectedType: TemplateType | 'all';
  onCategoryChange: (category: TemplateCategory | 'all') => void;
  onTypeChange: (type: TemplateType | 'all') => void;
}

export const CategoryFilter = ({
  selectedCategory,
  selectedType,
  onCategoryChange,
  onTypeChange,
}: CategoryFilterProps) => {
  const categories = [
    { value: 'all' as const, label: 'All' },
    ...TEMPLATE_CATEGORIES,
  ];

  const types = [
    { value: 'all' as const, label: 'All Types' },
    { value: 'full_design' as const, label: 'Full Designs' },
    { value: 'layout_only' as const, label: 'Layout Only' },
  ];

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(cat.value)}
              className={
                selectedCategory === cat.value
                  ? 'bg-violet-500 hover:bg-violet-600'
                  : ''
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Type</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTypeChange(type.value)}
              className={
                selectedType === type.value
                  ? 'bg-violet-500 hover:bg-violet-600'
                  : ''
              }
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
