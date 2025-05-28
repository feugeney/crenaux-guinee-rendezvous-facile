
import React from "react";

interface BookingImportantInfoProps {
  isPriority: boolean;
}

const BookingImportantInfo: React.FC<BookingImportantInfoProps> = ({ isPriority }) => {
  return (
    <div className="bg-muted p-4 rounded-md mt-4">
      <h3 className="font-semibold text-lg mb-2">Important</h3>
      {isPriority ? (
        <p>
          En soumettant cette demande, vous demandez un rendez-vous prioritaire qui sera traité dans les 48h.
          Notre équipe vous contactera pour confirmer votre créneau et vous envoyer un lien de paiement.
        </p>
      ) : (
        <p>
          En confirmant cette réservation, vous acceptez nos conditions générales de service. 
          Le paiement sera traité de manière sécurisée par Stripe.
        </p>
      )}
    </div>
  );
};

export default BookingImportantInfo;
