
import React, { useEffect, useState } from 'react';
import { UpcomingBookings } from './UpcomingBookings';
import AdminBookingsMiniCalendar from './AdminBookingsMiniCalendar';
import { supabase } from '@/lib/supabase';

type BookingRow = {
  date: string;
  status: string;
  payment_status: string;
};

const BookingsCalendar = () => {
  // Dates de réservation à surligner
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
  // Date sélectionnée (ISO string)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    // Charge les dates des réservations à venir (uniques, non annulées)
    const fetchBookingDates = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('bookings')
        .select('date, status, payment_status')
        .gte('date', today)
        .in('payment_status', ['completed', 'pending']);
      if (error) {
        setHighlightedDates([]);
        return;
      }
      const futureRdv = (data as BookingRow[])
        .filter(x => x.status !== 'cancelled')
        .map(x => x.date);

      setHighlightedDates(Array.from(new Set(futureRdv)));
    };

    fetchBookingDates();
  }, []);

  // Mets à jour la date sélectionnée lors du choix sur le calendrier
  const handleSelectDate = (date: string) => {
    setSelectedDate(prev =>
      prev === date ? null : date // toggle: recliquer = déselectionner
    );
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <UpcomingBookings selectedDate={selectedDate} />
      </div>
      <div>
        <AdminBookingsMiniCalendar
          highlightDates={highlightedDates}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />
      </div>
    </div>
  );
};

export default BookingsCalendar;
