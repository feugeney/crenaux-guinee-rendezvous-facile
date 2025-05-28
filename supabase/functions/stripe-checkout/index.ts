
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
    const { bookingData, productPrice } = await req.json();
    const isPriority = bookingData?.isPriority === true;
    // Prix en USD (dollars américains)
    const price = isPriority ? 350 : (productPrice ? productPrice : 250); // 350 USD for priority, 250 USD default
    
    // Log the booking data for debugging
    console.log("Booking data received:", JSON.stringify(bookingData));

    // Récupération du header d'autorisation (optionnel pour les paiements non authentifiés)
    const authHeader = req.headers.get('Authorization');
    
    // Initialisation du client Supabase avec la clé anon
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    let customerEmail = bookingData?.email || 'guest@example.com';

    // Si l'utilisateur est authentifié, récupérer son email
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
        
        if (!userError && userData?.user?.email) {
          customerEmail = userData.user.email;
        }
      } catch (e) {
        console.error("Erreur lors de l'authentification:", e);
        // Continuer avec l'email fourni dans bookingData ou guest@example.com
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
          name: bookingData?.fullName || `${bookingData?.firstName || ''} ${bookingData?.lastName || ''}`.trim() || undefined,
          phone: bookingData?.phone,
        });
        customerId = newCustomer.id;
      }
    }

    // Création des détails pour Stripe Checkout
    const appointmentType = isPriority ? "Rendez-vous prioritaire express (48h)" : "Rendez-vous standard";
    
    const productInfo = `${appointmentType}: ${bookingData?.topic || "Bilan stratégique"}`;

    // Configuration du retour URL pour les tests ou production
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    const successUrl = `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/payment?canceled=true`;

    // Création de la session Stripe avec prix en USD
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: !customerId ? customerEmail : undefined,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",  // Changé à USD
            product_data: {
              name: productInfo,
              description: `Réservation pour ${bookingData?.fullName || ''}`,
            },
            unit_amount: price * 100, // Montant en cents USD
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        booking_id: bookingData?.id || '',
        customer_name: bookingData?.fullName || '',
        customer_email: customerEmail,
        date: bookingData?.date || '',
        time: bookingData?.time || '',
        is_priority: isPriority ? 'true' : 'false'
      }
    });
    
    // Stocker les données de réservation pour utilisation après le paiement
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Stockage temporaire des données de réservation
    const { error: insertError } = await supabaseAdmin.from('temp_bookings_data').upsert({
      stripe_session_id: session.id,
      booking_data: bookingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (insertError) {
      console.error("Error storing temporary booking data:", insertError);
    }

    // Logs pour le débogage
    console.log("Stripe session created:", {
      sessionId: session.id,
      customerId,
      customerEmail,
      amount: price,
      productInfo,
      isPriority
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
