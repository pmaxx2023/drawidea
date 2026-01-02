import type { APIRoute } from "astro";

// Lemon Squeezy webhook handler
// For now, we're using localStorage on the client side, so this webhook
// is mainly for logging/analytics. In a production app with DB-backed
// user tracking, you'd update the user's paid status here.

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();

    // Log the webhook event
    console.log("Lemon Squeezy webhook received:", JSON.stringify(payload, null, 2));

    const eventName = payload.meta?.event_name;

    if (eventName === "order_created") {
      const email = payload.data?.attributes?.user_email;
      const orderId = payload.data?.id;

      console.log(`Payment successful for ${email}, order: ${orderId}`);

      // In a production app with Supabase:
      // await supabase.from('users').update({ paid: true }).eq('email', email);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
