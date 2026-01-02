import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

const WEBHOOK_SECRET = import.meta.env.LEMONSQUEEZY_WEBHOOK_SECRET || process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('LEMONSQUEEZY_WEBHOOK_SECRET not set - skipping signature verification');
    return true; // Allow in dev, but log warning
  }

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const signature = request.headers.get('x-signature') || '';
    const payload = await request.text();

    // Verify webhook signature
    if (WEBHOOK_SECRET && !verifySignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const data = JSON.parse(payload);
    const eventName = data.meta?.event_name;

    console.log('LemonSqueezy webhook received:', eventName);

    // Handle order_created event (successful payment)
    if (eventName === 'order_created') {
      const order = data.data?.attributes;
      const email = order?.user_email?.toLowerCase().trim();
      const orderId = data.data?.id;
      const customerId = order?.customer_id;

      if (!email) {
        console.error('No email in order:', orderId);
        return new Response('No email', { status: 400 });
      }

      console.log('Processing payment for:', email, 'Order:', orderId);

      // Update user as paid
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        // Update existing user
        await supabase
          .from('users')
          .update({
            paid: true,
            lemonsqueezy_customer_id: String(customerId),
            lemonsqueezy_order_id: String(orderId),
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        console.log('Updated existing user as paid:', email);
      } else {
        // Create new paid user
        await supabase
          .from('users')
          .insert({
            email: email,
            paid: true,
            generations_used: 0,
            lemonsqueezy_customer_id: String(customerId),
            lemonsqueezy_order_id: String(orderId),
            paid_at: new Date().toISOString()
          });

        console.log('Created new paid user:', email);
      }

      return new Response('OK', { status: 200 });
    }

    // Handle subscription events if needed in future
    if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
      // Handle subscription logic here if you add subscriptions later
      console.log('Subscription event:', eventName);
      return new Response('OK', { status: 200 });
    }

    // Acknowledge other events
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 500 });
  }
};
