
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
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
        .in('payment_status', ['completed', 'pending'])
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

  const getStatusColor = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'confirmed') return 'bg-green-100 text-green-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'pending') return 'En attente';
    if (status === 'confirmed') return 'Confirmé';
    if (status === 'cancelled') return 'Annulé';
    return 'En attente';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>5 Prochains Rendez-vous</span>
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
          <span>5 Prochains Rendez-vous</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucun rendez-vous à venir
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm">{booking.topic}</h4>
                    {booking.is_priority && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                        Prioritaire
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(booking.date), 'dd/MM/yyyy', { locale: fr })}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{booking.start_time.substring(0, 5)}</span>
                    </span>
                    {booking.customer_name && (
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{booking.customer_name}</span>
                      </span>
                    )}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(booking.status, booking.payment_status)} text-xs`}
                >
                  {getStatusText(booking.status, booking.payment_status)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardUpcomingBookings;
