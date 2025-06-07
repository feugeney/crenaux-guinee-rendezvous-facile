
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
          .from('bookings')
          .select('*')
          .eq('is_priority', true)
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
      .from('bookings')
      .select('*')
      .eq('is_priority', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    setBookings(data as PriorityBooking[]);
  };

  const confirmBooking = async (bookingId: string) => {
    try {
      setIsSubmitting(true);
      
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error("Réservation non trouvée");
      }

      // Créer la session de paiement Stripe
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke("stripe-checkout", {
        body: {
          bookingData: {
            fullName: booking.customer_name,
            email: booking.email,
            topic: booking.topic,
            date: booking.date,
            time: booking.start_time,
            isPriority: true
          },
          productPrice: 35000 // 350 USD pour prioritaire
        }
      });

      if (stripeError || !stripeData?.url) {
        throw new Error("Impossible de créer le lien de paiement");
      }

      // Mettre à jour la réservation avec le lien de paiement et confirmation
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          payment_link: stripeData.url,
          payment_status: 'confirmed' 
        })
        .eq('id', bookingId);
      
      if (updateError) throw updateError;

      // Envoyer l'email de confirmation avec le lien de paiement
      const emailData = {
        to: booking.email,
        subject: `Confirmation de votre rendez-vous prioritaire - ${booking.topic}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .details { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .payment-button { 
                display: inline-block; 
                background-color: #10b981; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 5px; 
                font-weight: bold; 
                margin: 20px 0;
              }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 Rendez-vous Prioritaire Confirmé</h1>
              </div>
              <div class="content">
                <p>Bonjour ${booking.customer_name || 'Client'},</p>
                <p>Excellente nouvelle ! Votre demande de rendez-vous prioritaire a été approuvée par notre équipe.</p>
                
                <div class="details">
                  <h3>📅 Détails de votre rendez-vous:</h3>
                  <ul>
                    <li><strong>Date:</strong> ${format(new Date(booking.date), 'PPP', { locale: fr })}</li>
                    <li><strong>Heure:</strong> ${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)}</li>
                    <li><strong>Sujet:</strong> ${booking.topic}</li>
                    <li><strong>Type:</strong> Consultation prioritaire (traitement sous 48h)</li>
                  </ul>
                  ${booking.message ? `<p><strong>Votre message:</strong> ${booking.message}</p>` : ''}
                </div>
                
                <h3>💳 Finaliser votre réservation</h3>
                <p>Pour confirmer définitivement votre rendez-vous, veuillez procéder au paiement en cliquant sur le bouton ci-dessous :</p>
                
                <div style="text-align: center;">
                  <a href="${stripeData.url}" class="payment-button">
                    💳 Payer maintenant (350 USD)
                  </a>
                </div>
                
                <p><strong>Important :</strong> Ce lien de paiement est sécurisé et géré par Stripe. Une fois le paiement effectué, vous recevrez une confirmation finale.</p>
                
                <p>Nous avons hâte de vous accompagner dans votre projet !</p>
              </div>
              <div class="footer">
                <p>L'équipe Dom Consulting</p>
                <p>WhatsApp: +224 610 73 08 69</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Bonjour ${booking.customer_name || 'Client'},

Votre demande de rendez-vous prioritaire a été approuvée !

📅 Détails :
- Date : ${format(new Date(booking.date), 'PPP', { locale: fr })}
- Heure : ${booking.start_time.substring(0, 5)} - ${booking.end_time.substring(0, 5)}
- Sujet : ${booking.topic}

Pour finaliser votre réservation, veuillez procéder au paiement : ${stripeData.url}

Cordialement,
L'équipe Dom Consulting
        `
      };

      const { error: emailError } = await supabase.functions.invoke('send-gmail-smtp', {
        body: emailData
      });

      if (emailError) {
        console.error("Erreur envoi email:", emailError);
        toast({
          title: "Réservation confirmée",
          description: "Le rendez-vous a été confirmé et le lien de paiement créé, mais l'email n'a pas pu être envoyé automatiquement.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Rendez-vous confirmé",
          description: "Le rendez-vous a été confirmé et le lien de paiement envoyé au client par email",
        });
      }

      // Créer une notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          type: 'booking_confirmation',
          recipient_email: booking.email || 'client@example.com',
          sender_email: 'admin@domconsulting.com',
          subject: 'Confirmation de réservation',
          content: `Votre réservation pour ${booking.topic} le ${format(new Date(booking.date), 'PPP', { locale: fr })} a été confirmée et le lien de paiement envoyé.`,
          metadata: { booking_id: bookingId, payment_link: stripeData.url },
          sent: false
        });
        
      if (notifError) console.error("Erreur notification:", notifError);
      
      await refreshBookings();
      
    } catch (err: any) {
      console.error("Error confirming booking:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de confirmer la réservation",
      });
    } finally {
      setIsSubmitting(false);
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

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'rejected' })
        .eq('id', selectedBooking.id);

      if (updateError) throw updateError;

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
            {booking.payment_link && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                <strong>Lien de paiement créé:</strong> <a href={booking.payment_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir le lien</a>
              </div>
            )}
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
              size="sm" 
              variant="default"
              onClick={() => confirmBooking(booking.id)}
              disabled={booking.payment_status === 'completed' || booking.payment_status === 'confirmed' || booking.payment_status === 'rejected' || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
              Confirmer & Envoyer paiement
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
