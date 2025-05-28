
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for email request
interface EmailRequest {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

// Main function
serve(async (req: Request) => {
  // Handle OPTIONS requests (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("Headers de la requête:", Object.fromEntries(req.headers.entries()));

  // Vérifier l'autorisation
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.error("Erreur d'autorisation: En-tête d'autorisation manquant");
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Missing authorization header",
      }),
      {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    console.log("Initialisation de la fonction d'envoi d'email...");

    // Configure SMTP client with updated client
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 587,
        tls: false,
        auth: {
          username: Deno.env.get("EMAIL_USER") || "noreply.econtrib@gmail.com",
          password: Deno.env.get("EMAIL_PASS") || "gguj zspv gxnr khyq",
        },
      },
    });

    // Check that the request is a POST method
    if (req.method !== "POST") {
      console.error("Méthode non autorisée:", req.method);
      return new Response(
        JSON.stringify({ success: false, error: "Method Not Allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get and validate request body
    let requestData: EmailRequest;
    try {
      requestData = await req.json();
      console.log("Données de la requête:", JSON.stringify(requestData));
    } catch (jsonError) {
      console.error("Erreur de parsing JSON:", jsonError);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    if (!requestData.to) {
      console.error("Aucune adresse email de destination spécifiée");
      return new Response(
        JSON.stringify({ success: false, error: "Recipient address is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log the request for debugging
    console.log(`Préparation pour envoyer un email à: ${requestData.to}`);
    console.log(`Sujet: ${requestData.subject || "No subject"}`);

    // Prepare email with simpler structure
    const sendConfig = {
      from: requestData.from || "Dom Consulting <noreply.econtrib@gmail.com>",
      to: requestData.to,
      subject: requestData.subject || "Dom Consulting - Notification",
      html: requestData.html,
    };

    console.log(`Tentative d'envoi d'email à: ${requestData.to}`);

    // Send email with improved error handling
    try {
      await client.send(sendConfig);
      console.log(`Email envoyé avec succès à: ${requestData.to}`);
      
      // Always try to close the client connection
      try {
        await client.close();
        console.log("Connexion SMTP fermée");
      } catch (closeError) {
        console.error("Erreur lors de la fermeture de la connexion SMTP:", closeError);
      }
      
      // Return success response
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Email successfully sent to ${requestData.to}` 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (smtpError) {
      console.error("Erreur SMTP lors de l'envoi:", smtpError);
      
      // Always try to close the client connection
      try {
        await client.close();
        console.log("Connexion SMTP fermée");
      } catch (closeError) {
        console.error("Erreur lors de la fermeture de la connexion SMTP:", closeError);
      }
      
      // Throw error to be caught by outer try/catch
      throw new Error(`Erreur SMTP: ${smtpError.message}`);
    }

  } catch (error) {
    console.error("Erreur complète lors de l'envoi de l'email:", error);
    
    // Return detailed error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while sending the email",
        stack: error.stack, // Include stack trace for debugging
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
