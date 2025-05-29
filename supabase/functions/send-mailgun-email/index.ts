
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

    // Utiliser des données de test
    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY") || "key-test123456789";
    const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN") || "sandbox-test.mailgun.org";
    const mailgunFrom = Deno.env.get("MAILGUN_FROM") || "Dom Consulting <test@example.com>";

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error("Adresse email destinataire invalide");
    }

    // En mode test, simuler l'envoi réussi
    if (mailgunApiKey === "key-test123456") {
      console.log("Mode test activé - simulation d'envoi d'email");
      console.log(`- De: ${mailgunFrom}`);
      console.log(`- À: ${to}`);
      console.log(`- Sujet: ${subject}`);
      
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Email envoyé avec succès (mode test)",
          details: {
            from: mailgunFrom,
            to: to,
            subject: subject,
            mode: "test"
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Préparer les données pour Mailgun
    const formData = new FormData();
    formData.append("from", mailgunFrom);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("text", text);
    if (html) {
      formData.append("html", html);
    }

    console.log("Envoi via Mailgun API...");
    console.log(`- Domaine: ${mailgunDomain}`);
    console.log(`- De: ${mailgunFrom}`);
    console.log(`- À: ${to}`);

    // Appel à l'API Mailgun
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

    const responseData = await response.text();
    console.log("Réponse Mailgun:", responseData);

    if (!response.ok) {
      throw new Error(`Erreur Mailgun: ${response.status} - ${responseData}`);
    }

    console.log(`Email envoyé avec succès via Mailgun à: ${to}`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Email envoyé avec succès",
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
