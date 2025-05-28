
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BookingData, PaymentMethod } from '@/types';
import { CreditCard as CreditCardIcon, Phone as PhoneIcon, Wallet, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface PaymentOptionsProps {
  bookingData: BookingData;
  onPaymentComplete: (method: PaymentMethod) => void;
  productPrice?: number; // Optional price for products
  isSubscription?: boolean; // Nouveau paramètre pour les abonnements
  subscriptionMonths?: number; // Durée de l'abonnement en mois
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  bookingData, 
  onPaymentComplete, 
  productPrice,
  isSubscription = false,
  subscriptionMonths = 3
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [mobileDetails, setMobileDetails] = useState({
    phoneNumber: '',
    otp: ''
  });
  const [step, setStep] = useState(1);

  // Use product price if provided, otherwise use default coaching price
  const price = productPrice ? productPrice : 50000;

  // Pour les abonnements, calculer le prix mensuel
  const monthlyPrice = isSubscription ? Math.round(price / subscriptionMonths) : price;

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleMobileDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMobileDetails({ ...mobileDetails, [name]: value });
  };

  // Fonction pour rediriger vers l'URL Stripe
  const redirectToStripe = (url: string) => {
    toast({
      title: "Redirection vers Stripe",
      description: "Vous allez être redirigé vers la page de paiement sécurisée Stripe.",
    });
    
    // Rediriger vers Stripe dans un nouvel onglet
    window.open(url, '_blank');
    
    // Simuler un succès de paiement après un court délai
    // Note: ceci est pour la démo - en production, on attendrait un callback de Stripe
    setTimeout(() => {
      onPaymentComplete('stripe');
      setIsProcessing(false);
    }, 1000);
  };

  // Handle Stripe payment using the Supabase Edge Function with enhanced redirection
  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      console.log("Initiation du processus de paiement Stripe");
      
      // Déterminer quelle fonction Edge appeler (abonnement ou paiement unique)
      const edgeFunction = isSubscription ? 'stripe-subscription' : 'stripe-checkout';
      
      try {
        console.log(`Appel de la fonction ${edgeFunction}`);
        const { data, error } = await supabase.functions.invoke(edgeFunction, {
          body: { 
            bookingData, 
            productPrice: price,
            subscriptionMonths: isSubscription ? subscriptionMonths : undefined
          }
        });

        if (error) {
          console.error(`Erreur avec la fonction Edge ${edgeFunction}:`, error);
          throw new Error(error.message || 'Erreur lors de la création de la session de paiement');
        }

        if (!data?.url) {
          throw new Error('Aucune URL de paiement retournée');
        }

        // Rediriger vers Stripe
        redirectToStripe(data.url);
        
      } catch (funcError) {
        console.error("Erreur avec l'Edge Function:", funcError);
        throw funcError;
      }
      
    } catch (err: any) {
      console.error("Erreur lors du paiement Stripe:", err);
      setIsProcessing(false);
      toast({
        title: "Erreur de paiement",
        description: err.message || "Une erreur s'est produite lors du traitement du paiement.",
        variant: "destructive"
      });
    }
  };

  const handleCardPayment = handleStripePayment; // Same implementation for card payments

  const handleMobileMoneyRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulation d'envoi OTP
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
      toast({
        title: "Code OTP envoyé",
        description: `Un code OTP a été envoyé au ${mobileDetails.phoneNumber}`,
      });
    }, 1500);
  };

  const handleMobileMoneyConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // For mobile money, we'd typically integrate with a local payment provider
    // but for now we'll simulate the process
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete('mobile_money');
      toast({
        title: "Paiement réussi",
        description: "Votre paiement par Mobile Money a été traité avec succès.",
      });
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-coaching-50 rounded-lg border border-coaching-100">
        <h3 className="font-medium mb-2 text-coaching-900">Récapitulatif</h3>
        <p className="text-sm text-gray-600">{bookingData.topic}</p>
        {bookingData.date && bookingData.timeSlot && bookingData.timeSlot.startTime && (
          <p className="text-sm text-gray-600">
            {bookingData.date}, {bookingData.timeSlot.startTime} - {bookingData.timeSlot.endTime}
          </p>
        )}
        
        {isSubscription ? (
          <div className="mt-2">
            <p className="text-sm font-semibold flex items-center gap-1 text-coaching-700">
              <Calendar size={16} /> Abonnement de {subscriptionMonths} mois
            </p>
            <p className="text-sm font-semibold">Total: {price.toLocaleString()} GNF</p>
            <p className="text-xs text-gray-600">({monthlyPrice.toLocaleString()} GNF/mois)</p>
          </div>
        ) : (
          <p className="text-sm font-semibold mt-2">Total à payer: {price.toLocaleString()} GNF</p>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Choisissez votre méthode de paiement</h3>
          
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={handlePaymentMethodChange}
            className="mb-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="visa" id="visa" />
              <Label htmlFor="visa" className="flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4" /> Carte Visa
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="mobile_money" id="mobile_money" />
              <Label htmlFor="mobile_money" className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" /> Mobile Money Guinée
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" /> Stripe (Cartes internationales)
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === 'visa' && (
            <form onSubmit={handleCardPayment} className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardHolder">Titulaire de la carte</Label>
                <Input
                  id="cardHolder"
                  name="cardHolder"
                  placeholder="JOHN DOE"
                  value={cardDetails.cardHolder}
                  onChange={handleCardDetailsChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Date d'expiration</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-coaching-600 hover:bg-coaching-700"
                disabled={isProcessing}
              >
                {isProcessing ? "Traitement en cours..." : isSubscription 
                  ? `Souscrire pour ${monthlyPrice.toLocaleString()} GNF/mois` 
                  : `Payer ${price.toLocaleString()} GNF`
                }
              </Button>
            </form>
          )}

          {paymentMethod === 'mobile_money' && step === 1 && (
            <form onSubmit={handleMobileMoneyRequestOTP} className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">Numéro de téléphone (Orange Money, MTN Mobile Money)</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+224 XX XX XX XX"
                  value={mobileDetails.phoneNumber}
                  onChange={handleMobileDetailsChange}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-coaching-600 hover:bg-coaching-700"
                disabled={isProcessing}
              >
                {isProcessing ? "Envoi en cours..." : "Recevoir le code OTP"}
              </Button>
            </form>
          )}

          {paymentMethod === 'mobile_money' && step === 2 && (
            <form onSubmit={handleMobileMoneyConfirmPayment} className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Un code OTP a été envoyé au numéro {mobileDetails.phoneNumber}
              </p>
              <div>
                <Label htmlFor="otp">Code OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  placeholder="Entrez le code OTP"
                  value={mobileDetails.otp}
                  onChange={handleMobileDetailsChange}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-coaching-600 hover:bg-coaching-700"
                disabled={isProcessing}
              >
                {isProcessing ? "Traitement en cours..." : isSubscription 
                  ? `Confirmer l'abonnement (${monthlyPrice.toLocaleString()} GNF/mois)`
                  : "Confirmer le paiement"
                }
              </Button>
            </form>
          )}

          {paymentMethod === 'stripe' && (
            <form onSubmit={handleStripePayment} className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                <h4 className="font-medium mb-2 text-blue-800">
                  {isSubscription ? "Abonnement via Stripe" : "Paiement par Stripe"}
                </h4>
                <p className="text-sm text-blue-700">
                  Stripe est une solution de paiement sécurisée qui vous permet de payer avec n'importe quelle carte de crédit ou débit internationale.
                  {isSubscription && " Votre abonnement sera renouvelé automatiquement chaque mois."}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                En cliquant sur le bouton ci-dessous, vous serez redirigé vers la page de paiement sécurisée de Stripe dans un nouvel onglet.
              </p>
              <Button 
                type="submit" 
                className="w-full bg-coaching-600 hover:bg-coaching-700"
                disabled={isProcessing}
              >
                {isProcessing ? "Redirection en cours..." : isSubscription 
                  ? `Souscrire pour ${monthlyPrice.toLocaleString()} GNF/mois` 
                  : `Procéder au paiement de ${price.toLocaleString()} GNF`
                }
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOptions;
