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
      alert(email)
      
      const name = bookingDetails?.fullName;
      const amount = "29.99"; // À adapter selon ta logique
      const orderId = sessionId || "N/A";
      if (!email) throw new Error("Email ou nom manquant");

      const res = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, amount, orderId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Échec de l'envoi de l'email");
      }

      toast({
        title: "Email envoyé",
        description: `La confirmation a été envoyée à ${email}`,
    
      });

      setEmailSent(true);
      setEmailError(false);
    } catch (error: any) {
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
