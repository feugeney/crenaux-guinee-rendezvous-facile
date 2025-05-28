
import React from "react";
import { BookingData } from "@/types";
import BookingPersonalInfo from "./BookingPersonalInfo";
import BookingAppointmentDetails from "./BookingAppointmentDetails";
import BookingProfileData from "./BookingProfileData";
import BookingQuestionsSection from "./BookingQuestionsSection";

interface BookingSummaryProps {
  formData: BookingData | any;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ formData }) => {
  if (!formData) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BookingPersonalInfo
          fullName={formData.fullName}
          email={formData.email}
          countryCode={formData.countryCode}
          phone={formData.phone}
          whatsapp={formData.whatsapp}
          location={formData.location}
        />
        
        <BookingAppointmentDetails
          isPriority={formData.isPriority}
          date={formData.date}
          time={formData.time}
        />
      </div>
      
      <BookingProfileData
        gender={formData.gender}
        relationshipStatus={formData.relationshipStatus}
        otherStatus={formData.otherStatus}
        professionalProfile={formData.professionalProfile}
        businessType={formData.businessType}
        otherBusinessType={formData.otherBusinessType}
        topic={formData.topic}
        otherTopic={formData.otherTopic}
      />
      
      <BookingQuestionsSection questions={formData.questions} />
    </div>
  );
};

export default BookingSummary;
