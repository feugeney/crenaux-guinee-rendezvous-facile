
import React from 'react';

interface BookingHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-bold text-coaching-900 mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default BookingHeader;
