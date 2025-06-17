
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID requis");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Initialiser Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Récupérer les détails de la session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Trouver la candidature correspondante
      const { data: application, error: findError } = await supabase
        .from('political_launch_applications')
        .select('*')
        .eq('payment_link', session.url)
        .single();

      if (findError || !application) {
        // Essayer de trouver par metadata si disponible
        const { data: apps, error: searchError } = await supabase
          .from('political_launch_applications')
          .select('*')
          .eq('status', 'approved')
          .eq('schedule_validated', true);

        if (searchError || !apps || apps.length === 0) {
          throw new Error("Candidature non trouvée");
        }

        // Prendre la première candidature en attente de paiement
        const foundApp = apps.find(app => app.payment_link && app.payment_link.includes(sessionId));
        
        if (!foundApp) {
          throw new Error("Candidature non trouvée pour cette session");
        }

        // Mettre à jour le statut à "paid"
        const { error: updateError } = await supabase
          .from('political_launch_applications')
          .update({
            status: 'paid',
            payment_confirmed_at: new Date().toISOString(),
            stripe_session_id: sessionId,
            updated_at: new Date().toISOString()
          })
          .eq('id', foundApp.id);

        if (updateError) {
          throw new Error('Erreur lors de la mise à jour du statut de paiement');
        }
      } else {
        // Mettre à jour le statut à "paid"
        const { error: updateError } = await supabase
          .from('political_launch_applications')
          .update({
            status: 'paid',
            payment_confirmed_at: new Date().toISOString(),
            stripe_session_id: sessionId,
            updated_at: new Date().toISOString()
          })
          .eq('id', application.id);

        if (updateError) {
          throw new Error('Erreur lors de la mise à jour du statut de paiement');
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'paid',
          message: 'Paiement confirmé avec succès'
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          status: session.payment_status,
          message: 'Paiement non confirmé'
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

  } catch (error: any) {
    console.error("Erreur lors de la vérification du paiement:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
