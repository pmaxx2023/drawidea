import type { APIRoute } from 'astro';
import { createServerSupabaseClient, createAdminClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();

  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client for auth
    const supabase = createServerSupabaseClient(request, responseHeaders);

    // Get the origin for redirect URL
    const origin = new URL(request.url).origin;
    const redirectTo = `${origin}/auth/callback`;

    // Send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
      }
    });

    if (error) {
      console.error('Magic link error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Ensure user exists in our users table (for tracking generations)
    // This creates the record if it doesn't exist, preserving any existing data
    const adminClient = createAdminClient();
    const { data: existingUser } = await adminClient
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (!existingUser) {
      // Create new user record with 0 generations
      await adminClient.from('users').insert({
        email: normalizedEmail,
        generations_used: 0,
        paid: false
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Check your email for the magic link'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(responseHeaders.entries())
      }
    });

  } catch (error) {
    console.error('Send magic link error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send magic link' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
