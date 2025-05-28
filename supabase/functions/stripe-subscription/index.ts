
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Récupération des données de la requête
    const { bookingData, subscriptionMonths = 3, paymentType = "subscription" } = await req.json();
    
    // Options de prix
    const prices = {
      full: 600, // Paiement complet: 600 USD
      monthly: 250 // Paiement mensuel: 250 USD par mois
    };
    
    // Récupération du header d'autorisation (optionnel pour les paiements non authentifiés)
    const authHeader = req.headers.get('Authorization');
    
    // Initialisation du client Supabase avec la clé de service pour les opérations administratives
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    let customerEmail = bookingData?.email || 'guest@example.com';
    let userId = null;

    // Si l'utilisateur est authentifié, récupérer son email
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
        
        if (!userError && userData?.user?.email) {
          customerEmail = userData.user.email;
          userId = userData.user.id;
        }
      } catch (e) {
        console.error("Erreur lors de l'authentification:", e);
      }
    }
    
    // Initialisation de Stripe avec la clé secrète
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('La clé secrète Stripe n\'est pas configurée');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Recherche ou création d'un client Stripe pour cet utilisateur
    let customerId;
    if (customerEmail !== 'guest@example.com') {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        // Créer un nouveau client si nécessaire
        const newCustomer = await stripe.customers.create({
          email: customerEmail,
          name: bookingData?.firstName && bookingData?.lastName 
            ? `${bookingData.firstName} ${bookingData.lastName}`
            : bookingData?.fullName || undefined,
          phone: bookingData?.phone,
        });
        customerId = newCustomer.id;
      }
    }

    // Configuration du retour URL pour les tests ou production
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    const successUrl = `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}&subscription=true`;
    const cancelUrl = `${origin}/payment?canceled=true`;
    
    const sessionOptions = {
      customer: customerId,
      customer_email: !customerId ? customerEmail : undefined,
      client_reference_id: userId,
      payment_method_types: ["card"],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customer_name: bookingData?.firstName && bookingData?.lastName 
          ? `${bookingData.firstName} ${bookingData.lastName}` 
          : bookingData?.fullName || '',
        subscription_type: 'coaching_program',
        customer_email: customerEmail,
      }
    };

    let session;
    
    // Créer différents types de sessions selon le type de paiement
    if (paymentType === "full") {
      // Paiement complet en une fois
      session = await stripe.checkout.sessions.create({
        ...sessionOptions,
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Programme d'accompagnement coaching",
              description: `Abonnement coaching premium de 3 mois - paiement complet`,
            },
            unit_amount: prices.full * 100, // Conversion en centimes
          },
          quantity: 1,
        }],
        mode: "payment",
      });
    } else {
      // Paiement par abonnement mensuel
      session = await stripe.checkout.sessions.create({
        ...sessionOptions,
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Programme d'accompagnement coaching",
              description: `Abonnement coaching mensuel`,
            },
            unit_amount: prices.monthly * 100, // Conversion en centimes
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        }],
        mode: "subscription",
      });
    }
    
    // Stocker les données pour utilisation après le paiement
    await supabaseAdmin.from('temp_subscriptions').insert({
      stripe_session_id: session.id,
      subscription_data: {
        customer_email: customerEmail,
        subscription_months: subscriptionMonths,
        monthly_price: paymentType === "full" ? prices.full : prices.monthly,
        payment_type: paymentType,
        user_id: userId,
        customer_info: {
          firstName: bookingData?.firstName || '',
          lastName: bookingData?.lastName || '',
          phone: bookingData?.phone || '',
          email: customerEmail
        }
      },
      created_at: new Date().toISOString()
    });

    console.log("Stripe subscription session created:", {
      sessionId: session.id,
      customerId,
      customerEmail,
      paymentType
    });

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erreur Stripe:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
