
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Clock, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

const PoliticalLaunchSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-coaching-50 to-coaching-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <CardTitle className="text-3xl font-bold text-coaching-800">
              Candidature envoyée avec succès !
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Votre demande a été reçue
              </h3>
              <p className="text-green-700">
                Nous avons bien reçu votre candidature pour le programme "Je me lance en politique". 
                Notre équipe va maintenant examiner votre dossier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800 mb-2">Email de confirmation</h4>
                <p className="text-blue-700 text-sm">
                  Vous recevrez un email de confirmation dès que votre demande sera validée par notre équipe.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold text-orange-800 mb-2">Délai de traitement</h4>
                <p className="text-orange-700 text-sm">
                  Nous vous contacterons dans les 48 heures suivant votre candidature.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Prochaines étapes :</h4>
              <ol className="text-left text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="bg-coaching-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  Analyse de votre candidature par notre équipe
                </li>
                <li className="flex items-start">
                  <span className="bg-coaching-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  Validation et envoi de l'email de confirmation
                </li>
                <li className="flex items-start">
                  <span className="bg-coaching-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  Prise de contact pour planifier votre accompagnement
                </li>
              </ol>
            </div>

            <div className="pt-6">
              <Button 
                onClick={() => navigate('/')}
                className="bg-coaching-600 hover:bg-coaching-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>

            <div className="text-sm text-gray-600 pt-4">
              <p>
                En cas de question, n'hésitez pas à nous contacter à{' '}
                <a href="mailto:contact@domconsulting.com" className="text-coaching-600 hover:underline">
                  contact@domconsulting.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliticalLaunchSuccess;
