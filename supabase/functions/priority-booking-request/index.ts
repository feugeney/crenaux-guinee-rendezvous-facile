
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

  console.log("[PRIORITY-REQUEST] Function started");

  try {
    // Get booking data from request
    const { bookingData } = await req.json();
    console.log("[PRIORITY-REQUEST] Booking data received:", JSON.stringify(bookingData));

    if (!bookingData) {
      throw new Error("Missing booking data");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare the client confirmation email
    const formattedDate = new Date(bookingData.date).toLocaleDateString('fr-FR', {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    
    const customerName = bookingData.fullName || `${bookingData.firstName || ''} ${bookingData.lastName || ''}`.trim();
    
    // Create notification for client
    const clientEmailSubject = "Votre demande de rendez-vous prioritaire";
    const clientEmailContent = `
Bonjour ${customerName},

Nous avons bien reçu votre demande de rendez-vous prioritaire. Votre requête est en cours de traitement.

Prochaines étapes :
1. Notre équipe analysera votre demande dans les 48 heures
2. Nous vous contacterons pour confirmer un créneau disponible
3. Un lien de paiement vous sera envoyé pour valider définitivement le rendez-vous

Voici le récapitulatif de votre demande :
- Date souhaitée : ${formattedDate}
- Sujet : ${bookingData.topic || bookingData.consultationTopic || 'Bilan Stratégique'}

Merci pour votre confiance. Nous vous contacterons très prochainement.

L'équipe Dom Consulting
    `;
    
    const clientEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .steps { margin: 20px 0; padding: 15px; background: #eef2ff; border-radius: 5px; }
    .details { background-color: #f0f4ff; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Demande de Rendez-vous Prioritaire</h1>
    </div>
    <div class="content">
      <p>Bonjour ${customerName},</p>
      <p>Nous avons bien reçu votre demande de rendez-vous prioritaire. Votre requête est en cours de traitement.</p>
      
      <div class="steps">
        <h3>Prochaines étapes :</h3>
        <ol>
          <li>Notre équipe analysera votre demande dans les 48 heures</li>
          <li>Nous vous contacterons pour confirmer un créneau disponible</li>
          <li>Un lien de paiement vous sera envoyé pour valider définitivement le rendez-vous</li>
        </ol>
      </div>
      
      <div class="details">
        <h3>Récapitulatif de votre demande :</h3>
        <ul>
          <li><strong>Date souhaitée :</strong> ${formattedDate}</li>
          <li><strong>Sujet :</strong> ${bookingData.topic || bookingData.consultationTopic || 'Bilan Stratégique'}</li>
        </ul>
      </div>
      
      <p>Merci pour votre confiance. Nous vous contacterons très prochainement.</p>
    </div>
    <div class="footer">
      <p>L'équipe Dom Consulting</p>
      <p>WhatsApp: +224 610 73 08 69</p>
    </div>
  </div>
</body>
</html>`;

    console.log("[PRIORITY-REQUEST] Creating client notification");
    const { data: clientNotification, error: clientNotifError } = await supabase
      .from('notifications')
      .insert({
        type: 'priority_booking_request',
        recipient_email: bookingData.email,
        sender_email: 'equipe@domconsulting.com',
        subject: clientEmailSubject,
        content: clientEmailContent,
        metadata: {
          booking_data: bookingData
        },
        sent: false
      })
      .select()
      .single();
      
    if (clientNotifError) {
      console.error("[PRIORITY-REQUEST] Client notification error:", clientNotifError);
    } else {
      console.log("[PRIORITY-REQUEST] Client notification created");
    }
    
    // Create notification for admin
    console.log("[PRIORITY-REQUEST] Creating admin notification");
    const adminEmailSubject = "Nouvelle demande de rendez-vous prioritaire";
    const adminEmailContent = `
Nouvelle demande de rendez-vous prioritaire de ${customerName}

Détails de la demande :
- Client : ${customerName}
- Email : ${bookingData.email}
- Téléphone : ${bookingData.phone ? `${bookingData.countryCode || ''} ${bookingData.phone}` : 'Non spécifié'}
- WhatsApp : ${bookingData.whatsapp || 'Non spécifié'}
- Date souhaitée : ${formattedDate}
- Sujet : ${bookingData.topic || bookingData.consultationTopic || 'Bilan Stratégique'}

${bookingData.reason ? `Raison de l'urgence : ${bookingData.reason}` : ''}
${bookingData.questions ? `Questions/précisions : ${bookingData.questions}` : ''}
${bookingData.whyDomani ? `Pourquoi Dom Consulting : ${bookingData.whyDomani}` : ''}

Cette demande nécessite une réponse dans les 48 heures.
`;

    const { data: adminNotification, error: notifError } = await supabase
      .from('notifications')
      .insert({
        type: "priority_booking_request",
        recipient_email: "admin@domconsulting.com",
        sender_email: bookingData.email,
        subject: adminEmailSubject,
        content: adminEmailContent,
        metadata: {
          booking_data: bookingData
        },
        sent: false
      })
      .select()
      .single();
      
    if (notifError) {
      console.error("[PRIORITY-REQUEST] Notification error:", notifError);
    } else {
      console.log("[PRIORITY-REQUEST] Admin notification created");
    }

    // Send confirmation email to client using Mailgun
    try {
      console.log("[PRIORITY-REQUEST] Sending confirmation email to client via Mailgun");
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-mailgun-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          to: bookingData.email,
          subject: clientEmailSubject,
          html: clientEmailHtml,
          text: clientEmailContent
        })
      });
      
      const emailResult = await emailResponse.json();
      
      if (emailResponse.ok && emailResult.success) {
        console.log("[PRIORITY-REQUEST] Email sent successfully via Mailgun");
        
        // Update notification as sent if we have one
        if (clientNotification) {
          await supabase
            .from('notifications')
            .update({ sent: true })
            .eq('id', clientNotification.id);
        }
      } else {
        console.error("[PRIORITY-REQUEST] Error sending email via Mailgun:", emailResult);
      }
    } catch (emailError) {
      console.error("[PRIORITY-REQUEST] Error calling send-mailgun-email function:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Demande prioritaire enregistrée avec succès",
        client_notification: clientNotification,
        admin_notification: adminNotification
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("[PRIORITY-REQUEST] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
