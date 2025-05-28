
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from = "Dom Consulting <noreply.econtrib@gmail.com>" }: EmailRequest = await req.json();

    console.log(`Envoi d'email via Resend à: ${to}`);

    const emailResponse = await resend.emails.send({
      from: from,
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Email envoyé avec succès via Resend:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      id: emailResponse.data?.id,
      message: "Email envoyé avec succès" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi d'email avec Resend:", error);
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
