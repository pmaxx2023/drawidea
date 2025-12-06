import type { APIRoute } from 'astro';
import { put, list } from '@vercel/blob';

const SUBSCRIBERS_FILE = 'subscribers.json';

async function getSubscribers(): Promise<Array<{ email: string; name: string; subscribedAt: string }>> {
  try {
    const { blobs } = await list({ prefix: SUBSCRIBERS_FILE });
    if (blobs.length === 0) return [];

    const response = await fetch(blobs[0].url);
    return await response.json();
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: Array<{ email: string; name: string; subscribedAt: string }>) {
  await put(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), {
    access: 'public',
    addRandomSuffix: false,
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!name || typeof name !== 'string') {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const subscribers = await getSubscribers();

    // Check for duplicate
    if (subscribers.some(s => s.email === normalizedEmail)) {
      // Already subscribed, just return success
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add new subscriber
    subscribers.push({
      email: normalizedEmail,
      name: name.trim(),
      subscribedAt: new Date().toISOString(),
    });

    await saveSubscribers(subscribers);

    console.log(JSON.stringify({
      event: 'new_subscriber',
      timestamp: new Date().toISOString(),
      email: normalizedEmail,
    }));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to subscribe' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
