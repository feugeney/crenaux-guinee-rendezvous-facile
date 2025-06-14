
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TimeSlot, BookingData } from '@/types';
import PaymentOptions from '@/components/PaymentOptions';
import BookingSummary from '@/components/booking/BookingSummary';
import BookingHeader from '@/components/booking/BookingHeader';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formData } = location.state || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'visa' | 'mobile_money' | 'stripe'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.get('timeSlot')) {
      const timeSlotData = JSON.parse(decodeURIComponent(params.get('timeSlot')!));
      const reconstructedTimeSlot: TimeSlot = {
        id: timeSlotData.id,
        day_of_week: timeSlotData.day_of_week,
        start_time: timeSlotData.start_time,
        end_time: timeSlotData.end_time,
        available: timeSlotData.available,
        is_recurring: timeSlotData.is_recurring,
        specific_date: timeSlotData.specific_date,
        created_at: timeSlotData.created_at || "",
        updated_at: timeSlotData.updated_at || ""
      };
      setTimeSlot(reconstructedTimeSlot);
    }

    if (!formData) {
      navigate("/strategic-consultation");
    }
  }, [formData, navigate, location]);

  if (!formData) {
    return null;
  }

  const processBooking = async () => {
    try {
      setIsProcessing(true);

      // Create a properly formatted BookingData object 
      const bookingData: BookingData = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        fullName: formData.fullName || `${formData.firstName} ${formData.lastName}`,
        email: formData.email || '',
        phone: formData.phone || '',
        date: formData.date || '',
        timeSlot: {
          id: formData.timeSlot?.id || '',
          day_of_week: formData.timeSlot?.day_of_week || 0,
          start_time: formData.timeSlot?.start_time || '',
          end_time: formData.timeSlot?.end_time || '',
          available: formData.timeSlot?.available || true,
          is_recurring: formData.timeSlot?.is_recurring || false,
          created_at: formData.timeSlot?.created_at || '',
          updated_at: formData.timeSlot?.updated_at || ''
        },
        topic: formData.topic || '',
        message: formData.message || '',
        notes: formData.notes || '',
        paymentStatus: 'pending',
        paymentMethod: selectedPaymentMethod
      };

      toast({
        title: "Traitement de votre réservation",
        description: "Veuillez patienter pendant que nous préparons votre paiement..."
      });

      // Appel à la fonction Stripe pour créer une session de paiement
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          bookingData: bookingData,
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
    } catch (error: any) {
      console.error("Erreur lors de la confirmation de la réservation:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-center mb-8">Paiement</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Choisissez votre méthode de paiement</CardTitle>
          <CardDescription>
            Sélectionnez la méthode de paiement que vous souhaitez utiliser pour finaliser votre réservation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="border rounded-md p-4 flex items-center space-x-4">
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="stripe"
                className="h-4 w-4"
                checked={selectedPaymentMethod === 'stripe'}
                onChange={() => setSelectedPaymentMethod('stripe')}
              />
              <label htmlFor="stripe" className="text-sm font-medium leading-none">
                Carte de crédit / Stripe
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={processBooking} disabled={isProcessing}>
            {isProcessing ? "Traitement en cours..." : "Payer avec Stripe"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;
