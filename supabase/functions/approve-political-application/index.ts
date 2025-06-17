
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalRequest {
  applicationId: string;
  proposedSchedule: {
    sessions: Array<{
      session_number: number;
      date: string;
      start_time: string;
      end_time: string;
      topic: string;
    }>;
    followUpSessions: Array<{
      session_number: number;
      date: string;
      start_time: string;
      end_time: string;
      topic: string;
    }>;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { applicationId, proposedSchedule }: ApprovalRequest = await req.json();

    // Récupérer les détails de la candidature
    const { data: application, error: appError } = await supabase
      .from('political_launch_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      throw new Error('Candidature non trouvée');
    }

    // Calculer le prix selon l'option de paiement
    const price = application.payment_option === 'full' ? 600 : 250;

    // Initialiser Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Créer ou récupérer le client Stripe
    let customerId;
    const customers = await stripe.customers.list({ email: application.email, limit: 1 });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: application.email,
        name: application.full_name,
        phone: application.phone,
      });
      customerId = newCustomer.id;
    }

    // Créer le lien de paiement Stripe avec URL de retour
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    let paymentLink;

    if (application.payment_option === 'full') {
      // Paiement complet
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Programme d'accompagnement politique",
              description: "Programme complet de 6 séances + 2 semaines de suivi",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${origin}/political-launch-success?session_id={CHECKOUT_SESSION_ID}&payment=success`,
        cancel_url: `${origin}/political-launch?canceled=true`,
        metadata: {
          application_id: applicationId,
          program_type: 'political_coaching',
        }
      });
      paymentLink = session.url;
    } else {
      // Paiement mensuel
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: "Programme d'accompagnement politique - Mensuel",
              description: "Paiement mensuel pour le programme politique",
            },
            unit_amount: price * 100,
            recurring: { interval: "month" },
          },
          quantity: 1,
        }],
        mode: "subscription",
        success_url: `${origin}/political-launch-success?session_id={CHECKOUT_SESSION_ID}&payment=success`,
        cancel_url: `${origin}/political-launch?canceled=true`,
        metadata: {
          application_id: applicationId,
          program_type: 'political_coaching',
        }
      });
      paymentLink = session.url;
    }

    // Mettre à jour la candidature avec statut "approved" et "en attente de paiement"
    const { error: updateError } = await supabase
      .from('political_launch_applications')
      .update({
        status: 'approved',
        proposed_schedule: proposedSchedule,
        schedule_validated: true,
        payment_link: paymentLink,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (updateError) {
      throw new Error('Erreur lors de la mise à jour de la candidature');
    }

    // Préparer le contenu de l'email
    const sessionsHtml = proposedSchedule.sessions.map(session => 
      `<li>Séance intensive ${session.session_number}: ${new Date(session.date).toLocaleDateString('fr-FR')} de ${session.start_time} à ${session.end_time} - ${session.topic}</li>`
    ).join('');

    const followUpHtml = proposedSchedule.followUpSessions.map(session => 
      `<li>Suivi post-coaching ${session.session_number}: ${new Date(session.date).toLocaleDateString('fr-FR')} de ${session.start_time} à ${session.end_time} - ${session.topic}</li>`
    ).join('');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .schedule { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
    .payment-button { 
      display: inline-block; 
      background-color: #10b981; 
      color: white; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 5px; 
      margin: 20px 0;
      font-weight: bold;
    }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Candidature Approuvée !</h1>
    </div>
    <div class="content">
      <h2>Félicitations ${application.full_name} !</h2>
      <p>Votre candidature pour le programme d'accompagnement politique a été approuvée. Nous sommes ravis de vous accompagner dans votre parcours politique.</p>
      
      <div class="schedule">
        <h3>📅 Planning des 6 séances intensives :</h3>
        <ul>${sessionsHtml}</ul>
      </div>
      
      <div class="schedule">
        <h3>📞 Séances de suivi post-coaching (2 semaines) :</h3>
        <ul>${followUpHtml}</ul>
      </div>
      
      <h3>💳 Finaliser votre inscription</h3>
      <p>Pour confirmer votre place et commencer le programme, veuillez procéder au paiement :</p>
      <p><strong>Option choisie :</strong> ${application.payment_option === 'full' ? 'Paiement complet (600 USD)' : 'Paiement mensuel (250 USD/mois)'}</p>
      
      <div style="text-align: center;">
        <a href="${paymentLink}" class="payment-button">
          Procéder au paiement
        </a>
      </div>
      
      <p><strong>Important :</strong> Votre place sera réservée dès validation du paiement. Les séances se dérouleront selon le planning ci-dessus.</p>
      
      <h3>📋 Détails de votre candidature :</h3>
      <ul>
        <li><strong>Profil :</strong> ${application.professional_profile}</li>
        <li><strong>Sujet d'intérêt :</strong> ${application.preferred_topic}</li>
        <li><strong>Période de début :</strong> ${application.start_period}</li>
      </ul>
    </div>
    <div class="footer">
      <p>L'équipe Dom Consulting</p>
      <p>Pour toute question, n'hésitez pas à nous contacter.</p>
    </div>
  </div>
</body>
</html>`;

    // Envoyer l'email de confirmation
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-resend-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`
      },
      body: JSON.stringify({
        to: application.email,
        subject: "🎉 Candidature approuvée - Programme d'accompagnement politique",
        html: emailHtml
      })
    });

    const emailResult = await emailResponse.json();
    console.log("Email envoyé:", emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Candidature approuvée et email envoyé. En attente de paiement.",
        payment_link: paymentLink
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Erreur lors de l'approbation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
