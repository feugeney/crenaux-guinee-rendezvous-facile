
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Clock, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  available: boolean;
  is_recurring: boolean;
  specific_date?: string;
}

export const TimeSlotManagement = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({
    day_of_week: '',
    start_time: '',
    end_time: '',
    available: true,
    is_recurring: true,
    specific_date: ''
  });

  const daysOfWeek = [
    { value: '1', label: 'Lundi' },
    { value: '2', label: 'Mardi' },
    { value: '3', label: 'Mercredi' },
    { value: '4', label: 'Jeudi' },
    { value: '5', label: 'Vendredi' },
    { value: '6', label: 'Samedi' },
    { value: '0', label: 'Dimanche' }
  ];

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
      toast.error('Erreur lors du chargement des créneaux');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async () => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .insert([{
          day_of_week: parseInt(newSlot.day_of_week),
          start_time: newSlot.start_time,
          end_time: newSlot.end_time,
          available: newSlot.available,
          is_recurring: newSlot.is_recurring,
          specific_date: newSlot.specific_date || null
        }]);

      if (error) throw error;

      toast.success('Créneau créé avec succès');
      setNewSlot({
        day_of_week: '',
        start_time: '',
        end_time: '',
        available: true,
        is_recurring: true,
        specific_date: ''
      });
      fetchTimeSlots();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création du créneau');
    }
  };

  const handleUpdateSlot = async (id: string, updates: Partial<TimeSlot>) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Créneau mis à jour');
      setEditingSlot(null);
      fetchTimeSlots();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;

    try {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Créneau supprimé');
      fetchTimeSlots();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getDayName = (dayNumber: number) => {
    return daysOfWeek.find(day => parseInt(day.value) === dayNumber)?.label || 'Inconnu';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Créneaux Horaires</h2>
          <p className="text-muted-foreground">Gérez les créneaux de disponibilité pour les rendez-vous</p>
        </div>
      </div>

      {/* Formulaire de création */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Créer un nouveau créneau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="day">Jour de la semaine</Label>
              <Select value={newSlot.day_of_week} onValueChange={(value) => setNewSlot({...newSlot, day_of_week: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un jour" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="start_time">Heure de début</Label>
              <Input
                type="time"
                value={newSlot.start_time}
                onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="end_time">Heure de fin</Label>
              <Input
                type="time"
                value={newSlot.end_time}
                onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="specific_date">Date spécifique (optionnel)</Label>
              <Input
                type="date"
                value={newSlot.specific_date}
                onChange={(e) => setNewSlot({...newSlot, specific_date: e.target.value, is_recurring: !e.target.value})}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleCreateSlot}
                disabled={!newSlot.day_of_week || !newSlot.start_time || !newSlot.end_time}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Créer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des créneaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Créneaux existants
          </CardTitle>
          <CardDescription>
            {timeSlots.length} créneau(x) configuré(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jour</TableHead>
                <TableHead>Horaires</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    {slot.specific_date ? (
                      <div>
                        <div className="font-medium">{new Date(slot.specific_date).toLocaleDateString('fr-FR')}</div>
                        <div className="text-sm text-gray-500">{getDayName(slot.day_of_week)}</div>
                      </div>
                    ) : (
                      getDayName(slot.day_of_week)
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {slot.start_time} - {slot.end_time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={slot.is_recurring ? "default" : "secondary"}>
                      {slot.is_recurring ? "Récurrent" : "Ponctuel"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={slot.available ? "default" : "destructive"}>
                      {slot.available ? "Disponible" : "Indisponible"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateSlot(slot.id, { available: !slot.available })}
                      >
                        {slot.available ? "Désactiver" : "Activer"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
