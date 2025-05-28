
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Corriger la fonction SQL avec une syntaxe valide
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.block_time_slot_on_booking()
        RETURNS trigger
        LANGUAGE plpgsql
        AS $function$
        DECLARE
          slot_id uuid;
        BEGIN
          -- Si c'est une nouvelle réservation avec paiement confirmé
          IF (TG_OP = 'INSERT' AND NEW.payment_status = 'completed') OR 
             (TG_OP = 'UPDATE' AND OLD.payment_status != 'completed' AND NEW.payment_status = 'completed') THEN
            
            -- Trouver le créneau correspondant
            SELECT id INTO slot_id
            FROM public.time_slots 
            WHERE 
              day_of_week = EXTRACT(dow FROM NEW.date)
              AND start_time = NEW.start_time
              AND end_time = NEW.end_time
              AND available = true
              AND booking_id IS NULL
            ORDER BY created_at ASC
            LIMIT 1;
            
            -- Bloquer le créneau si trouvé
            IF slot_id IS NOT NULL THEN
              UPDATE public.time_slots 
              SET 
                available = false,
                booking_id = NEW.id,
                updated_at = now()
              WHERE id = slot_id;
            END IF;
            
          -- Si la réservation est annulée, libérer le créneau
          ELSIF TG_OP = 'UPDATE' AND OLD.payment_status = 'completed' AND NEW.payment_status = 'cancelled' THEN
            
            UPDATE public.time_slots 
            SET 
              available = true,
              booking_id = NULL,
              updated_at = now()
            WHERE booking_id = OLD.id;
            
          END IF;
          
          RETURN COALESCE(NEW, OLD);
        END;
        $function$;
      `
    });

    if (functionError) {
      console.error("Erreur lors de la création de la fonction:", functionError);
    }

    // Créer le trigger
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP TRIGGER IF EXISTS trigger_block_time_slot_on_booking ON public.bookings;
        CREATE TRIGGER trigger_block_time_slot_on_booking
          AFTER INSERT OR UPDATE ON public.bookings
          FOR EACH ROW
          EXECUTE FUNCTION public.block_time_slot_on_booking();
      `
    });

    if (triggerError) {
      console.error("Erreur lors de la création du trigger:", triggerError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Fonction et trigger créés avec succès" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Erreur:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
