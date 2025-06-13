
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { format, parseISO, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, Clock, User, AlertTriangle } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  customer_name?: string;
  email?: string;
  is_priority: boolean;
  payment_status: string;
}

const BookingsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dayBookings = bookings.filter(booking => 
        isSameDay(parseISO(booking.date), selectedDate)
      );
      setSelectedDateBookings(dayBookings);
    }
  }, [selectedDate, bookings]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBookingDates = () => {
    return bookings.map(booking => parseISO(booking.date));
  };

  const hasBookingsOnDate = (date: Date) => {
    return bookings.some(booking => isSameDay(parseISO(booking.date), date));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendrier */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5 text-blue-700" />
            <span>Calendrier des rendez-vous</span>
          </CardTitle>
          <CardDescription>
            Cliquez sur une date pour voir les rendez-vous
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            modifiers={{
              hasBookings: getBookingDates()
            }}
            modifiersStyles={{
              hasBookings: {
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                fontWeight: 'bold'
              }
            }}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Détails de la date sélectionnée */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-700" />
            <span>
              {selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : 'Aucune date sélectionnée'}
            </span>
          </CardTitle>
          <CardDescription>
            {selectedDateBookings.length} rendez-vous programmé{selectedDateBookings.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : selectedDateBookings.length > 0 ? (
            <div className="space-y-4">
              {selectedDateBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    booking.is_priority 
                      ? 'border-l-orange-500 bg-orange-50' 
                      : 'border-l-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      {booking.is_priority && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      <h4 className="font-medium text-gray-900">{booking.topic}</h4>
                    </div>
                    <Badge 
                      variant={booking.is_priority ? "destructive" : "default"}
                      className={booking.is_priority ? "bg-orange-100 text-orange-800" : ""}
                    >
                      {booking.is_priority ? 'Prioritaire' : 'Standard'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}</span>
                    </div>
                    {booking.customer_name && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{booking.customer_name}</span>
                      </div>
                    )}
                    <div className="mt-2">
                      <Badge 
                        variant="outline" 
                        className={
                          booking.payment_status === 'completed' || booking.payment_status === 'confirmed'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : booking.payment_status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }
                      >
                        {booking.payment_status === 'completed' || booking.payment_status === 'confirmed' ? 'Confirmé' :
                         booking.payment_status === 'pending' ? 'En attente' : 'Non payé'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Aucun rendez-vous ce jour</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsCalendar;
