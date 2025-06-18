
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UpcomingBooking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  customer_name: string | null;
  email: string | null;
  status: string;
  payment_status: string;
  is_priority: boolean;
}

const DashboardUpcomingBookings = () => {
  const [bookings, setBookings] = useState<UpcomingBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('date', today)
        .eq('status', 'confirmed')
        .eq('payment_status', 'completed')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(5);

      if (error) throw error;
      setBookings(data as UpcomingBooking[]);
    } catch (error: any) {
      console.error("Erreur lors du chargement des prochains rendez-vous:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimePosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Plage horaire de 8h à 19h (11 heures)
    const dayStart = 8 * 60; // 8h00 en minutes
    const dayEnd = 19 * 60;   // 19h00 en minutes
    const totalDayMinutes = dayEnd - dayStart;
    
    const left = ((startMinutes - dayStart) / totalDayMinutes) * 100;
    const width = ((endMinutes - startMinutes) / totalDayMinutes) * 100;
    
    return { left: Math.max(0, left), width: Math.max(5, width) };
  };

  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>5 Prochains Rendez-vous Confirmés</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>5 Prochains Rendez-vous Confirmés</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucun rendez-vous confirmé à venir
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grille horaire */}
            <div className="flex border-b pb-2">
              <div className="w-32 flex-shrink-0"></div>
              <div className="flex-1 flex relative">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="flex-1 text-xs text-center text-gray-500 border-l first:border-l-0"
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Rendez-vous en format Gantt */}
            {bookings.map((booking) => {
              const position = getTimePosition(booking.start_time, booking.end_time);
              
              return (
                <div key={booking.id} className="flex items-center">
                  {/* Informations du rendez-vous */}
                  <div className="w-32 flex-shrink-0 pr-2">
                    <div className="text-sm font-medium truncate">{booking.topic}</div>
                    <div className="text-xs text-gray-500">
                      {format(parseISO(booking.date), 'dd/MM', { locale: fr })}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{booking.customer_name || 'Client'}</span>
                    </div>
                  </div>

                  {/* Barre de Gantt */}
                  <div className="flex-1 relative h-8 border border-gray-200 rounded">
                    <div
                      className={`absolute top-0 bottom-0 rounded flex items-center justify-center text-xs font-medium ${
                        booking.is_priority 
                          ? 'bg-red-500 text-white border border-red-600' 
                          : 'bg-blue-500 text-white border border-blue-600'
                      }`}
                      style={{
                        left: `${position.left}%`,
                        width: `${position.width}%`,
                      }}
                    >
                      <div className="flex items-center gap-1 px-1">
                        <Clock className="h-3 w-3" />
                        <span className="truncate">
                          {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge de priorité */}
                  <div className="w-20 flex-shrink-0 ml-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        booking.is_priority 
                          ? 'bg-red-100 text-red-800 border-red-300' 
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }`}
                    >
                      {booking.is_priority ? 'Express' : 'Standard'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardUpcomingBookings;
