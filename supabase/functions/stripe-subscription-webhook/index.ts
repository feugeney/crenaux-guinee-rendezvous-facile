
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the stripe signature from the request headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No stripe signature found");
    }

    const body = await req.text();
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Verify the event came from Stripe
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        
        // Handle subscription checkout completion
        if (session.mode === "subscription") {
          const subscriptionId = session.subscription;
          const customerId = session.customer;
          
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
          
          // Create subscription record
          await supabase.from("subscriptions").insert({
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            status: "active",
            start_date: new Date(subscription.start_date * 1000).toISOString(),
            end_date: new Date(subscription.current_period_end * 1000).toISOString(),
            monthly_price: subscription.items.data[0].price.unit_amount,
            subscription_tier: "Premium",
            user_id: session.client_reference_id
          });
        }
        
        // Handle one-time payment checkout completion
        else if (session.mode === "payment") {
          // Find the related subscription data
          const { data: tempData } = await supabase
            .from("temp_subscriptions")
            .select("*")
            .eq("stripe_session_id", session.id)
            .single();

          if (tempData) {
            // Create subscription record for one-time payment
            await supabase.from("subscriptions").insert({
              stripe_customer_id: session.customer,
              status: "active",
              start_date: new Date().toISOString(),
              end_date: new Date(
                Date.now() + 3 * 30 * 24 * 60 * 60 * 1000
              ).toISOString(), // 3 months from now
              monthly_price: tempData.monthly_price,
              subscription_tier: "Premium",
              user_id: session.client_reference_id
            });
          }
        }
        break;

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object;
        
        // Update the subscription in our database
        await supabase
          .from("subscriptions")
          .update({
            status: updatedSubscription.status,
            end_date: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", updatedSubscription.id);
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        
        // Mark the subscription as cancelled in our database
        await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", deletedSubscription.id);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
