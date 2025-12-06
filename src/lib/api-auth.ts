/**
 * API Authentication utilities
 * Uses Supabase for API key storage and rate limiting
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  user_id: string;
  created_at: string;
  last_used: string | null;
  rate_limit: number;
  usage_today: number;
  usage_reset_at: string;
}

export interface UsageRecord {
  id?: string;
  key_id: string;
  endpoint: string;
  created_at: string;
  style?: string;
}

/**
 * Generate a new API key
 */
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'clario_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

/**
 * Validate an API key and check rate limits
 */
export async function validateApiKey(key: string): Promise<{
  valid: boolean;
  error?: string;
  keyData?: ApiKey;
}> {
  if (!key || !key.startsWith('clario_')) {
    return { valid: false, error: 'Invalid API key format' };
  }

  try {
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .single();

    if (error || !keyData) {
      return { valid: false, error: 'API key not found' };
    }

    // Check if usage needs to be reset (daily)
    const now = new Date();
    const resetAt = new Date(keyData.usage_reset_at);

    if (now > resetAt) {
      // Reset daily usage
      const newResetTime = getNextResetTime();
      await supabase
        .from('api_keys')
        .update({ usage_today: 0, usage_reset_at: newResetTime })
        .eq('id', keyData.id);

      keyData.usage_today = 0;
      keyData.usage_reset_at = newResetTime;
    }

    // Check rate limit
    if (keyData.usage_today >= keyData.rate_limit) {
      return {
        valid: false,
        error: `Rate limit exceeded. ${keyData.rate_limit} requests/day. Resets at ${keyData.usage_reset_at}`
      };
    }

    return { valid: true, keyData };
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false, error: 'Validation error' };
  }
}

/**
 * Record API usage and increment counter
 */
export async function recordUsage(key: string, endpoint: string, style?: string): Promise<void> {
  try {
    const { data: keyData } = await supabase
      .from('api_keys')
      .select('id, usage_today')
      .eq('key', key)
      .single();

    if (!keyData) return;

    // Increment usage and update last_used
    await supabase
      .from('api_keys')
      .update({
        usage_today: keyData.usage_today + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', keyData.id);

    // Log usage record
    await supabase.from('api_usage').insert({
      key_id: keyData.id,
      endpoint,
      style,
    });

  } catch (error) {
    console.error('Usage recording error:', error);
  }
}

/**
 * Create a new API key for a user
 */
export async function createApiKey(userId: string, name: string): Promise<ApiKey> {
  const key = generateApiKey();

  const keyData = {
    key,
    name,
    user_id: userId,
    rate_limit: 100, // 100 requests/day free tier
    usage_today: 0,
    usage_reset_at: getNextResetTime(),
  };

  const { data, error } = await supabase
    .from('api_keys')
    .insert(keyData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create API key: ${error.message}`);
  }

  return data;
}

/**
 * Get all API keys for a user
 */
export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user keys:', error);
    return [];
  }

  return data || [];
}

/**
 * Delete an API key
 */
export async function deleteApiKey(key: string, userId: string): Promise<boolean> {
  const { data: keyData } = await supabase
    .from('api_keys')
    .select('id, user_id')
    .eq('key', key)
    .single();

  if (!keyData || keyData.user_id !== userId) {
    return false;
  }

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', keyData.id);

  return !error;
}

/**
 * Get usage stats for a key
 */
export async function getUsageStats(keyId: string): Promise<UsageRecord[]> {
  const { data, error } = await supabase
    .from('api_usage')
    .select('*')
    .eq('key_id', keyId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching usage stats:', error);
    return [];
  }

  return data || [];
}

function getNextResetTime(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}
