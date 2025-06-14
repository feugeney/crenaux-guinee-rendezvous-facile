import React, { useEffect, useState } from 'react';
import UpcomingBookings from './UpcomingBookings';
import AdminBookingsMiniCalendar from './AdminBookingsMiniCalendar';
import { supabase } from '@/lib/supabase';

interface BookingCalendarDay {
  date: string;
}

// Booking row shape for what we select from supabase below
type BookingRow = {
  date: string;
  status: string;
  payment_status: string;
};

const BookingsCalendar = () => {
  // État pour stocker les dates de réservation à surligner
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);

  useEffect(() => {
    // Charge les dates des réservations à venir (uniques, non annulées)
    const fetchBookingDates = async () => {
      const today = new Date().toISOString().split('T')[0];
      // On ne récupère que les champs "date", "status", "payment_status"
      const { data, error } = await supabase
        .from('bookings')
        .select('date, status, payment_status')
        .gte('date', today)
        .in('payment_status', ['completed', 'pending']);
      if (error) {
        setHighlightedDates([]);
        return;
      }
      // Statut non annulé
      const futureRdv = (data as BookingRow[])
        .filter(x => x.status !== 'cancelled')
        .map(x => x.date);

      // Unicité
      setHighlightedDates(Array.from(new Set(futureRdv)));
    };

    fetchBookingDates();
  }, []);

  // Affiche deux colonnes : à gauche la liste, à droite le calendrier mini
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <UpcomingBookings />
      </div>
      <div>
        <AdminBookingsMiniCalendar highlightDates={highlightedDates} />
      </div>
    </div>
  );
};

export default BookingsCalendar;
