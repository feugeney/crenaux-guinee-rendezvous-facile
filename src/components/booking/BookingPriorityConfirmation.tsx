
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check } from "lucide-react";

interface BookingPriorityConfirmationProps {
  formData: any;
  onBackToHome: () => void;
}

const BookingPriorityConfirmation: React.FC<BookingPriorityConfirmationProps> = ({ formData, onBackToHome }) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Check className="h-6 w-6 text-green-600" />
          Votre demande prioritaire a été envoyée
        </CardTitle>
        <CardDescription>
          Nous avons bien reçu votre demande de rendez-vous prioritaire
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Demande enregistrée avec succès</AlertTitle>
          <AlertDescription className="text-green-700">
            Votre demande de rendez-vous prioritaire a été enregistrée. Notre équipe vous contactera dans les 
            plus brefs délais pour confirmer votre créneau.
          </AlertDescription>
        </Alert>
        
        <div className="bg-blue-50 p-4 border border-blue-100 rounded-md">
          <h3 className="font-medium text-blue-800">Prochaines étapes:</h3>
          <ol className="list-decimal list-inside mt-2 text-blue-700 space-y-1">
            <li>Notre équipe analysera votre demande</li>
            <li>Vous recevrez un email de confirmation avec un créneau proposé</li>
            <li>Un lien de paiement vous sera envoyé pour confirmer le rendez-vous</li>
          </ol>
        </div>
        
        <p className="text-gray-600">
          Un email de confirmation a été envoyé à <span className="font-medium">{formData.email}</span>.
          Si vous ne recevez pas cet email dans les prochaines minutes, veuillez vérifier votre dossier de spam.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onBackToHome} className="w-full">
          Retourner à l'accueil
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingPriorityConfirmation;
