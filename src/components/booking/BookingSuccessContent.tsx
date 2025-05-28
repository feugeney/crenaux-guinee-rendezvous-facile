
import React from "react";
import { Button } from "@/components/ui/button";
import SuccessHeader from "./SuccessHeader";
import EmailConfirmation from "./EmailConfirmation";
import NextSteps from "./NextSteps";
import ContactInfo from "./ContactInfo";
import LoadingIndicator from "./LoadingIndicator";
import BookingAppointmentDetails from "./BookingAppointmentDetails";

interface BookingSuccessContentProps {
  isLoading: boolean;
  bookingDetails: any;
  emailSent: boolean;
  emailError: boolean | string;
  handleResendEmail: () => void;
  onReturnHome: () => void;
}

const BookingSuccessContent = ({
  isLoading,
  bookingDetails,
  emailSent,
  emailError,
  handleResendEmail,
  onReturnHome
}: BookingSuccessContentProps) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-4">
      <SuccessHeader />

      {bookingDetails && (
        <div className="bg-gold-50 p-4 rounded-md border border-gold-200">
          <h3 className="text-lg font-semibold mb-3 text-gold-700">Détails de votre réservation</h3>
          <BookingAppointmentDetails
            isPriority={bookingDetails.is_priority}
            date={bookingDetails.date}
            time={bookingDetails.start_time && bookingDetails.end_time ? 
              `${bookingDetails.start_time?.substring(0, 5)} - ${bookingDetails.end_time?.substring(0, 5)}` : 
              undefined}
          />
          {bookingDetails.topic && (
            <p className="mt-2"><span className="font-medium">Sujet:</span> {bookingDetails.topic}</p>
          )}
        </div>
      )}

      {bookingDetails?.profiles?.email && (
        <EmailConfirmation 
          email={bookingDetails.profiles.email}
          emailSent={emailSent}
          emailError={emailError}
          isLoading={isLoading}
          onResend={handleResendEmail}
        />
      )}
      
      {/* If we have booking details but no profiles.email, try to use email directly */}
      {bookingDetails && !bookingDetails.profiles?.email && bookingDetails.email && (
        <EmailConfirmation 
          email={bookingDetails.email}
          emailSent={emailSent}
          emailError={emailError}
          isLoading={isLoading}
          onResend={handleResendEmail}
        />
      )}

      <NextSteps />
      <ContactInfo />
      
      <div className="mt-6 text-center">
        <Button onClick={onReturnHome}>
          Retourner à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default BookingSuccessContent;
