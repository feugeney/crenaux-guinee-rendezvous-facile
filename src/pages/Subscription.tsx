import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      
      // Create booking data object with proper TimeSlot structure
      const bookingData = {
        firstName: values.firstName,
        lastName: values.lastName,
        fullName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        topic: 'monthly_subscription',
        message: 'Abonnement mensuel aux services de coaching',
        date: new Date().toISOString().split('T')[0],
        timeSlot: {
          id: 'subscription',
          day_of_week: 0,
          startTime: '00:00',
          endTime: '00:00',
          available: true
        },
        paymentStatus: 'pending',
        paymentMethod: 'stripe'
      };
      
      // Appel à la fonction Stripe pour créer une session de paiement
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          bookingData: bookingData,
          productPrice: 25000 // 250 $ pour l'abonnement mensuel
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
      console.error("Erreur lors de la souscription:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Abonnement mensuel
      </h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Devenir membre</CardTitle>
          <CardDescription>
            Abonnez-vous pour accéder à nos services de coaching premium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={handleChange}
                value={values.firstName}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={handleChange}
                value={values.lastName}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={handleChange}
              value={values.email}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={handleChange}
              value={values.phone}
              required
            />
          </div>
          <div className="bg-muted p-4 rounded-md mt-4">
            <h3 className="font-semibold text-lg mb-2">Avantages de l'abonnement</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Accès illimité aux séances de coaching</li>
              <li>Support personnalisé 24/7</li>
              <li>Contenu exclusif pour les membres</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isProcessing}
          >
            Retour
          </Button>
          <Button
            onClick={handleSubscribe}
            disabled={isProcessing}
          >
            {isProcessing ? "Traitement en cours..." : "S'abonner"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Subscription;
