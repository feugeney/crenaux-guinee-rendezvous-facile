import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Mail, CheckCircle, XCircle, Eye, CalendarDays } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookingsGanttCalendar } from './BookingsGanttCalendar';

interface UpcomingBooking {
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
  is_priority: boolean;
}

interface UpcomingBookingsProps {
  selectedDate?: string | null;
}

export const UpcomingBookings = ({ selectedDate }: UpcomingBookingsProps) => {
  const [bookings, setBookings] = useState<UpcomingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_status', 'completed')
        .gte('date', today)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous à venir:', error);
      toast.error('Erreur lors du chargement des rendez-vous à venir');
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (isPriority: boolean) => {
    if (isPriority) {
      return <Badge className="bg-red-100 text-red-800">Express</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Standard</Badge>;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.topic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'express' && booking.is_priority) ||
      (filterType === 'standard' && !booking.is_priority);

    const matchesDate = !selectedDate || booking.date === selectedDate;

    return matchesSearch && matchesFilter && matchesDate;
  });

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {selectedDate ? `Rendez-vous du ${format(new Date(selectedDate), 'PPP', { locale: fr })}` : 'Rendez-vous à venir'}
          </h2>
          <p className="text-muted-foreground">
            {selectedDate ? 'Rendez-vous programmés pour la date sélectionnée' : 'Tous les rendez-vous validés programmés'}
          </p>
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
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rendez-vous</SelectItem>
                  <SelectItem value="express">Express uniquement</SelectItem>
                  <SelectItem value="standard">Standard uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Input
                placeholder="Rechercher (nom, email, sujet)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Button variant="outline" onClick={() => {
                setFilterType('all');
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
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">
                  {selectedDate ? 'Total ce jour' : 'Total à venir'}
                </p>
                <p className="text-2xl font-bold">{filteredBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Express</p>
                <p className="text-2xl font-bold">{filteredBookings.filter(b => b.is_priority).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Standard</p>
                <p className="text-2xl font-bold">{filteredBookings.filter(b => !b.is_priority).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour vue calendrier et liste */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Vue Calendrier
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Vue Liste
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <BookingsGanttCalendar bookings={filteredBookings} />
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {/* Table des rendez-vous */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des rendez-vous à venir</CardTitle>
              <CardDescription>
                {filteredBookings.length} rendez-vous trouvé(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Date & Heure</TableHead>
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
                        {getTypeBadge(booking.is_priority)}
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
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
