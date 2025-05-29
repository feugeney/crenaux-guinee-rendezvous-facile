
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import BookingSuccessContent from "@/components/booking/BookingSuccessContent";
import { useToast } from "@/hooks/use-toast";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<boolean | string>(false);

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (!sessionId) {
          toast({
            title: "Erreur",
            description: "Aucun identifiant de session trouvé",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        const { data: tempData } = await supabase
          .from("temp_bookings_data")
          .select("*")
          .eq("stripe_session_id", sessionId)
          .single();

        if (tempData) {
          const bookingInfo = tempData.booking_data;
          setBookingDetails({
            date: bookingInfo.date,
            start_time: bookingInfo.time || bookingInfo.timeSlot?.startTime,
            end_time:
              bookingInfo.timeSlot?.endTime ||
              (bookingInfo.time
                ? `${parseInt(bookingInfo.time.split(":")[0]) + 1}:00:00`
                : ""),
            is_priority: bookingInfo.isPriority,
            topic: bookingInfo.topic || bookingInfo.consultationTopic,
            email: bookingInfo.email,
            fullName:
              bookingInfo.fullName ||
              `${bookingInfo.firstName || ""} ${bookingInfo.lastName || ""}`.trim(),
          });
        }

        const { data: bookingData } = await supabase
          .from("bookings")
          .select(
            `
            *,
            profiles (
              email,
              full_name
            )
          `
          )
          .eq("stripe_session_id", sessionId)
          .maybeSingle();

        if (bookingData) {
          setBookingDetails({
            ...bookingData,
            email: bookingData.profiles?.email || bookingData.email,
            fullName:
              bookingData.profiles?.full_name || bookingData.full_name,
          });
        } else if (!tempData) {
          throw new Error("Impossible de trouver les détails de votre réservation");
        }

        const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
          "verify-payment",
          {
            body: { sessionId },
          }
        );

        if (paymentError) {
          throw new Error("Erreur lors de la vérification du paiement");
        }

        if (paymentData.status === "complete" || paymentData.status === "paid") {
          if (bookingData) {
            await supabase
              .from("bookings")
              .update({ payment_status: "paid" })
              .eq("stripe_session_id", sessionId);
          }

          try {
            await handleSendConfirmationEmail();
          } catch (emailError) {
            setEmailError(
              typeof emailError === "string" ? emailError : "Erreur lors de l'envoi de l'email"
            );
          }
        }

        setIsLoading(false);
      } catch (error: any) {
        toast({
          title: "Erreur",
          description:
            error.message || "Une erreur est survenue lors de la récupération de la réservation",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [sessionId, navigate, toast]);

  const handleSendConfirmationEmail = async () => {
    try {
      const email = bookingDetails?.email;
      const name = bookingDetails?.fullName;
      
      if (!email) throw new Error("Email manquant");

      console.log("Envoi d'email de confirmation via Supabase function...");

      // Utiliser la fonction Supabase pour envoyer l'email via Mailgun
      const { data, error } = await supabase.functions.invoke("send-mailgun-email", {
        body: {
          to: email,
          subject: "Confirmation de votre réservation - Dom Consulting",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9fafb; }
                .details { background-color: #f0f4ff; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Réservation Confirmée</h1>
                </div>
                <div class="content">
                  <p>Bonjour ${name},</p>
                  <p>Nous vous confirmons que votre réservation a été effectuée avec succès.</p>
                  
                  <div class="details">
                    <h3>Détails de votre réservation:</h3>
                    <ul>
                      <li><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString('fr-FR')}</li>
                      <li><strong>Heure:</strong> ${bookingDetails.start_time} - ${bookingDetails.end_time}</li>
                      <li><strong>Sujet:</strong> ${bookingDetails.topic}</li>
                    </ul>
                  </div>
                  
                  <p>Merci de votre confiance. Nous avons hâte de vous rencontrer.</p>
                  <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                </div>
                <div class="footer">
                  <p>L'équipe Dom Consulting</p>
                  <p>WhatsApp: +224 610 73 08 69</p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
Bonjour ${name},

Nous vous confirmons que votre réservation a été effectuée avec succès.

Détails de votre réservation:
- Date: ${new Date(bookingDetails.date).toLocaleDateString('fr-FR')}
- Heure: ${bookingDetails.start_time} - ${bookingDetails.end_time}
- Sujet: ${bookingDetails.topic}

Merci de votre confiance. Nous avons hâte de vous rencontrer.
Si vous avez des questions, n'hésitez pas à nous contacter.

L'équipe Dom Consulting
WhatsApp: +224 610 73 08 69
          `
        }
      });

      if (error) {
        console.error("Erreur de la fonction Supabase:", error);
        throw new Error(`Erreur lors de l'envoi: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Échec de l'envoi de l'email");
      }

      console.log("Email envoyé avec succès via Mailgun");
      
      toast({
        title: "Email envoyé",
        description: `La confirmation a été envoyée à ${email}`,
      });

      setEmailSent(true);
      setEmailError(false);
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      setEmailError(error.message || "Erreur lors de l'envoi de l'email");
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer l'email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleResendEmail = async () => {
    try {
      setIsLoading(true);
      await handleSendConfirmationEmail();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Réservation Confirmée</h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <BookingSuccessContent
            isLoading={isLoading}
            bookingDetails={bookingDetails}
            emailSent={emailSent}
            emailError={emailError}
            handleResendEmail={handleResendEmail}
            onReturnHome={() => navigate("/")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccess;
