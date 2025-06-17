
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Mail, CheckCircle, XCircle, Edit } from 'lucide-react';
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
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<ExpressBooking | null>(null);
  const [proposedDate, setProposedDate] = useState('');
  const [proposedStartTime, setProposedStartTime] = useState('');
  const [proposedEndTime, setProposedEndTime] = useState('');
  const [showProposalDialog, setShowProposalDialog] = useState(false);

  useEffect(() => {
    fetchExpressBookings();
  }, []);

  const fetchExpressBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('is_priority', true)
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

  const handleValidateBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'completed' })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Rendez-vous validé avec succès');
      fetchExpressBookings();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Rendez-vous rejeté');
      fetchExpressBookings();
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet');
    }
  };

  const handleProposeNewDate = async () => {
    if (!selectedBooking || !proposedDate || !proposedStartTime || !proposedEndTime) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          date: proposedDate,
          start_time: proposedStartTime,
          end_time: proposedEndTime,
          payment_status: 'pending'
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast.success('Nouvelle date proposée avec succès');
      setShowProposalDialog(false);
      setSelectedBooking(null);
      setProposedDate('');
      setProposedStartTime('');
      setProposedEndTime('');
      fetchExpressBookings();
    } catch (error) {
      console.error('Erreur lors de la proposition:', error);
      toast.error('Erreur lors de la proposition');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.payment_status === filter;
    const matchesSearch = !searchTerm || 
      booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.topic.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Validation des Rendez-vous Express</h2>
          <p className="text-muted-foreground">Validez, rejetez ou proposez de nouvelles dates</p>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="completed">Validés</SelectItem>
                  <SelectItem value="cancelled">Rejetés</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Button variant="outline" onClick={() => {
                setFilter('all');
                setSearchTerm('');
              }}>
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.payment_status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Validés</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.payment_status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejetés</p>
                <p className="text-2xl font-bold">{bookings.filter(b => b.payment_status === 'cancelled').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de rendez-vous express</CardTitle>
          <CardDescription>
            {filteredBookings.length} demande(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Date proposée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{booking.customer_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        {booking.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium">{booking.topic}</p>
                      {booking.message && (
                        <p className="text-sm text-gray-500 truncate">{booking.message}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {format(new Date(booking.date), 'PPP', { locale: fr })}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-gray-500" />
                        {booking.start_time} - {booking.end_time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.payment_status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {booking.payment_status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleValidateBooking(booking.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                          <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setProposedDate(booking.date);
                                  setProposedStartTime(booking.start_time);
                                  setProposedEndTime(booking.end_time);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Proposer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Proposer une nouvelle date</DialogTitle>
                                <DialogDescription>
                                  Proposez une nouvelle date et heure pour ce rendez-vous
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="proposed-date">Date</Label>
                                  <Input
                                    id="proposed-date"
                                    type="date"
                                    value={proposedDate}
                                    onChange={(e) => setProposedDate(e.target.value)}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="proposed-start">Heure de début</Label>
                                    <Input
                                      id="proposed-start"
                                      type="time"
                                      value={proposedStartTime}
                                      onChange={(e) => setProposedStartTime(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="proposed-end">Heure de fin</Label>
                                    <Input
                                      id="proposed-end"
                                      type="time"
                                      value={proposedEndTime}
                                      onChange={(e) => setProposedEndTime(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleProposeNewDate}>
                                    Proposer cette date
                                  </Button>
                                  <Button variant="outline" onClick={() => setShowProposalDialog(false)}>
                                    Annuler
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
