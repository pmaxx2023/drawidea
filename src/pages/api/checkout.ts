import type { APIRoute } from "astro";
import { getUserEmail } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();

  const apiKey = import.meta.env.LEMONSQUEEZY_API_KEY;
  const storeId = import.meta.env.LEMONSQUEEZY_STORE_ID;
  const variantId = import.meta.env.LEMONSQUEEZY_VARIANT_ID;

  if (!apiKey || !storeId || !variantId) {
    return new Response(JSON.stringify({ error: "Payment not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get authenticated user email from session
    const email = await getUserEmail(request, responseHeaders);

    if (!email) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: email,
              custom: {
                user_email: email,
              },
            },
            product_options: {
              redirect_url: `${new URL(request.url).origin}/success`,
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lemon Squeezy error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to create checkout" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const checkoutUrl = data.data.attributes.url;

    return new Response(JSON.stringify({ checkoutUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: "Checkout failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
