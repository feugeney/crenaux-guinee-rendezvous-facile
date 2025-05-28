
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle, Loader2, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface PriorityBooking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  message: string | null;
  payment_status: string;
  created_at: string;
  is_priority: boolean;
  payment_link: string | null;
  metadata?: any;
  customer_name?: string;
  email?: string;
}

interface PriorityBookingsListProps {
  limit?: number;
  showHeader?: boolean;
}

const PriorityBookingsList = ({ limit = 10, showHeader = true }: PriorityBookingsListProps) => {
  const [bookings, setBookings] = useState<PriorityBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPriorityBookings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('priority_bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        
        setBookings(data as PriorityBooking[]);
      } catch (err: any) {
        console.error("Error fetching priority bookings:", err);
        setError(err.message || "Impossible de charger les réservations prioritaires");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPriorityBookings();
  }, [limit]);

  const sendPaymentLink = async (bookingId: string) => {
    try {
      // Update booking with payment link (no email sending)
      const paymentLink = `https://app.domconsulting.com/payment/${bookingId}`;
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_link: paymentLink 
        })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      toast({
        title: "Lien de paiement créé",
        description: "Le lien de paiement a été généré avec succès",
      });
      
      // Refresh the list
      const { data, error: fetchError } = await supabase
        .from('priority_bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (fetchError) throw fetchError;
      setBookings(data as PriorityBooking[]);
      
    } catch (err: any) {
      console.error("Error creating payment link:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le lien de paiement",
      });
    }
  };

  const confirmBooking = async (bookingId: string) => {
    try {
      // Update booking status (no email confirmation)
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'confirmed' })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      // Create a notification in database
      const bookingToConfirm = bookings.find(b => b.id === bookingId);
      
      if (bookingToConfirm) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            type: 'booking_confirmation',
            recipient_email: bookingToConfirm.email || 'client@example.com',
            sender_email: 'admin@domconsulting.com',
            subject: 'Confirmation de réservation',
            content: `Votre réservation pour ${bookingToConfirm.topic} le ${format(new Date(bookingToConfirm.date), 'PPP', { locale: fr })} a été confirmée.`,
            metadata: { booking_id: bookingId },
            sent: false
          });
          
        if (notifError) throw notifError;
      }
      
      toast({
        title: "Réservation confirmée",
        description: "La réservation a été confirmée avec succès",
      });
      
      // Refresh the list
      const { data, error: fetchError } = await supabase
        .from('priority_bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (fetchError) throw fetchError;
      setBookings(data as PriorityBooking[]);
      
    } catch (err: any) {
      console.error("Error confirming booking:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de confirmer la réservation",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucune réservation prioritaire à traiter</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Réservations prioritaires</h3>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {bookings.length} {bookings.length > 1 ? "demandes" : "demande"}
          </Badge>
        </div>
      )}
      
      {bookings.map((booking) => (
        <Card key={booking.id} className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="rounded-full p-2 mr-2 bg-amber-100 text-amber-700">
                  <Clock className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">{booking.topic}</CardTitle>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Prioritaire 48h
              </Badge>
            </div>
            <CardDescription className="text-xs flex justify-between mt-1">
              <span>De: {booking.customer_name || 'Client'}</span>
              <span>Date souhaitée: {format(new Date(booking.date), 'PPP', { locale: fr })}</span>
              <span>Heure: {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 pt-0">
            {booking.message && (
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 mb-3">
                {booking.message}
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-600">
                Demande reçue: {format(new Date(booking.created_at), 'PPp', { locale: fr })}
              </div>
              <div className="flex items-center">
                {booking.payment_status === 'pending' ? (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600">En attente</Badge>
                ) : booking.payment_status === 'completed' || booking.payment_status === 'confirmed' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">Confirmé</Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700">Échec</Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => sendPaymentLink(booking.id)}
              disabled={booking.payment_status === 'completed' || booking.payment_status === 'confirmed'}
            >
              Créer lien de paiement
            </Button>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => confirmBooking(booking.id)}
              disabled={booking.payment_status === 'completed' || booking.payment_status === 'confirmed'}
            >
              Confirmer RDV
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PriorityBookingsList;
