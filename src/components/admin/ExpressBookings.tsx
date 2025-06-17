
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Mail, CheckCircle, X, CalendarPlus, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExpressBooking {
  id: string;
  customer_name?: string;
  email?: string;
  topic: string;
  date: string;
  start_time: string;
  end_time: string;
  payment_status: string;
  message?: string;
  created_at: string;
}

export const ExpressBookings = () => {
  const [bookings, setBookings] = useState<ExpressBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<ExpressBooking | null>(null);
  const [actionType, setActionType] = useState<'validate' | 'propose' | 'reject' | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExpressBookings();
  }, []);

  const fetchExpressBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('is_priority', true)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous express:', error);
      toast.error('Erreur lors du chargement des rendez-vous express');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateBooking = async (booking: ExpressBooking) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'confirmed' })
        .eq('id', booking.id);

      if (error) throw error;

      toast.success('Rendez-vous validé avec succès');
      fetchExpressBookings();
      setSelectedBooking(null);
      setActionType(null);
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast.error('Erreur lors de la validation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProposeNewDate = async () => {
    if (!selectedBooking || !newDate || !newStartTime || !newEndTime) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Créer une notification pour le client avec la nouvelle proposition
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          type: 'date_proposal',
          recipient_email: selectedBooking.email || '',
          sender_email: 'admin@domconsulting.com',
          subject: 'Nouvelle proposition de date pour votre rendez-vous express',
          content: `Nous vous proposons une nouvelle date pour votre rendez-vous "${selectedBooking.topic}": ${format(new Date(newDate), 'PPP', { locale: fr })} de ${newStartTime} à ${newEndTime}.`,
          metadata: {
            booking_id: selectedBooking.id,
            proposed_date: newDate,
            proposed_start_time: newStartTime,
            proposed_end_time: newEndTime
          }
        });

      if (notificationError) throw notificationError;

      toast.success('Nouvelle date proposée au client');
      setSelectedBooking(null);
      setActionType(null);
      setNewDate('');
      setNewStartTime('');
      setNewEndTime('');
    } catch (error) {
      console.error('Erreur lors de la proposition:', error);
      toast.error('Erreur lors de la proposition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking || !rejectReason.trim()) {
      toast.error('Veuillez indiquer la raison du rejet');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'rejected' })
        .eq('id', selectedBooking.id);

      if (updateError) throw updateError;

      // Créer une notification pour le client
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          type: 'booking_rejection',
          recipient_email: selectedBooking.email || '',
          sender_email: 'admin@domconsulting.com',
          subject: 'Votre demande de rendez-vous express a été rejetée',
          content: `Votre demande de rendez-vous pour "${selectedBooking.topic}" a été rejetée. Raison: ${rejectReason}`,
          metadata: {
            booking_id: selectedBooking.id,
            reason: rejectReason
          }
        });

      if (notificationError) throw notificationError;

      toast.success('Rendez-vous rejeté');
      fetchExpressBookings();
      setSelectedBooking(null);
      setActionType(null);
      setRejectReason('');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rendez-vous Express</h2>
          <p className="text-muted-foreground">Gérez les demandes de rendez-vous prioritaires</p>
        </div>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {bookings.length} demande(s) en attente
        </Badge>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune demande de rendez-vous express en attente</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-l-4 border-l-amber-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{booking.topic}</CardTitle>
                  <Badge className="bg-amber-100 text-amber-800">Express 48h</Badge>
                </div>
                <CardDescription>
                  Demande reçue le {format(new Date(booking.created_at), 'PPP à HH:mm', { locale: fr })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{booking.customer_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{booking.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(booking.date), 'PPP', { locale: fr })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{booking.start_time} - {booking.end_time}</span>
                    </div>
                  </div>
                </div>
                
                {booking.message && (
                  <div className="bg-gray-50 p-3 rounded mb-4">
                    <p className="text-sm"><strong>Message du client:</strong> {booking.message}</p>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setActionType('reject');
                    }}
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
                      setActionType('propose');
                    }}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <CalendarPlus className="h-4 w-4 mr-1" />
                    Proposer nouvelle date
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setActionType('validate');
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Valider la date
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de validation */}
      <Dialog open={actionType === 'validate'} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Valider le rendez-vous</DialogTitle>
            <DialogDescription>
              Confirmer le rendez-vous express pour {selectedBooking?.topic} le{' '}
              {selectedBooking && format(new Date(selectedBooking.date), 'PPP', { locale: fr })} 
              de {selectedBooking?.start_time} à {selectedBooking?.end_time} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Annuler
            </Button>
            <Button 
              onClick={() => selectedBooking && handleValidateBooking(selectedBooking)}
              disabled={isSubmitting}
            >
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de proposition de nouvelle date */}
      <Dialog open={actionType === 'propose'} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proposer une nouvelle date</DialogTitle>
            <DialogDescription>
              Proposez une nouvelle date et horaire pour ce rendez-vous express
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
            <Button variant="outline" onClick={() => setActionType(null)}>
              Annuler
            </Button>
            <Button onClick={handleProposeNewDate} disabled={isSubmitting}>
              Proposer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de rejet */}
      <Dialog open={actionType === 'reject'} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
            <DialogDescription>
              Indiquez la raison du rejet de cette demande de rendez-vous express
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
            <Button variant="outline" onClick={() => setActionType(null)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectBooking}
              disabled={isSubmitting || !rejectReason.trim()}
            >
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
