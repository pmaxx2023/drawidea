import type { APIRoute } from 'astro';
import { getUserEmail, createAdminClient } from '../../lib/supabase';

const FREE_GENERATIONS = 3;

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();

  try {
    // Get authenticated user email from session
    const email = await getUserEmail(request, responseHeaders);

    if (!email) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabase = createAdminClient();
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      // New user - hasn't generated anything yet
      return new Response(JSON.stringify({
        exists: false,
        paid: false,
        generations_used: 0,
        remaining: FREE_GENERATIONS
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const remaining = user.paid ? 'unlimited' : Math.max(0, FREE_GENERATIONS - user.generations_used);

    return new Response(JSON.stringify({
      exists: true,
      paid: user.paid,
      generations_used: user.generations_used,
      remaining: remaining
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check status' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
