
import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator = ({ message = "Traitement de votre réservation..." }: LoadingIndicatorProps) => {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
