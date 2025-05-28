
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
    // Récupération des clés de la requête
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Erreur de parsing JSON:", error);
      throw new Error('Format de requête invalide: JSON attendu');
    }
    
    const { publicKey, secretKey } = body || {};
    
    // Vérifier si la clé publique existe
    if (!publicKey) {
      throw new Error('La clé publique Stripe est requise');
    }

    // Vérification du format des clés
    if (!publicKey.startsWith('pk_')) {
      throw new Error('Format de clé publique invalide');
    }

    if (secretKey && !secretKey.startsWith('sk_')) {
      throw new Error('Format de clé secrète invalide');
    }
    
    // Authentification de la requête
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Non autorisé - Header d\'authentification manquant');
    }
    
    // Création du client Supabase avec la clé de service
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Vérification que l'utilisateur est authentifié
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !userData.user) {
      console.error("Erreur d'authentification:", authError);
      throw new Error('Non autorisé - Utilisateur non authentifié');
    }
    
    // Stockage de la clé publique dans la base de données (visible côté client)
    const { error: upsertError } = await supabaseAdmin.from(SETTINGS_TABLE).upsert({
      key: 'stripe_public_key',
      value: publicKey
    }, {
      onConflict: 'key'
    });
    
    if (upsertError) {
      console.error("Erreur d'upsert:", upsertError);
      throw new Error(`Erreur lors de la mise à jour des paramètres: ${upsertError.message}`);
    }
    
    // Stockage de la clé secrète dans les variables d'environnement si elle est fournie
    if (secretKey) {
      // Note: Dans un environnement réel, cette clé devrait être stockée dans une variable
      // d'environnement sécurisée de Supabase (Secrets) et non dans la base de données
      console.log('Clé secrète fournie, à stocker dans les variables d\'environnement Supabase');

      // On pourrait implémenter ici un mécanisme pour mettre à jour la variable d'environnement
      // mais pour l'instant, on ne fait que la loguer
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erreur de configuration Stripe:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
