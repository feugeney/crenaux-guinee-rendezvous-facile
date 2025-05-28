
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import BookingConfirmationCard from "@/components/booking/BookingConfirmationCard";
import BookingPriorityConfirmation from "@/components/booking/BookingPriorityConfirmation";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formData } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!formData) {
    navigate("/strategic-consultation");
    return null;
  }

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      // Different process for priority vs standard bookings
      if (formData.isPriority) {
        // For priority booking, store data and send confirmation email without payment
        toast({
          title: "Traitement de votre demande",
          description: "Veuillez patienter pendant que nous enregistrons votre demande..."
        });

        // Prepare the booking data with proper formatting
        const customerName = formData.fullName || `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
        const bookingDate = formData.date || new Date().toISOString().split('T')[0];
        const startTime = formData.time || '12:00:00';
        const endTime = formData.time 
          ? `${(parseInt(formData.time.split(':')[0]) + 1).toString().padStart(2, '0')}:${formData.time.split(':')[1]}:00`
          : '13:00:00';

        console.log('Preparing priority booking with data:', {
          topic: formData.topic || formData.consultationTopic || 'Bilan Stratégique',
          date: bookingDate,
          start_time: startTime,
          end_time: endTime,
          payment_status: 'pending',
          message: formData.questions || formData.whyDomani || formData.message || '',
          is_priority: true,
          email: formData.email,
          customer_name: customerName
        });

        // Store the booking in the database as pending priority booking
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            topic: formData.topic || formData.consultationTopic || 'Bilan Stratégique',
            date: bookingDate,
            start_time: startTime,
            end_time: endTime,
            payment_status: 'pending',
            message: formData.questions || formData.whyDomani || formData.message || '',
            is_priority: true,
            email: formData.email,
            customer_name: customerName,
            user_id: null // Pas d'utilisateur authentifié pour les réservations prioritaires
          })
          .select();

        if (bookingError) {
          console.error("Erreur lors de l'enregistrement de la réservation:", bookingError);
          throw new Error(`Erreur lors de l'enregistrement de la réservation: ${bookingError.message}`);
        }

        console.log("Réservation prioritaire enregistrée avec succès:", bookingData);

        // Store data in temp_bookings_data for future reference
        const { error: tempDataError } = await supabase.from('temp_bookings_data').insert({
          booking_data: formData
        });

        if (tempDataError) {
          console.error("Erreur lors de l'enregistrement des données temporaires:", tempDataError);
        }

        // Call the priority booking request function to send emails
        console.log("Calling priority-booking-request function...");
        const { data: emailData, error: emailError } = await supabase.functions.invoke("priority-booking-request", {
          body: { bookingData: formData }
        });

        if (emailError) {
          console.error("Erreur lors de l'envoi de l'e-mail de confirmation:", emailError);
          // Don't throw error here, booking is already saved
          toast({
            title: "Réservation enregistrée",
            description: "Votre demande prioritaire a été enregistrée, mais l'envoi de l'email de confirmation a échoué. Notre équipe vous contactera directement.",
            variant: "default",
          });
        } else {
          console.log("Email de confirmation envoyé avec succès:", emailData);
          toast({
            title: "Demande envoyée avec succès",
            description: "Votre demande prioritaire a été enregistrée. Vous recevrez une confirmation par email.",
            variant: "default",
          });
        }

        setSubmitted(true);
      } else {
        // Standard booking - proceed with payment as before
        toast({
          title: "Traitement de votre réservation",
          description: "Veuillez patienter pendant que nous préparons votre paiement..."
        });

        // Appel à la fonction Stripe pour créer une session de paiement
        const { data, error } = await supabase.functions.invoke("stripe-checkout", {
          body: {
            bookingData: formData,
            productPrice: 30000 // 300 $ standard
          }
        });

        if (error) {
          console.error("Erreur lors de la création de la session de paiement:", error);
          throw new Error("Une erreur est survenue lors de la création de la session de paiement");
        }

        if (data?.url) {
          // Rediriger vers Stripe Checkout
          window.location.href = data.url;
        } else {
          throw new Error("Une erreur est survenue. Veuillez réessayer.");
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de la confirmation de la réservation:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        {submitted ? "Demande envoyée" : "Confirmation de réservation"}
      </h1>

      {!submitted ? (
        <BookingConfirmationCard 
          formData={formData}
          isSubmitting={isSubmitting}
          onBack={() => navigate(-1)}
          onConfirm={handleConfirm}
        />
      ) : (
        <BookingPriorityConfirmation 
          formData={formData} 
          onBackToHome={() => navigate("/")} 
        />
      )}
    </div>
  );
};

export default BookingConfirmation;
