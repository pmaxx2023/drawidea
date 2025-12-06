import type { APIRoute } from 'astro';
import { createApiKey, getUserApiKeys, deleteApiKey, getUsageStats } from '../../../lib/api-auth';

// Simple auth check - in production, use proper session/JWT
function getUserId(request: Request): string | null {
  // Check for user session cookie or header
  const userId = request.headers.get('X-User-Id');

  // For now, also accept invite code as simple auth
  const inviteCode = request.headers.get('X-Invite-Code');
  if (inviteCode === '1001-01') {
    return userId || 'default-user';
  }

  return userId;
}

/**
 * POST /api/v1/keys - Create a new API key
 */
export const POST: APIRoute = async ({ request }) => {
  const userId = getUserId(request);

  if (!userId) {
    return new Response(JSON.stringify({
      error: 'Unauthorized',
      message: 'Include X-Invite-Code header with valid invite code'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { name = 'Default Key' } = body;

    const keyData = await createApiKey(userId, name);

    return new Response(JSON.stringify({
      success: true,
      key: keyData.key, // Only shown once!
      id: keyData.id,
      name: keyData.name,
      rateLimit: keyData.rateLimit,
      createdAt: keyData.createdAt,
      message: 'Save this key - it will only be shown once!'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Key creation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create key'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * GET /api/v1/keys - List user's API keys
 */
export const GET: APIRoute = async ({ request }) => {
  const userId = getUserId(request);

  if (!userId) {
    return new Response(JSON.stringify({
      error: 'Unauthorized',
      message: 'Include X-Invite-Code header with valid invite code'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const keys = await getUserApiKeys(userId);

    // Don't expose full keys, just last 4 chars
    const safeKeys = keys.map(k => ({
      id: k.id,
      name: k.name,
      keyHint: `clario_...${k.key.slice(-4)}`,
      createdAt: k.createdAt,
      lastUsed: k.lastUsed,
      rateLimit: k.rateLimit,
      usageToday: k.usageToday,
      usageResetAt: k.usageResetAt
    }));

    return new Response(JSON.stringify({
      keys: safeKeys
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Key list error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to list keys'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * DELETE /api/v1/keys - Delete an API key
 */
export const DELETE: APIRoute = async ({ request }) => {
  const userId = getUserId(request);

  if (!userId) {
    return new Response(JSON.stringify({
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return new Response(JSON.stringify({
        error: 'Missing key parameter'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const deleted = await deleteApiKey(key, userId);

    if (!deleted) {
      return new Response(JSON.stringify({
        error: 'Key not found or unauthorized'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Key deleted'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Key deletion error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to delete key'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
