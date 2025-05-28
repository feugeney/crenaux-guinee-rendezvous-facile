
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from, text }: EmailRequest = await req.json();

    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY");
    const mailgunDomain = Deno.env.get("MAILGUN_DOMAIN");
    const mailgunFrom = from || Deno.env.get("MAILGUN_FROM") || "DomConsulting <noreply@sandbox1234567890.mailgun.org>";

    if (!mailgunApiKey || !mailgunDomain) {
      throw new Error("Configuration Mailgun manquante");
    }

    console.log(`Envoi d'email via Mailgun à: ${to}`);

    // Préparer les données du formulaire pour Mailgun
    const formData = new FormData();
    formData.append("from", mailgunFrom);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("html", html);
    
    if (text) {
      formData.append("text", text);
    }

    // Appel à l'API Mailgun
    const mailgunUrl = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;
    
    const response = await fetch(mailgunUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`api:${mailgunApiKey}`)}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Mailgun:", errorText);
      throw new Error(`Erreur Mailgun: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Email envoyé avec succès via Mailgun:", result);

    return new Response(JSON.stringify({ 
      success: true, 
      id: result.id,
      message: "Email envoyé avec succès via Mailgun" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi d'email avec Mailgun:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Erreur lors de l'envoi de l'email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
