
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

    console.log(`Envoi d'email de test à: ${to}`);

    // Utiliser des données de test par défaut
    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY") || "test-key";
    const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN") || "sandbox-test.mailgun.org";
    const mailgunFrom = Deno.env.get("MAILGUN_FROM") || "Dom Consulting <test@domconsulting.com>";

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

    // Mode test activé si pas de vraies clés configurées
    if (mailgunApiKey === "test-key" || !Deno.env.get("MAILGUN_API_KEY")) {
      console.log("Mode test activé - simulation d'envoi d'email");
      console.log(`- De: ${mailgunFrom}`);
      console.log(`- À: ${to}`);
      console.log(`- Sujet: ${subject}`);
      console.log(`- Contenu text: ${text.substring(0, 100)}...`);
      if (html) {
        console.log(`- Contenu HTML: ${html.substring(0, 100)}...`);
      }
      
      // Simuler un délai d'envoi réaliste
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Email envoyé avec succès (mode test - aucun email réel envoyé)",
          details: {
            from: mailgunFrom,
            to: to,
            subject: subject,
            mode: "test",
            timestamp: new Date().toISOString()
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Code pour l'envoi réel via Mailgun (seulement si les vraies clés sont configurées)
    console.log("Envoi via Mailgun API...");
    
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
