
import React from "react";
import { CheckCircle } from "lucide-react";

const SuccessHeader = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
      <div>
        <h3 className="text-green-800 font-medium text-lg">Paiement réussi</h3>
        <p className="text-green-700">
          Votre séance a été réservée avec succès.
        </p>
      </div>
    </div>
  );
};

export default SuccessHeader;
