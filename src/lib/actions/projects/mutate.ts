'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createApiResponse, createApiError } from '@/lib/utils/api-response';
import { logger } from '@/lib/utils/logger';
import type {
  ProjectResponse,
  ProjectMutationResponse,
  BulkDeleteResponse
} from '@/types/api';
import type { Project, CanvasState } from '@/types';

export const createProject = async (data: {
  name?: string;
  video_title?: string;
  canvas_state?: CanvasState;
}): Promise<ProjectResponse> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return createApiError('Not authenticated');

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: data.name || 'Untitled Project',
        video_title: data.video_title,
        canvas_state: data.canvas_state,
      })
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/dashboard');
    return createApiResponse(true, project as Project);
  } catch (error) {
    logger.error('Create project error:', { error });
    return createApiError(error, 'Failed to create project');
  }
};

export const updateProject = async (
  projectId: string,
  data: Partial<{ name: string; video_title: string; canvas_state: CanvasState; thumbnail_url: string }>
): Promise<{ success: boolean; project?: Project; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/dashboard');
    revalidatePath(`/editor/${projectId}`);
    return { success: true, project: project as Project };
  } catch (error) {
    logger.error('Update project error:', { error });
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update project' };
  }
};

export const deleteProject = async (projectId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase.from('projects').delete().eq('id', projectId).eq('user_id', user.id);
    if (error) throw error;
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    logger.error('Delete project error:', { error });
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete project' };
  }
};

export const duplicateProject = async (projectId: string): Promise<{ success: boolean; project?: Project; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: original, error: fetchError } = await supabase
      .from('projects').select('*').eq('id', projectId).eq('user_id', user.id).single();
    if (fetchError) throw fetchError;

    const { data: project, error: createError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: `${original.name} (Copy)`,
        video_title: original.video_title,
        topic: original.topic,
        emotion: original.emotion,
        style: original.style,
        canvas_state: original.canvas_state,
      })
      .select()
      .single();

    if (createError) throw createError;
    revalidatePath('/dashboard');
    return { success: true, project: project as Project };
  } catch (error) {
    logger.error('Duplicate project error:', { error });
    return { success: false, error: error instanceof Error ? error.message : 'Failed to duplicate project' };
  }
};

export const bulkDeleteProjects = async (projectIds: string[]): Promise<{ success: boolean; deletedCount?: number; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    if (projectIds.length === 0) {
      return { success: false, error: 'No projects selected' };
    }

    const { error, count } = await supabase
      .from('projects')
      .delete({ count: 'exact' })
      .in('id', projectIds)
      .eq('user_id', user.id);

    if (error) throw error;
    revalidatePath('/dashboard');
    return { success: true, deletedCount: count || 0 };
  } catch (error) {
    logger.error('Bulk delete projects error:', { error });
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete projects' };
  }
};

export const deleteAllProjects = async (): Promise<{ success: boolean; deletedCount?: number; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error, count } = await supabase
      .from('projects')
      .delete({ count: 'exact' })
      .eq('user_id', user.id);

    if (error) throw error;
    revalidatePath('/dashboard');
    return { success: true, deletedCount: count || 0 };
  } catch (error) {
    logger.error('Delete all projects error:', { error });
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete all projects' };
  }
};
