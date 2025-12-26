import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * Generate a cache key from input parameters
 */
export const generateCacheKey = (type: string, params: Record<string, string>): string => {
  const sorted = Object.keys(params).sort().map((key) => `${key}:${params[key]}`).join('|');
  return crypto.createHash('sha256').update(`${type}:${sorted}`).digest('hex');
};

/**
 * Check cache for existing response
 */
export const checkCache = async (cacheKey: string) => {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from('cache_entries')
    .select('data')
    .eq('cache_key', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .single();
  return data?.data || null;
};

/**
 * Store response in cache
 */
export const storeInCache = async (
  cacheKey: string,
  cacheType: 'llm_response' | 'image_generation',
  data: unknown,
  expiryHours: number = 24
) => {
  const supabase = await createAdminClient();
  await supabase.from('cache_entries').upsert(
    {
      cache_key: cacheKey,
      cache_type: cacheType,
      data,
      expires_at: new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: 'cache_key' }
  );
};
