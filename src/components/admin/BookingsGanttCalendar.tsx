
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Booking {
  id: string;
  customer_name?: string;
  email?: string;
  topic: string;
  date: string;
  start_time: string;
  end_time: string;
  is_priority: boolean;
}

interface BookingsGanttCalendarProps {
  bookings: Booking[];
  selectedWeek?: Date;
}

export const BookingsGanttCalendar = ({ bookings, selectedWeek = new Date() }: BookingsGanttCalendarProps) => {
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const end = endOfWeek(selectedWeek, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [selectedWeek]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  const getBookingsForDay = (day: Date) => {
    return bookings.filter(booking => 
      isSameDay(parseISO(booking.date), day)
    );
  };

  const getBookingPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = (startHour - 8) * 60 + startMin;
    const endMinutes = (endHour - 8) * 60 + endMin;
    
    const totalMinutes = 11 * 60; // 8h to 19h = 11 hours
    
    const top = (startMinutes / totalMinutes) * 100;
    const height = ((endMinutes - startMinutes) / totalMinutes) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier des rendez-vous</CardTitle>
        <CardDescription>
          Semaine du {format(weekDays[0], 'PP', { locale: fr })} au {format(weekDays[6], 'PP', { locale: fr })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex">
          {/* Colonne des heures */}
          <div className="w-16 flex-shrink-0 border-r">
            <div className="h-8 border-b flex items-center justify-center text-xs font-medium">
              Heure
            </div>
            <div className="relative" style={{ height: '600px' }}>
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className="absolute w-full text-xs text-gray-500 text-center border-t"
                  style={{ 
                    top: `${(index / timeSlots.length) * 100}%`,
                    height: `${100 / timeSlots.length}%`
                  }}
                >
                  <span className="bg-white px-1">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Colonnes des jours */}
          <div className="flex-1 flex">
            {weekDays.map((day) => {
              const dayBookings = getBookingsForDay(day);
              
              return (
                <div key={day.toISOString()} className="flex-1 border-r last:border-r-0">
                  <div className="h-8 border-b flex items-center justify-center text-xs font-medium bg-gray-50">
                    <div className="text-center">
                      <div>{format(day, 'EEE', { locale: fr })}</div>
                      <div className="text-gray-500">{format(day, 'd MMM', { locale: fr })}</div>
                    </div>
                  </div>
                  
                  <div className="relative" style={{ height: '600px' }}>
                    {/* Lignes de grille pour les heures */}
                    {timeSlots.map((time, index) => (
                      <div
                        key={time}
                        className="absolute w-full border-t border-gray-100"
                        style={{ top: `${(index / timeSlots.length) * 100}%` }}
                      />
                    ))}
                    
                    {/* Rendez-vous */}
                    {dayBookings.map((booking, index) => {
                      const position = getBookingPosition(booking.start_time, booking.end_time);
                      
                      return (
                        <div
                          key={booking.id}
                          className={`absolute left-1 right-1 rounded p-1 text-xs overflow-hidden ${
                            booking.is_priority 
                              ? 'bg-red-100 border border-red-300 text-red-800' 
                              : 'bg-blue-100 border border-blue-300 text-blue-800'
                          }`}
                          style={{
                            top: position.top,
                            height: position.height,
                            zIndex: index + 1
                          }}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">
                              {booking.start_time} - {booking.end_time}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{booking.customer_name || 'Client'}</span>
                          </div>
                          
                          <div className="text-xs text-gray-600 truncate mb-1">
                            {booking.topic}
                          </div>
                          
                          <Badge 
                            className={`text-xs ${
                              booking.is_priority 
                                ? 'bg-red-500 text-white' 
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            {booking.is_priority ? 'Express' : 'Standard'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
