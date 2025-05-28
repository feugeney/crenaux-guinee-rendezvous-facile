
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  type: string;
  recipient_email: string;
  sender_email: string;
  subject: string;
  content: string;
  metadata?: Record<string, any>;
  send_email?: boolean; // Optional flag to send email
}

const handler = async (req: Request): Promise<Response> => {
  // Handle OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: NotificationPayload = await req.json();
    
    // Validate required fields
    if (!payload.type || !payload.recipient_email || !payload.subject || !payload.content) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: type, recipient_email, subject, content" 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Create notification in database
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        type: payload.type,
        recipient_email: payload.recipient_email,
        sender_email: payload.sender_email || "noreply@domconsulting.com",
        subject: payload.subject,
        content: payload.content,
        metadata: payload.metadata || {},
        read: false,
        sent: false, // Initially set to false
      })
      .select();

    if (error) {
      console.error("Error creating notification:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // If send_email flag is true, send the email via send-email function
    if (payload.send_email && data && data[0]) {
      try {
        const notificationId = data[0].id;
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4f46e5; color: white; padding: 15px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>${payload.subject}</h2>
    </div>
    <div class="content">
      ${payload.content.split('\n').map(line => `<p>${line}</p>`).join('')}
    </div>
    <div class="footer">
      <p>L'équipe Dom Consulting</p>
    </div>
  </div>
</body>
</html>`;

        // Send email using the send-email function
        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            to: payload.recipient_email,
            subject: payload.subject,
            html: emailHtml
          })
        });
        
        const emailResult = await emailResponse.json();
        
        if (emailResponse.ok) {
          // Update notification as sent
          await supabase
            .from('notifications')
            .update({ sent: true })
            .eq('id', notificationId);
          
          console.log("Email sent successfully and notification updated");
        } else {
          console.error("Error sending email:", emailResult);
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Continue even if email sending fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification successfully created", 
        notification: data[0] 
      }),
      { status: 201, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in create-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
