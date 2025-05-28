
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create required functions and tables
    const { error: functionError } = await supabaseAdmin.rpc('create_helper_functions');
    if (functionError) {
      throw new Error(`Error creating functions: ${functionError.message}`);
    }

    // Create temp_bookings_data table if it doesn't exist
    const { error: tempBookingsError } = await supabaseAdmin.rpc('create_temp_bookings_table');
    if (tempBookingsError) {
      throw new Error(`Error creating temp_bookings_data table: ${tempBookingsError.message}`);
    }

    // Create bookings table if it doesn't exist
    const { error: bookingsError } = await supabaseAdmin.rpc('create_bookings_table');
    if (bookingsError) {
      throw new Error(`Error creating bookings table: ${bookingsError.message}`);
    }

    // Create priority bookings view if it doesn't exist
    const checkViewExistsQuery = `
      SELECT EXISTS (
        SELECT FROM pg_views WHERE viewname = 'priority_bookings'
      )
    `;
    
    const { data: viewExists, error: viewCheckError } = await supabaseAdmin.rpc(
      'query_single', { query_text: checkViewExistsQuery }
    );
    
    if (viewCheckError) {
      console.error("Error checking view existence:", viewCheckError);
    } else if (!viewExists || !viewExists.exists) {
      const createViewQuery = `
        CREATE VIEW public.priority_bookings AS 
        SELECT * FROM public.bookings WHERE is_priority = true
      `;
      
      const { error: createViewError } = await supabaseAdmin.rpc(
        'execute_sql', { sql_query: createViewQuery }
      );
      
      if (createViewError) {
        console.error("Error creating priority_bookings view:", createViewError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Database helper functions and tables created successfully' }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in database-helper function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
