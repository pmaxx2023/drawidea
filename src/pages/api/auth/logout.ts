import type { APIRoute } from 'astro';
import { createServerSupabaseClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();

  try {
    const supabase = createServerSupabaseClient(request, responseHeaders);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(responseHeaders.entries())
        }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(responseHeaders.entries())
      }
    });

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({ error: 'Logout failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
