
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import SimpleTimeSlotList from '@/components/admin/SimpleTimeSlotList';
import { supabase } from '@/lib/supabase';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

interface SimpleTimeSlot {
  id: string;
  specific_date: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

const AdminTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<SimpleTimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('id, specific_date, start_time, end_time, available')
        .order('specific_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Filtrer pour ne garder que les créneaux avec une date spécifique
      const filteredData = data.filter(slot => slot.specific_date !== null).map(slot => ({
        id: slot.id,
        specific_date: slot.specific_date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        available: slot.available
      }));

      setTimeSlots(filteredData);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les créneaux horaires",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimeSlot = async (timeSlot: Omit<SimpleTimeSlot, 'id'>) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .insert({
          specific_date: timeSlot.specific_date,
          start_time: timeSlot.start_time,
          end_time: timeSlot.end_time,
          available: timeSlot.available,
          day_of_week: new Date(timeSlot.specific_date).getDay(),
          is_recurring: false
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Créneau créé avec succès"
      });

      await loadTimeSlots();
    } catch (error: any) {
      console.error('Error creating time slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le créneau",
        variant: "destructive"
      });
    }
  };

  const handleEditTimeSlot = async (timeSlot: SimpleTimeSlot) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .update({
          specific_date: timeSlot.specific_date,
          start_time: timeSlot.start_time,
          end_time: timeSlot.end_time,
          available: timeSlot.available,
          day_of_week: new Date(timeSlot.specific_date).getDay(),
          updated_at: new Date().toISOString()
        })
        .eq('id', timeSlot.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Créneau modifié avec succès"
      });

      await loadTimeSlots();
    } catch (error: any) {
      console.error('Error updating time slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le créneau",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Créneau supprimé avec succès"
      });

      await loadTimeSlots();
    } catch (error: any) {
      console.error('Error deleting time slot:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le créneau",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des créneaux horaires</h1>
            <p className="text-gray-600 mt-2">
              Créez et gérez vos créneaux de consultation
            </p>
          </div>
        </div>

        <SimpleTimeSlotList
          timeSlots={timeSlots}
          onEdit={handleEditTimeSlot}
          onDelete={handleDeleteTimeSlot}
          onCreate={handleCreateTimeSlot}
          loading={loading}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminTimeSlots;
