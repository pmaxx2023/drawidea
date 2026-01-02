import { createServerClient, createBrowserClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

/**
 * Create a Supabase client for browser/client-side usage
 * Uses the anon key for public operations
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

/**
 * Create a Supabase client for server-side usage in API routes
 * Handles cookies for session management
 */
export function createServerSupabaseClient(request: Request, responseHeaders: Headers) {
  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          responseHeaders.append('Set-Cookie', serializeCookieHeader(name, value, options));
        });
      },
    },
  });
}

/**
 * Create a Supabase admin client with service role key
 * Use for server-side operations that bypass RLS
 */
export function createAdminClient() {
  return createClient(supabaseUrl!, supabaseServiceKey!);
}

/**
 * Get the current user from a request's session
 * Returns null if not authenticated
 */
export async function getUser(request: Request, responseHeaders: Headers) {
  const supabase = createServerSupabaseClient(request, responseHeaders);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get the current user's email from session
 * Returns null if not authenticated
 */
export async function getUserEmail(request: Request, responseHeaders: Headers): Promise<string | null> {
  const user = await getUser(request, responseHeaders);
  return user?.email?.toLowerCase().trim() ?? null;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: Request, responseHeaders: Headers) {
  const user = await getUser(request, responseHeaders);

  if (!user) {
    throw new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return user;
}
