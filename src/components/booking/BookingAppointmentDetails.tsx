
import React from "react";
import { formatDate } from "@/utils/formatters";

interface BookingAppointmentDetailsProps {
  isPriority?: boolean;
  date?: string;
  time?: string;
}

const BookingAppointmentDetails: React.FC<BookingAppointmentDetailsProps> = ({
  isPriority,
  date,
  time
}) => {
  // Appointment price based on priority status
  const appointmentPrice = isPriority ? "350 $" : "300 $";
  // Appointment type based on priority status
  const appointmentType = isPriority 
    ? "Rendez-vous prioritaire express (48h)" 
    : "Entretien en privé standard";

  return (
    <div>
      <h3 className="font-semibold">Détails du rendez-vous</h3>
      <p><span className="font-medium">Type:</span> {appointmentType}</p>
      <p><span className="font-medium">Prix:</span> {appointmentPrice} USD</p>
      {date && <p><span className="font-medium">Date:</span> {formatDate(date)}</p>}
      {time && <p><span className="font-medium">Heure:</span> {time}</p>}
    </div>
  );
};

export default BookingAppointmentDetails;
