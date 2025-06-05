
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Méthode non autorisée" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    const { to, subject, text, html, from }: EmailRequest = await req.json();

    if (!to || !subject || !text) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants: to, subject, text" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Envoi d'email Gmail à: ${to}`);

    // Configuration Gmail SMTP réelle
    const gmailUser = "noreply.econtrib@gmail.com";
    const gmailPassword = "rqnddyfodqimpccs";

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error("Adresse email destinataire invalide");
    }

    // Configuration du client SMTP
    const client = new SmtpClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 587,
        tls: false,
        auth: {
          username: gmailUser,
          password: gmailPassword,
        },
      },
    });

    // Préparer l'email
    const mailOptions = {
      from: from || `"Dom Consulting" <${gmailUser}>`,
      to: to,
      subject: subject,
      content: html || text.replace(/\n/g, '\r\n'),
      html: html,
    };

    console.log("Envoi de l'email via Gmail SMTP...");

    // Envoyer l'email réellement
    await client.send(mailOptions);
    
    // Fermer la connexion
    await client.close();

    console.log(`Email envoyé avec succès à: ${to}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email envoyé avec succès via Gmail",
        details: {
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject,
          transport: "Gmail SMTP"
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Erreur lors de l'envoi d'email Gmail:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Erreur lors de l'envoi de l'email Gmail"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
