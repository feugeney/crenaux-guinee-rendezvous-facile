
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle OPTIONS requests (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Extract email from URL query params or use default
  const url = new URL(req.url);
  const to = url.searchParams.get("email") || "votre-email@example.com";

  console.log(`Test d'envoi d'email à: ${to}`);
  console.log(`Headers de la requête:`, Object.fromEntries(req.headers.entries()));

  try {
    // Configure SMTP client with updated import
    const client = new SmtpClient({
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

    // Prepare test email
    const sendConfig = {
      from: "Dom Consulting <noreply.econtrib@gmail.com>",
      to: to,
      subject: "Test SMTP - Dom Consulting",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6A0DAD; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Test SMTP</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Ceci est un email de test pour vérifier la configuration SMTP.</p>
              <p>Si vous recevez cet email, la configuration est correcte!</p>
              <p>Date et heure de test: ${new Date().toLocaleString()}</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Dom Consulting. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log("Tentative d'envoi d'email de test...");

    // Send test email
    try {
      await client.send(sendConfig);
      console.log(`Email de test envoyé avec succès à: ${to}`);
    } catch (smtpError) {
      console.error("Erreur SMTP détaillée:", smtpError);
      throw new Error(`Erreur SMTP: ${smtpError.message}`);
    } finally {
      try {
        await client.close();
        console.log("Connexion SMTP fermée");
      } catch (closeError) {
        console.error("Erreur lors de la fermeture de la connexion SMTP:", closeError);
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email de test envoyé avec succès à ${to}`,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Erreur complète lors de l'envoi de l'email de test:", error);
    
    // Return detailed error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Une erreur est survenue lors de l'envoi de l'email de test",
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
