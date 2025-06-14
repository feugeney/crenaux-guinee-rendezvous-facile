
import React from 'react';
import UpcomingBookings from './UpcomingBookings';

const BookingsCalendar = () => {
  // Affiche la liste des rendez-vous à venir plutôt qu'un calendrier indisponible
  return (
    <div className="w-full">
      <UpcomingBookings />
    </div>
  );
};

export default BookingsCalendar;
