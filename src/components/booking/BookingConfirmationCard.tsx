
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookingSummary from "./BookingSummary";
import BookingImportantInfo from "./BookingImportantInfo";

interface BookingConfirmationCardProps {
  formData: any;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

const BookingConfirmationCard: React.FC<BookingConfirmationCardProps> = ({
  formData,
  isSubmitting,
  onBack,
  onConfirm
}) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Résumé de votre réservation</CardTitle>
        <CardDescription>
          {formData.isPriority 
            ? "Veuillez vérifier les détails de votre demande prioritaire avant de la soumettre" 
            : "Veuillez vérifier les détails de votre réservation avant de procéder au paiement"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <BookingSummary formData={formData} />
        <BookingImportantInfo isPriority={formData.isPriority} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Retour
        </Button>
        <Button 
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Traitement en cours..." : formData.isPriority 
            ? "Soumettre ma demande" 
            : "Procéder au paiement"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmationCard;
