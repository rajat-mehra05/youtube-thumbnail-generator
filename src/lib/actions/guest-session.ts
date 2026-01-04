'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { logger } from '@/lib/utils/logger';

/**
 * Create or update a guest session on the server
 */
export const syncGuestSession = async (
  sessionId: string,
  generationsUsed: number,
  imageUrl?: string
) => {
  const supabase = await createAdminClient();

  const { error } = await supabase.from('guest_sessions').upsert(
    {
      id: sessionId,
      generations_used: generationsUsed,
      image_url: imageUrl || null,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    logger.error('Error syncing guest session:', { error });
    return { success: false, error: error.message };
  }

  return { success: true };
};

/**
 * Get guest session data from the server
 */
export const getGuestSessionFromServer = async (sessionId: string) => {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('guest_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    return { success: false, data: null, error: error.message };
  }

  return { success: true, data };
};

/**
 * Transfer guest session data to a new user account
 * @param sessionId - The guest session ID to transfer
 * @param userId - The user ID to transfer the data to
 * @param canvasState - Optional canvas state to set atomically during project creation
 * @param projectName - Optional project name (defaults to 'My First Thumbnail')
 * @param videoTitle - Optional video title (defaults to empty string)
 */
export const transferGuestDataToUser = async (
  sessionId: string,
  userId: string,
  canvasState?: import('@/types').CanvasState | null,
  projectName?: string,
  videoTitle?: string
) => {
  const supabase = await createAdminClient();

  // Get the guest session from server
  const { data: guestSession, error: fetchError } = await supabase
    .from('guest_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (fetchError || !guestSession) {
    return { success: false, error: 'Guest session not found', projectId: null };
  }

  // If there's an image URL, create a project for the user
  if (guestSession.image_url) {
    // Create a new project with canvas state set atomically if provided
    const finalProjectName = projectName || 'My First Thumbnail';
    const finalVideoTitle = videoTitle || '';

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: finalProjectName,
        video_title: finalVideoTitle,
        canvas_state: canvasState || null,
      })
      .select()
      .single();

    if (projectError) {
      logger.error('Error creating project:', { error: projectError });
      return { success: false, error: projectError.message, projectId: null };
    }

    // Mark the guest session as converted
    await supabase
      .from('guest_sessions')
      .update({ converted_to_user: userId })
      .eq('id', sessionId);

    return { success: true, projectId: project.id };
  }

  // Mark as converted even without image data
  await supabase
    .from('guest_sessions')
    .update({ converted_to_user: userId })
    .eq('id', sessionId);

  return { success: true, projectId: null };
};

/**
 * Check if guest session is valid and has remaining generations
 */
export const validateGuestSession = async (sessionId: string) => {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('guest_sessions')
    .select('generations_used, expires_at, converted_to_user')
    .eq('id', sessionId)
    .single();

  if (error) {
    // Session doesn't exist yet, it's valid (new guest)
    return { valid: true, generationsRemaining: 1 };
  }

  // Check if already converted
  if (data.converted_to_user) {
    return { valid: false, generationsRemaining: 0, reason: 'Session already used' };
  }

  // Check if expired
  const expiresAt = new Date(data.expires_at);
  if (expiresAt < new Date()) {
    return { valid: false, generationsRemaining: 0, reason: 'Session expired' };
  }

  // Check generations limit
  const remaining = Math.max(0, 1 - data.generations_used);
  return { valid: remaining > 0, generationsRemaining: remaining };
};
