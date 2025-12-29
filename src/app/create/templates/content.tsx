'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { logger } from '@/lib/utils/logger';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CategoryFilter } from '@/components/templates/CategoryFilter';
import { TemplateGrid } from '@/components/templates/TemplateGrid';
import { ROUTES } from '@/lib/constants';
import { useUser } from '@/hooks';
import { getTemplates } from '@/lib/actions/templates';
import { createProject } from '@/lib/actions/projects';
import type { Template, TemplateCategory, TemplateType } from '@/types';
import { ErrorMessage } from '@/components/ui/error-message';

export function TemplatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<TemplateCategory | 'all'>(
    (searchParams.get('category') as TemplateCategory) || 'all'
  );
  const [type, setType] = useState<TemplateType | 'all'>('all');

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getTemplates({
          category: category !== 'all' ? category : undefined,
          type: type !== 'all' ? type : undefined,
        });

        if (result.success && result.templates) {
          setTemplates(result.templates);
        } else {
          setError(result.error || 'Failed to load templates');
        }
      } catch (err) {
        logger.error('Failed to fetch templates:', { error: err });
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [category, type]);

  // Filter by search
  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTemplate = async (template: Template) => {
    try {
      // Create a new project with the template
      const result = await createProject({
        name: `${template.name} - Copy`,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create project');
      }

      // Navigate to editor with the template's canvas state
      router.push(ROUTES.EDITOR(result.data.id));
    } catch (error) {
      logger.error('Error using template:', { error });
      toast.error('Failed to use template');
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <Link
            href={ROUTES.CREATE}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            ← Back to Create
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Templates</h1>
              <p className="text-muted-foreground mt-1">
                Choose a template to get started quickly
              </p>
            </div>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <CategoryFilter
              selectedCategory={category}
              selectedType={type}
              onCategoryChange={setCategory}
              onTypeChange={setType}
            />
          </div>

          {/* Error State */}
          {error && !loading && (
            <ErrorMessage
              title="Failed to Load Templates"
              message={error}
              onRetry={() => window.location.reload()}
            />
          )}

          {/* Templates Grid */}
          {!error && (
            <TemplateGrid
              templates={filteredTemplates}
              loading={loading}
              onSelect={handleSelectTemplate}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
