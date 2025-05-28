
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface UpcomingBooking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  message: string | null;
  payment_status: string;
  status: string;
  created_at: string;
  customer_name: string | null;
  email: string | null;
  is_priority: boolean;
}

const UpcomingBookings = () => {
  const [bookings, setBookings] = useState<UpcomingBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

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
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      setBookings(data as UpcomingBooking[]);
    } catch (error: any) {
      console.error("Erreur lors du chargement des réservations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations à venir",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setIsUpdating(bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Forcer l'envoi d'email de confirmation
      if (newStatus === 'confirmed') {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking?.email) {
          await sendConfirmationEmail(booking);
        }
      }
      
      await fetchUpcomingBookings();
      
      toast({
        title: "Succès",
        description: `Réservation ${newStatus === 'confirmed' ? 'confirmée' : 'annulée'} avec succès`,
      });
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const sendConfirmationEmail = async (booking: UpcomingBooking) => {
    try {
      const emailData = {
        to: booking.email,
        subject: `Confirmation de votre rendez-vous - ${booking.topic}`,
        text: `
Bonjour ${booking.customer_name || 'Client'},

Votre rendez-vous a été confirmé :

📅 Date : ${format(new Date(booking.date), 'PPP', { locale: fr })}
🕐 Heure : ${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)}
📝 Sujet : ${booking.topic}

${booking.message ? `Message : ${booking.message}` : ''}

Nous avons hâte de vous rencontrer !

Cordialement,
L'équipe Dom Consulting
        `
      };

      const { error } = await supabase.functions.invoke('send-gmail-smtp', {
        body: emailData
      });

      if (error) {
        console.error("Erreur envoi email:", error);
        // Essayer avec l'autre fonction
        await supabase.functions.invoke('send-gmail-nodemailer', {
          body: emailData
        });
      }

    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
    }
  };

  const getStatusColor = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'confirmed') return 'bg-green-100 text-green-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'pending') return 'En attente de paiement';
    if (status === 'confirmed') return 'Confirmé';
    if (status === 'cancelled') return 'Annulé';
    return 'En attente';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Rendez-vous à venir</h2>
        <Button onClick={fetchUpcomingBookings} variant="outline">
          Actualiser
        </Button>
      </div>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun rendez-vous à venir
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{booking.topic}</CardTitle>
                  <div className="flex items-center gap-2">
                    {booking.is_priority && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Prioritaire
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(booking.status, booking.payment_status)}
                    >
                      {getStatusText(booking.status, booking.payment_status)}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(booking.date), 'PPP', { locale: fr })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {booking.customer_name && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.customer_name}</span>
                      </div>
                    )}
                    {booking.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.email}</span>
                      </div>
                    )}
                  </div>
                  {booking.message && (
                    <div className="text-sm">
                      <strong>Message:</strong>
                      <p className="text-muted-foreground mt-1">{booking.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {booking.payment_status === 'completed' && booking.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      disabled={isUpdating === booking.id}
                      className="text-red-600 hover:bg-red-50"
                    >
                      {isUpdating === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      disabled={isUpdating === booking.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isUpdating === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Confirmer
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;
