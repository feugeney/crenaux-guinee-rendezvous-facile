import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookingData } from '@/types';
import { supabase } from '@/lib/supabase';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formData } = location.state || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'visa' | 'mobile_money' | 'stripe'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!formData) {
      navigate("/strategic-consultation");
    }
  }, [formData, navigate]);

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
          startTime: formData.timeSlot?.startTime || '',
          endTime: formData.timeSlot?.endTime || '',
          available: formData.timeSlot?.available || true
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
