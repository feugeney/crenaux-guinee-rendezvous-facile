
import React from "react";

interface BookingPersonalInfoProps {
  fullName?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
}

const BookingPersonalInfo: React.FC<BookingPersonalInfoProps> = ({
  fullName,
  email,
  countryCode,
  phone,
  whatsapp,
  location
}) => {
  return (
    <div>
      <h3 className="font-semibold">Informations personnelles</h3>
      {fullName && <p><span className="font-medium">Nom:</span> {fullName}</p>}
      {email && <p><span className="font-medium">Email:</span> {email}</p>}
      {phone && (
        <p><span className="font-medium">Téléphone:</span> {countryCode ? `${countryCode} ${phone}` : phone}</p>
      )}
      {whatsapp && (
        <p><span className="font-medium">WhatsApp:</span> {whatsapp}</p>
      )}
      {location && (
        <p><span className="font-medium">Pays:</span> {location}</p>
      )}
    </div>
  );
};

export default BookingPersonalInfo;
