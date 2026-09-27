import { defineMiddleware } from 'astro:middleware';
import { timingSafeEqual } from 'node:crypto';

const PROTECTED_PATHS = new Set([
  '/api/generate',
  '/api/architect',
  '/api/analyze',
  '/api/reverse-architect',
  '/api/v1/generate',
  '/api/v1/keys',
  '/api/auth/send-magic-link',
]);

function passcodeOk(given: string | null): boolean {
  const expected = import.meta.env.APP_PASSCODE ?? process.env.APP_PASSCODE;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const onRequest = defineMiddleware((context, next) => {
  const path = context.url.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (PROTECTED_PATHS.has(path) && context.request.method !== 'OPTIONS') {
    if (!passcodeOk(context.request.headers.get('x-app-passcode'))) {
      return new Response(JSON.stringify({ error: 'Passcode required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  return next();
});
