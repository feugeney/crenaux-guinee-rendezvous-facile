
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PoliticalLaunchSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const sessionId = searchParams.get('session_id');
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    if (sessionId && paymentStatus === 'success') {
      verifyPayment();
    } else {
      setVerificationStatus('error');
    }
  }, [sessionId, paymentStatus]);

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-political-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data.success && data.status === 'paid') {
        setVerificationStatus('success');
        toast.success('Paiement confirmé avec succès !');
      } else {
        setVerificationStatus('error');
        toast.error('Erreur lors de la confirmation du paiement');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
      setVerificationStatus('error');
      toast.error('Erreur lors de la vérification du paiement');
    }
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Vérification du paiement...</h2>
            <p className="text-gray-600">Veuillez patienter pendant que nous confirmons votre paiement.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">✗</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">Erreur de paiement</h2>
            <p className="text-red-600 mb-6">
              Une erreur s'est produite lors de la confirmation de votre paiement.
            </p>
            <Link to="/political-launch">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au formulaire
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* En-tête de succès */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-4">
                🎉 Paiement Confirmé !
              </h1>
              <p className="text-lg text-green-700 mb-4">
                Félicitations ! Votre inscription au programme d'accompagnement politique a été confirmée.
              </p>
              <div className="bg-white rounded-lg p-4 inline-block">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-semibold">Paiement traité avec succès</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prochaines étapes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Prochaines étapes
              </CardTitle>
              <CardDescription>
                Voici ce qui va se passer maintenant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-blue-800">Confirmation par email</h3>
                  <p className="text-blue-700">
                    Vous recevrez un email de confirmation avec tous les détails de votre programme et le planning des séances.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-purple-800">Contact de notre équipe</h3>
                  <p className="text-purple-700">
                    Notre équipe vous contactera dans les 24h pour finaliser les détails et répondre à vos questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-green-800">Début du programme</h3>
                  <p className="text-green-700">
                    Votre programme commencera selon le planning établi avec 6 séances intensives suivies de 2 semaines de suivi post-coaching.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations importantes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Informations importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">📧 Vérifiez vos emails</h4>
                <p className="text-yellow-700">
                  Assurez-vous de vérifier votre boîte de réception (et le dossier spam) pour l'email de confirmation.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📱 Gardez vos coordonnées à jour</h4>
                <p className="text-blue-700">
                  Notre équipe utilisera les coordonnées fournies lors de votre candidature pour vous contacter.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Préparez-vous</h4>
                <p className="text-green-700">
                  Commencez à réfléchir à vos objectifs politiques et aux questions que vous aimeriez aborder.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center space-y-4">
            <Link to="/">
              <Button size="lg" className="px-8">
                Retour à l'accueil
              </Button>
            </Link>
            
            <div className="text-sm text-gray-600">
              <p>Des questions ? Contactez-nous à <a href="mailto:contact@domconsulting.com" className="text-blue-600 hover:underline">contact@domconsulting.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticalLaunchSuccess;
