import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { rating, prompt } = await request.json();

    // Log feedback for analytics
    console.log(JSON.stringify({
      event: 'feedback',
      timestamp: new Date().toISOString(),
      rating: rating, // 'up' or 'down'
      prompt: prompt,
    }));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
};
