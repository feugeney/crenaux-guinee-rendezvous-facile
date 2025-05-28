
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle HTTP OPTIONS request (CORS preflight)
function corsResponse() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Main function handler
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return corsResponse();
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { booking, profile, resend = false } = body;

    if (!booking || !profile) {
      return new Response(
        JSON.stringify({
          error: "Les données de réservation ou de profil sont manquantes"
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Traitement de la confirmation de réservation pour: ${profile.email}`);

    // Format the date nicely
    const formattedDate = new Date(booking.date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Get customer full name
    const customerName = profile.first_name && profile.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : booking.customer_name || profile.email;

    // Construct email content for CLIENT ONLY
    const emailSubject = `Confirmation de votre réservation - ${formattedDate}`;
    
    // HTML version of the email for CLIENT
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .details { background-color: #f0f4ff; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Votre réservation est confirmée</h1>
    </div>
    <div class="content">
      <p>Bonjour ${customerName},</p>
      <p>Nous vous confirmons votre réservation du <strong>${formattedDate}</strong> de <strong>${booking.start_time}</strong> à <strong>${booking.end_time}</strong>.</p>
      
      <div class="details">
        <h3>Détails de la consultation:</h3>
        <ul>
          <li>Sujet: ${booking.topic}</li>
          <li>Statut de paiement: ${booking.payment_status === 'completed' ? '<span style="color: green">Payé</span>' : '<span style="color: orange">En attente</span>'}</li>
        </ul>
      </div>
      
      <p>Merci de votre confiance. Nous avons hâte de vous accueillir.</p>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter par email ou WhatsApp.</p>
    </div>
    <div class="footer">
      <p>L'équipe Dom Consulting</p>
      <p>WhatsApp: +224 610 73 08 69</p>
    </div>
  </div>
</body>
</html>`;

    // Text version for CLIENT
    const emailText = `
Bonjour ${customerName},

Nous vous confirmons votre réservation du ${formattedDate} de ${booking.start_time} à ${booking.end_time}.

Détails de la consultation:
- Sujet: ${booking.topic}
- Statut de paiement: ${booking.payment_status === 'completed' ? 'Payé' : 'En attente'}

Merci de votre confiance. Nous avons hâte de vous accueillir.
Si vous avez des questions, n'hésitez pas à nous contacter par email ou WhatsApp.

L'équipe Dom Consulting
WhatsApp: +224 610 73 08 69
`;

    // Create notification record for CLIENT ONLY
    const { data: clientNotification, error: clientNotifError } = await supabase
      .from('notifications')
      .insert({
        type: 'booking_confirmation',
        recipient_email: profile.email,
        sender_email: "noreply@domconsulting.com",
        subject: emailSubject,
        content: emailHtml,
        metadata: { 
          booking_id: booking.id,
          booking_date: booking.date,
          booking_time: booking.start_time
        },
        read: false,
        sent: false // Mark as not sent yet
      })
      .select()
      .single();

    if (clientNotifError) {
      console.error("Erreur lors de la création de la notification client:", clientNotifError);
      return new Response(
        JSON.stringify({ error: clientNotifError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Update booking with client notification ID
    await supabase
      .from('bookings')
      .update({
        client_notification_id: clientNotification?.id
      })
      .eq('id', booking.id);

    // Send CLIENT email ONLY using Mailgun
    try {
      console.log(`Envoi d'email de confirmation au client via Mailgun: ${profile.email}`);
      
      const { data: emailResult, error: emailError } = await supabase.functions.invoke("send-mailgun-email", {
        body: {
          to: profile.email,
          subject: emailSubject,
          html: emailHtml,
          text: emailText
        }
      });
      
      if (emailError) {
        console.error("Erreur lors de l'envoi de l'email client:", emailError);
        throw new Error(`Erreur d'envoi: ${emailError.message}`);
      }

      if (emailResult?.success) {
        // Update notification as sent
        await supabase
          .from('notifications')
          .update({ sent: true })
          .eq('id', clientNotification.id);
          
        console.log("Email client envoyé avec succès via Mailgun et notification mise à jour");
      } else {
        throw new Error(emailResult?.error || "Échec de l'envoi de l'email");
      }

    } catch (clientEmailError) {
      console.error("Erreur lors de l'envoi de l'email de confirmation:", clientEmailError);
      // Continue processing but mark as failed
      await supabase
        .from('notifications')
        .update({ 
          sent: false,
          metadata: { 
            ...clientNotification.metadata,
            error: clientEmailError.message 
          }
        })
        .eq('id', clientNotification.id);
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Confirmation enregistrée et email envoyé au client uniquement via Mailgun",
        client_notification: clientNotification
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error("Erreur:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
