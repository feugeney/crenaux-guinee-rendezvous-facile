import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

// File d'attente avec système de retry
const emailQueue: {payload: EmailPayload, retries: number, lastRetry?: number}[] = [];
let isProcessingQueue = false;
const minIntervalMs = 20 * 1000; // 20 secondes entre les envois
const maxRetries = 3;

// Fonction pour traiter la file d'attente de manière asynchrone
async function processEmailQueue(supabase: any) {
  if (isProcessingQueue || emailQueue.length === 0) return;
  
  isProcessingQueue = true;
  console.log(`Traitement de la file d'attente d'emails: ${emailQueue.length} emails en attente`);
  
  // Get the next email in the queue
  const emailTask = emailQueue[0];
  
  // Check if we need to wait more due to previous retry
  if (emailTask.lastRetry && Date.now() - emailTask.lastRetry < minIntervalMs * 2) {
    console.log("En attente avant la prochaine tentative...");
    setTimeout(() => {
      isProcessingQueue = false;
      processEmailQueue(supabase);
    }, minIntervalMs);
    return;
  }
  
  try {
    console.log(`Envoi d'email à ${emailTask.payload.to} (tentative ${emailTask.retries + 1}/${maxRetries + 1})`);
    
    const { error } = await supabase.auth.admin.sendEmail(
      emailTask.payload.to,
      {
        subject: emailTask.payload.subject,
        html: emailTask.payload.html,
        replyTo: emailTask.payload.replyTo,
        cc: emailTask.payload.cc,
        bcc: emailTask.payload.bcc,
      }
    );

    if (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      
      // Retry logic
      if (emailTask.retries < maxRetries) {
        emailTask.retries++;
        emailTask.lastRetry = Date.now();
        console.log(`Réessai programmé (${emailTask.retries}/${maxRetries})`);
        // Keep the task in the queue for retry
      } else {
        console.error(`Échec après ${maxRetries + 1} tentatives pour ${emailTask.payload.to}`);
        // Remove from queue after max retries
        emailQueue.shift();
        
        // Log to database for monitoring
        await supabase.from('failed_emails').insert({
          recipient: emailTask.payload.to,
          subject: emailTask.payload.subject,
          error_message: error.message
        }).catch(err => console.error("Impossible d'enregistrer l'échec de l'email:", err));
      }
    } else {
      console.log("Email envoyé avec succès");
      // Remove from queue after success
      emailQueue.shift();
    }
  } catch (error) {
    console.error("Erreur lors du traitement de la file d'attente:", error);
    // In case of exception, increment retry counter
    if (emailTask.retries < maxRetries) {
      emailTask.retries++;
      emailTask.lastRetry = Date.now();
    } else {
      // Remove after max retries
      emailQueue.shift();
    }
  }
  
  // Schedule next processing
  setTimeout(() => {
    isProcessingQueue = false;
    if (emailQueue.length > 0) {
      processEmailQueue(supabase);
    }
  }, minIntervalMs);
}

serve(async (req) => {
  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role to send emails
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const payload: EmailPayload = await req.json();
    
    if (!payload.to || !payload.subject || !payload.html) {
      throw new Error("Missing required email fields");
    }

    console.log(`Ajout d'un email pour ${payload.to} à la file d'attente`);
    
    // Ajouter l'email à la file d'attente avec compteur d'essais
    emailQueue.push({ payload, retries: 0 });
    
    // Démarrer le traitement de la file d'attente si ce n'est pas déjà en cours
    if (!isProcessingQueue) {
      processEmailQueue(supabase);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email ajouté à la file d'attente, sera envoyé sous peu",
        queueLength: emailQueue.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
