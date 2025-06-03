
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, AlertCircle, Loader2, CheckCircle, X, CalendarX, CalendarPlus } from 'lucide-react';
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
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isNewDateDialogOpen, setIsNewDateDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<PriorityBooking | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const refreshBookings = async () => {
    const { data, error } = await supabase
      .from('priority_bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    setBookings(data as PriorityBooking[]);
  };

  const sendPaymentLink = async (bookingId: string) => {
    try {
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
      
      await refreshBookings();
      
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
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'confirmed' })
        .eq('id', bookingId);
      
      if (error) throw error;
      
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
      
      await refreshBookings();
      
    } catch (err: any) {
      console.error("Error confirming booking:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de confirmer la réservation",
      });
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking || !rejectReason.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez indiquer la raison du rejet",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Update booking status to rejected
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'rejected' })
        .eq('id', selectedBooking.id);

      if (updateError) throw updateError;

      // Send rejection notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          type: 'booking_rejection',
          recipient_email: selectedBooking.email || 'client@example.com',
          sender_email: 'admin@domconsulting.com',
          subject: 'Demande de rendez-vous rejetée',
          content: `Votre demande de rendez-vous prioritaire pour ${selectedBooking.topic} a été rejetée. Raison: ${rejectReason}`,
          metadata: { booking_id: selectedBooking.id, reason: rejectReason },
          sent: false
        });

      if (notifError) throw notifError;

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée et le client a été notifié",
      });

      setIsRejectDialogOpen(false);
      setRejectReason('');
      setSelectedBooking(null);
      await refreshBookings();

    } catch (err: any) {
      console.error("Error rejecting booking:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rejeter la demande",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProposeNewDate = async () => {
    if (!selectedBooking || !newDate || !newStartTime || !newEndTime) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Send new date proposal notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          type: 'new_date_proposal',
          recipient_email: selectedBooking.email || 'client@example.com',
          sender_email: 'admin@domconsulting.com',
          subject: 'Nouvelle proposition de date pour votre rendez-vous',
          content: `Nous vous proposons une nouvelle date pour votre rendez-vous "${selectedBooking.topic}": ${format(new Date(newDate), 'PPP', { locale: fr })} de ${newStartTime} à ${newEndTime}.`,
          metadata: { 
            booking_id: selectedBooking.id, 
            proposed_date: newDate,
            proposed_start_time: newStartTime,
            proposed_end_time: newEndTime
          },
          sent: false
        });

      if (notifError) throw notifError;

      toast({
        title: "Nouvelle date proposée",
        description: "La proposition a été envoyée au client",
      });

      setIsNewDateDialogOpen(false);
      setNewDate('');
      setNewStartTime('');
      setNewEndTime('');
      setSelectedBooking(null);

    } catch (err: any) {
      console.error("Error proposing new date:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la proposition",
      });
    } finally {
      setIsSubmitting(false);
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
                ) : booking.payment_status === 'rejected' ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700">Rejeté</Badge>
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
              onClick={() => {
                setSelectedBooking(booking);
                setIsRejectDialogOpen(true);
              }}
              disabled={booking.payment_status === 'completed' || booking.payment_status === 'confirmed' || booking.payment_status === 'rejected'}
              className="text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Rejeter
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedBooking(booking);
                setIsNewDateDialogOpen(true);
              }}
              disabled={booking.payment_status === 'completed' || booking.payment_status === 'confirmed' || booking.payment_status === 'rejected'}
              className="text-blue-600 hover:bg-blue-50"
            >
              <CalendarPlus className="h-4 w-4 mr-1" />
              Nouvelle date
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => sendPaymentLink(booking.id)}
              disabled={booking.payment_status === 'completed' || booking.payment_status === 'confirmed' || booking.payment_status === 'rejected'}
            >
              Créer lien de paiement
            </Button>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => confirmBooking(booking.id)}
              disabled={booking.payment_status === 'completed' || booking.payment_status === 'confirmed' || booking.payment_status === 'rejected'}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirmer RDV
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Dialog de rejet */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CalendarX className="h-5 w-5 mr-2 text-red-600" />
              Rejeter la demande
            </DialogTitle>
            <DialogDescription>
              Indiquez la raison du rejet de cette demande de rendez-vous prioritaire.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Raison du rejet</Label>
              <Textarea
                id="reject-reason"
                placeholder="Ex: Créneaux non disponibles, informations incomplètes..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectBooking}
              disabled={isSubmitting || !rejectReason.trim()}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de proposition de nouvelle date */}
      <Dialog open={isNewDateDialogOpen} onOpenChange={setIsNewDateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CalendarPlus className="h-5 w-5 mr-2 text-blue-600" />
              Proposer une nouvelle date
            </DialogTitle>
            <DialogDescription>
              Proposez une nouvelle date et horaire pour ce rendez-vous.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-date">Nouvelle date</Label>
              <Input
                id="new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-start-time">Heure de début</Label>
                <Input
                  id="new-start-time"
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-end-time">Heure de fin</Label>
                <Input
                  id="new-end-time"
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDateDialogOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button 
              onClick={handleProposeNewDate}
              disabled={isSubmitting || !newDate || !newStartTime || !newEndTime}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CalendarPlus className="h-4 w-4 mr-2" />}
              Proposer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriorityBookingsList;
