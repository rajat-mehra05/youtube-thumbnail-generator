'use server';

import { createAdminClient } from '@/lib/supabase/server';

/**
 * Log usage for tracking
 */
export const logUsage = async (
  userId: string,
  actionType: 'ai_generation' | 'image_generation' | 'export',
  creditsUsed: number = 1,
  metadata?: Record<string, unknown>
) => {
  const supabase = await createAdminClient();
  await supabase.from('usage_logs').insert({
    user_id: userId,
    action_type: actionType,
    credits_used: creditsUsed,
    metadata,
  });
};
