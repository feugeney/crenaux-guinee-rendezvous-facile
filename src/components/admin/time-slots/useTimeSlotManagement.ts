
import { useState, useEffect } from 'react';
import { fetchTimeSlots, createTimeSlot, updateTimeSlot, deleteTimeSlot } from '@/services/timeSlotService';
import { TimeSlot } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const useTimeSlotManagement = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isRecurring, setIsRecurring] = useState(false);
  const [available, setAvailable] = useState(true);

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

    if (startTime >= endTime) {
      toast.error('L\'heure de début doit être antérieure à l\'heure de fin');
      return;
    }

    try {
      const timeSlotData: Partial<TimeSlot> = {
        day_of_week: selectedDate.getDay(),
        start_time: startTime,
        end_time: endTime,
        available: available,
        is_blocked: false,
        is_recurring: isRecurring,
        specific_date: isRecurring ? undefined : format(selectedDate, 'yyyy-MM-dd')
      };

      console.log('Données du créneau à créer/modifier:', timeSlotData);

      if (editingSlot) {
        await updateTimeSlot({ ...editingSlot, ...timeSlotData } as TimeSlot);
        toast.success('Créneau mis à jour');
      } else {
        await createTimeSlot(timeSlotData);
        toast.success('Créneau créé');
      }
      
      setShowForm(false);
      setEditingSlot(null);
      resetForm();
      loadTimeSlots();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur lors de la sauvegarde');
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

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlot(null);
    resetForm();
  };

  useEffect(() => {
    loadTimeSlots();
  }, []);

  return {
    timeSlots,
    loading,
    showForm,
    setShowForm,
    editingSlot,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    isRecurring,
    setIsRecurring,
    available,
    setAvailable,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel
  };
};
