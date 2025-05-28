
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Nom de la table où sont stockées les configurations
const SETTINGS_TABLE = 'site_settings';

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authentification de la requête
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Non autorisé - Header d\'authentification manquant');
    }
    
    // Création du client Supabase (en lecture seule)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    // Vérification de l'utilisateur
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !userData.user) {
      throw new Error('Non autorisé - Utilisateur non authentifié');
    }
    
    // Récupération de la clé publique
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from(SETTINGS_TABLE)
      .select('value')
      .eq('key', 'stripe_public_key')
      .single();
    
    // Vérification de la clé secrète (sans la révéler)
    let secretKeyConfigured = false;
    try {
      secretKeyConfigured = !!Deno.env.get('STRIPE_SECRET_KEY');
    } catch (e) {
      // Ne rien faire si la récupération échoue
    }
    
    // Détermination de l'état de configuration
    const publicKeyConfigured = !settingsError && settingsData?.value;
    const configured = publicKeyConfigured && secretKeyConfigured;
    
    return new Response(
      JSON.stringify({
        configured,
        publicKey: publicKeyConfigured ? settingsData.value : null
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erreur de vérification config Stripe:', error);
    return new Response(
      JSON.stringify({ error: error.message, configured: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
