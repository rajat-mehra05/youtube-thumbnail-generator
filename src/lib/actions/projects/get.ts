'use server';

import { createClient } from '@/lib/supabase/server';
import { createApiResponse, createApiError } from '@/lib/utils/api-response';
import { logger } from '@/lib/utils/logger';
import type { ProjectsResponse, ProjectResponse } from '@/types/api';
import type { Project } from '@/types';

export const getProjects = async (): Promise<ProjectsResponse> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return createApiError('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return createApiResponse(true, data as Project[]);
  } catch (error) {
    logger.error('Get projects error:', { error });
    return createApiError(error, 'Failed to fetch projects');
  }
};

export const getProject = async (projectId: string): Promise<ProjectResponse> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return createApiError('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return createApiResponse(true, data as Project);
  } catch (error) {
    logger.error('Get project error:', { projectId, error });
    return createApiError(error, 'Failed to fetch project');
  }
};