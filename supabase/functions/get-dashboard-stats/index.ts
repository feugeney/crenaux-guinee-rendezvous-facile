
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Récupérer l'API key pour Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    // Initialiser le client Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Nombre total de clients
    const { count: clientsCount, error: clientsError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Nombre total de rendez-vous
    const { count: bookingsCount, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // Nombre de rendez-vous prioritaires en attente
    const { count: priorityBookingsCount, error: priorityBookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('is_priority', true)
      .eq('payment_status', 'pending');

    // Nombre de rendez-vous cette semaine
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const { count: weekBookingsCount, error: weekBookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('date', startOfWeek.toISOString().split('T')[0])
      .lte('date', endOfWeek.toISOString().split('T')[0]);

    if (clientsError || bookingsError || priorityBookingsError || weekBookingsError) {
      throw new Error("Erreur lors de la récupération des statistiques");
    }

    // Récupérer les rendez-vous à venir
    const { data: upcomingBookings, error: upcomingError } = await supabase
      .from('bookings')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(5);

    if (upcomingError) {
      throw new Error("Erreur lors de la récupération des rendez-vous à venir");
    }

    // Retourner les données
    return new Response(
      JSON.stringify({
        clients_count: clientsCount || 0,
        bookings_count: bookingsCount || 0,
        priority_bookings_count: priorityBookingsCount || 0,
        week_bookings_count: weekBookingsCount || 0,
        upcoming_bookings: upcomingBookings || [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Erreur:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
