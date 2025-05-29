
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  text: string;
  html?: string;
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
    const { to, subject, text, html }: EmailRequest = await req.json();

    if (!to || !subject || !text) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants: to, subject, text" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Tentative d'envoi d'email à: ${to}`);

    // Récupérer les variables d'environnement
    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY");
    const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN");
    const mailgunFrom = Deno.env.get("MAILGUN_FROM");

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Adresse email destinataire invalide" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Vérifier si les secrets Mailgun sont configurés
    const hasMailgunConfig = mailgunApiKey && mailgunDomain && mailgunFrom;
    
    if (!hasMailgunConfig) {
      // Mode test - simulation complète
      console.log("=== MODE TEST ACTIVÉ ===");
      console.log("Aucune configuration Mailgun détectée, simulation d'envoi...");
      console.log(`- À: ${to}`);
      console.log(`- Sujet: ${subject}`);
      console.log(`- Contenu: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
      if (html) {
        console.log(`- HTML: ${html.substring(0, 100)}${html.length > 100 ? '...' : ''}`);
      }
      
      // Simuler un délai d'envoi réaliste
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Email simulé avec succès (mode test - aucun email réel envoyé)",
          details: {
            from: "Dom Consulting <test@domconsulting.com>",
            to: to,
            subject: subject,
            mode: "test_simulation",
            timestamp: new Date().toISOString(),
            note: "Pour envoyer de vrais emails, configurez les secrets MAILGUN_API_KEY, MAILGUN_DOMAIN et MAILGUN_FROM"
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Mode production - envoi réel via Mailgun
    console.log("=== MODE PRODUCTION ===");
    console.log("Configuration Mailgun détectée, envoi via API...");
    
    const formData = new FormData();
    formData.append("from", mailgunFrom);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("text", text);
    if (html) {
      formData.append("html", html);
    }

    const response = await fetch(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(`api:${mailgunApiKey}`)}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur Mailgun: ${response.status} - ${errorText}`);
      throw new Error(`Erreur Mailgun: ${response.status} - ${errorText}`);
    }

    const responseData = await response.text();
    console.log("Email envoyé avec succès via Mailgun:", responseData);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email envoyé avec succès via Mailgun",
        details: {
          from: mailgunFrom,
          to: to,
          subject: subject,
          mode: "production",
          mailgunResponse: responseData
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Erreur lors de l'envoi d'email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Erreur lors de l'envoi de l'email"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
