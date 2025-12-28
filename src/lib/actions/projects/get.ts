'use server';

import { createClient } from '@/lib/supabase/server';
import type { Project } from '@/types';

export const getProjects = async (): Promise<{ success: boolean; projects?: Project[]; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { success: true, projects: data as Project[] };
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Failed to fetch projects';
    console.error('Get projects error:', errorMessage, error);
    return { success: false, error: errorMessage };
  }
};

export const getProject = async (projectId: string): Promise<{ success: boolean; project?: Project; error?: string }> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return { success: true, project: data as Project };
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : 'Failed to fetch project';
    console.error('Get project error:', errorMessage, error);
    return { success: false, error: errorMessage };
  }
};
