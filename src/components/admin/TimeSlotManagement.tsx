
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Clock, Edit, Trash2 } from 'lucide-react';
import { fetchTimeSlots, createTimeSlot, updateTimeSlot, deleteTimeSlot } from '@/services/timeSlotService';
import { TimeSlot } from '@/types';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import BulkTimeSlotCreator from './BulkTimeSlotCreator';

export const TimeSlotManagement = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isRecurring, setIsRecurring] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      const slots = await fetchTimeSlots();
      setTimeSlots(slots);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
      toast.error('Erreur lors du chargement des créneaux');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    if (startTime === endTime) {
      toast.error('Les heures de début et de fin doivent être différentes');
      return;
    }

    try {
      const timeSlotData = {
        day_of_week: selectedDate.getDay(),
        start_time: startTime,
        end_time: endTime,
        available: available,
        is_recurring: isRecurring,
        specific_date: format(selectedDate, 'yyyy-MM-dd')
      };

      if (editingSlot) {
        await updateTimeSlot({ ...editingSlot, ...timeSlotData });
        toast.success('Créneau mis à jour');
      } else {
        await createTimeSlot(timeSlotData as TimeSlot);
        toast.success('Créneau créé');
      }
      
      setShowForm(false);
      setEditingSlot(null);
      resetForm();
      loadTimeSlots();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    if (slot.specific_date) {
      setSelectedDate(new Date(slot.specific_date));
    }
    setStartTime(slot.start_time);
    setEndTime(slot.end_time);
    setAvailable(slot.available);
    setIsRecurring(slot.is_recurring);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      try {
        await deleteTimeSlot(id);
        toast.success('Créneau supprimé');
        loadTimeSlots();
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setStartTime('09:00');
    setEndTime('10:00');
    setAvailable(true);
    setIsRecurring(false);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[dayOfWeek] || "";
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des créneaux</h1>
          <p className="text-gray-600">Gérez les créneaux disponibles pour les réservations</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gold-600 hover:bg-gold-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un créneau
        </Button>
      </div>

      {/* Créateur de créneaux en lot */}
      <BulkTimeSlotCreator />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSlot ? 'Modifier le créneau' : 'Nouveau créneau'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date du créneau</Label>
                  <DatePicker
                    date={selectedDate}
                    setDate={setSelectedDate}
                    label=""
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_recurring"
                    checked={isRecurring}
                    onCheckedChange={setIsRecurring}
                  />
                  <Label htmlFor="is_recurring">Créneau récurrent</Label>
                </div>

                <div>
                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                    label="Heure de début"
                  />
                </div>

                <div>
                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                    label="Heure de fin"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={available}
                    onCheckedChange={setAvailable}
                  />
                  <Label htmlFor="available">Disponible</Label>
                </div>
              </div>

              {selectedDate && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Créneau sélectionné :</strong> {format(selectedDate, 'PPP', { locale: fr })} de {startTime} à {endTime}
                    {isRecurring && ' (récurrent)'}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
                  {editingSlot ? 'Modifier' : 'Créer'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingSlot(null);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Créneaux disponibles</CardTitle>
          <CardDescription>{timeSlots.length} créneau(x) configuré(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">
                      {slot.specific_date ? format(new Date(slot.specific_date), 'PPP', { locale: fr }) : getDayName(slot.day_of_week)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {slot.start_time} - {slot.end_time}
                      {slot.is_recurring && ' (récurrent)'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {slot.available ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Disponible
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Indisponible
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(slot)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(slot.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
