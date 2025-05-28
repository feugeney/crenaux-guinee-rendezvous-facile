
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
    const { bookingId, email, customerName, topic, date, startTime, endTime, message } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Préparer l'email de confirmation
    const emailData = {
      to: email,
      subject: `Confirmation de votre rendez-vous - ${topic}`,
      text: `
Bonjour ${customerName || 'Client'},

Votre rendez-vous a été confirmé :

📅 Date : ${new Date(date).toLocaleDateString('fr-FR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
🕐 Heure : ${startTime.substring(0, 5)} - ${endTime.substring(0, 5)}
📝 Sujet : ${topic}

${message ? `Votre message : ${message}` : ''}

Merci de votre confiance. Nous avons hâte de vous rencontrer !

Cordialement,
L'équipe Dom Consulting

---
En cas de besoin, n'hésitez pas à nous contacter.
      `
    };

    console.log("Envoi d'email de confirmation forcé pour:", email);

    // Essayer d'abord avec Gmail SMTP
    try {
      const { data, error } = await supabase.functions.invoke('send-gmail-smtp', {
        body: emailData
      });

      if (error) throw error;

      console.log("Email envoyé avec succès via Gmail SMTP");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email de confirmation envoyé avec succès",
          method: "Gmail SMTP"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );

    } catch (gmailError) {
      console.error("Erreur Gmail SMTP:", gmailError);
      
      // Essayer avec Nodemailer en fallback
      try {
        const { data, error } = await supabase.functions.invoke('send-gmail-nodemailer', {
          body: emailData
        });

        if (error) throw error;

        console.log("Email envoyé avec succès via Nodemailer");
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Email de confirmation envoyé avec succès (fallback)",
            method: "Gmail Nodemailer"
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );

      } catch (nodemailerError) {
        console.error("Erreur Nodemailer:", nodemailerError);
        throw new Error("Impossible d'envoyer l'email avec les deux méthodes");
      }
    }

  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Erreur lors de l'envoi de l'email de confirmation" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
