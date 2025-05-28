
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertTriangle, Loader, RefreshCw } from "lucide-react";

interface EmailConfirmationProps {
  email: string;
  emailSent: boolean;
  emailError: boolean | string;
  isLoading: boolean;
  onResend: () => void;
}

const EmailConfirmation = ({
  email,
  emailSent,
  emailError,
  isLoading,
  onResend
}: EmailConfirmationProps) => {
  // Déterminer le message d'erreur à afficher
  const errorMessage = typeof emailError === 'string' 
    ? emailError 
    : "L'envoi de l'email de confirmation n'a pas pu être effectué, mais votre réservation est bien enregistrée.";

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <Loader className="h-6 w-6 text-blue-600 mt-0.5 mr-2 flex-shrink-0 animate-spin" />
        <div>
          <h3 className="text-blue-800 font-medium text-lg">Envoi de l'email en cours</h3>
          <p className="text-blue-700">
            Nous envoyons un email de confirmation à <span className="font-medium">{email}</span>.
            Cela peut prendre quelques instants...
          </p>
        </div>
      </div>
    );
  }
  
  if (emailSent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
        <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="text-green-800 font-medium text-lg">Email de confirmation envoyé</h3>
          <p className="text-green-700">
            Un email de confirmation a été envoyé à <span className="font-medium">{email}</span>.
            Veuillez vérifier votre boîte de réception et vos spams.
          </p>
          <p className="text-green-600 text-sm mt-2">
            ✅ Email envoyé uniquement au client (système Mailgun configuré)
          </p>
        </div>
      </div>
    );
  }

  if (emailError) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="text-yellow-800 font-medium text-lg">Email non envoyé</h3>
          <p className="text-yellow-700 mb-3">
            {errorMessage}
          </p>
          <Button 
            onClick={onResend} 
            variant="outline" 
            className="bg-yellow-100 border-yellow-300 hover:bg-yellow-200 text-yellow-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer d'envoyer l'email
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default EmailConfirmation;
