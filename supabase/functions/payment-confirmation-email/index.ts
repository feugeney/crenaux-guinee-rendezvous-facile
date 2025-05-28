
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
    const { bookingData, paymentInfo } = await req.json();
    
    // Initialize Supabase client with service role to send emails and update database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    console.log("Préparation de l'email de confirmation pour:", bookingData.email);

    // Enhanced email template with more details
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://ulfdphrinlzjlzejkyno.supabase.co/storage/v1/object/public/public/logo-domconsulting.png" alt="Dom Consulting Logo" style="width: 120px;">
        </div>
        <h1 style="color: #6A0DAD; text-align: center; font-size: 24px; margin-bottom: 20px;">Confirmation de Paiement</h1>
        <p style="margin-bottom: 15px;">Bonjour ${bookingData.fullName || bookingData.firstName + ' ' + bookingData.lastName},</p>
        <p style="margin-bottom: 15px;">Nous vous remercions pour votre paiement. Votre réservation a été confirmée avec succès.</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #6A0DAD; padding: 15px; margin: 20px 0;">
          <h2 style="color: #6A0DAD; font-size: 18px; margin-top: 0;">Détails de votre réservation :</h2>
          <ul style="padding-left: 20px;">
            <li><strong>Service :</strong> ${bookingData.topic || "Consultation stratégique"}</li>
            <li><strong>Date :</strong> ${bookingData.date || "À confirmer"}</li>
            <li><strong>Heure :</strong> ${bookingData.timeSlot?.startTime || "À confirmer"}</li>
            <li><strong>Montant payé :</strong> ${paymentInfo?.amount ? (paymentInfo.amount / 100).toLocaleString() + " " + (paymentInfo.currency || "GNF") : "Paiement confirmé"}</li>
          </ul>
        </div>
        
        <p style="margin-bottom: 15px;">Votre séance est maintenant confirmée. Un de nos coachs vous contactera prochainement avec des informations supplémentaires concernant votre rendez-vous.</p>
        
        <p style="margin-bottom: 5px;">Cordialement,</p>
        <p style="font-weight: bold; margin-top: 0;">L'équipe Dom Consulting</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 14px;">
          <p>&copy; ${new Date().getFullYear()} Dom Consulting. Tous droits réservés.</p>
        </div>
      </div>
    `;

    console.log("Envoi de l'email au client...");

    try {
      // Send email through our new send-smtp-email function
      const emailResponse = await supabase.functions.invoke("send-smtp-email", {
        body: {
          to: bookingData.email,
          subject: "Dom Consulting - Confirmation de Paiement",
          html: html,
          from: "Dom Consulting <noreply.econtrib@gmail.com>"
        }
      });

      if (emailResponse.error) {
        console.error("Erreur lors de l'envoi de l'email:", emailResponse.error);
        throw new Error("Erreur lors de l'envoi de l'email de confirmation");
      }

      console.log("Email envoyé avec succès!");

      // Create notification for both admin and client record
      const adminNotification = await supabase.from('notifications').insert({
        type: 'payment_confirmation',
        recipient_email: 'admin@domconsulting.com', 
        sender_email: 'notifications@domconsulting.com',
        subject: 'Nouvelle réservation confirmée',
        content: `Une nouvelle réservation a été confirmée par ${bookingData.fullName || bookingData.firstName + ' ' + bookingData.lastName} pour le ${bookingData.date} à ${bookingData.timeSlot?.startTime}.`,
        sent: true,
        metadata: {
          bookingData,
          paymentInfo
        }
      }).select('id').single();

      const clientNotification = await supabase.from('notifications').insert({
        type: 'payment_confirmation',
        recipient_email: bookingData.email,
        sender_email: 'notifications@domconsulting.com',
        subject: 'Confirmation de paiement',
        content: `Votre paiement pour la réservation du ${bookingData.date} à ${bookingData.timeSlot?.startTime} a été confirmé.`,
        sent: true,
        metadata: {
          bookingData,
          paymentInfo
        }
      }).select('id').single();

      // If we have booking ID and notification IDs, update booking with notification references
      if (bookingData.id) {
        await supabase.from('bookings').update({
          payment_status: 'paid',
          client_notification_id: clientNotification.data?.id,
          team_notification_id: adminNotification.data?.id
        }).eq('id', bookingData.id);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (innerError) {
      console.error("Erreur dans le processus d'envoi d'email:", innerError);
      // Even if email fails, we still want to record the payment success
      return new Response(
        JSON.stringify({ success: true, emailSent: false, error: innerError.message }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error: any) {
    console.error("Error in payment-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
