'use server';

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';
import type { Template, TemplateCategory, TemplateType } from '@/types';

/**
 * Get all templates with optional filtering
 */
export const getTemplates = async (filters?: {
  category?: TemplateCategory;
  type?: TemplateType;
}): Promise<{ success: boolean; templates?: Template[]; error?: string }> => {
  try {
    const supabase = await createClient();

    let query = supabase.from('templates').select('*').order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, templates: data as Template[] };
  } catch (error) {
    logger.error('Get templates error:', { error });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch templates',
    };
  }
};

/**
 * Get a single template by ID
 */
export const getTemplate = async (
  templateId: string
): Promise<{ success: boolean; template?: Template; error?: string }> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) throw error;

    return { success: true, template: data as Template };
  } catch (error) {
    logger.error('Get template error:', { error });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch template',
    };
  }
};
