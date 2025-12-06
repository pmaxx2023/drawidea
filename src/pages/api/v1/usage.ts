import type { APIRoute } from 'astro';
import { validateApiKey, getUsageStats } from '../../../lib/api-auth';

/**
 * GET /api/v1/usage - Get usage stats for current API key
 */
export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  const apiKey = authHeader?.replace('Bearer ', '');

  if (!apiKey) {
    return new Response(JSON.stringify({
      error: 'Missing API key',
      message: 'Include your API key in the Authorization header: Bearer clario_xxx'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const validation = await validateApiKey(apiKey);

  if (!validation.valid || !validation.keyData) {
    return new Response(JSON.stringify({
      error: 'Invalid API key',
      message: validation.error
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const keyData = validation.keyData;

  try {
    const recentUsage = await getUsageStats(keyData.id);

    return new Response(JSON.stringify({
      key: {
        id: keyData.id,
        name: keyData.name,
        createdAt: keyData.createdAt,
        lastUsed: keyData.lastUsed
      },
      usage: {
        today: keyData.usageToday,
        limit: keyData.rateLimit,
        remaining: keyData.rateLimit - keyData.usageToday,
        resetsAt: keyData.usageResetAt
      },
      recentRequests: recentUsage.slice(0, 20).map(r => ({
        endpoint: r.endpoint,
        timestamp: r.timestamp,
        style: r.style
      }))
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Usage stats error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get usage stats'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
