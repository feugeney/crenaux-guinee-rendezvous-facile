
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarPlus, Clock } from 'lucide-react';
import TimeSlotList from '@/components/admin/TimeSlotList';
import TimeSlotForm from '@/components/admin/TimeSlotForm';
import BulkTimeSlotCreator from '@/components/admin/BulkTimeSlotCreator';
import { supabase } from '@/lib/supabase';
import { TimeSlot } from '@/types';

const AdminTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        throw error;
      }

      // Map data to TimeSlot type
      const formattedData: TimeSlot[] = data.map(slot => ({
        id: slot.id,
        day_of_week: slot.day_of_week,
        startTime: slot.start_time,
        endTime: slot.end_time,
        available: slot.available,
        is_recurring: slot.is_recurring,
        specific_date: slot.specific_date
      }));

      setTimeSlots(formattedData);
    } catch (error) {
      console.error('Error loading time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTimeSlot = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setActiveTab('edit');
  };

  const handleDeleteTimeSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_slots')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  const handleTimeSlotSave = async (timeSlot: TimeSlot) => {
    try {
      if (timeSlot.id) {
        // Update existing time slot
        const { error } = await supabase
          .from('time_slots')
          .update({
            day_of_week: timeSlot.day_of_week,
            start_time: timeSlot.startTime,
            end_time: timeSlot.endTime,
            available: timeSlot.available,
            is_recurring: timeSlot.is_recurring || true,
            specific_date: timeSlot.specific_date || null
          })
          .eq('id', timeSlot.id);

        if (error) throw error;
      } else {
        // Create new time slot
        const { error } = await supabase
          .from('time_slots')
          .insert({
            day_of_week: timeSlot.day_of_week,
            start_time: timeSlot.startTime,
            end_time: timeSlot.endTime,
            available: timeSlot.available,
            is_recurring: timeSlot.is_recurring || true,
            specific_date: timeSlot.specific_date || null
          });

        if (error) throw error;
      }

      // Reload time slots
      await loadTimeSlots();
      setActiveTab('list');
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error('Error saving time slot:', error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'add') {
      setSelectedTimeSlot(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Gestion des créneaux horaires</h1>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Créneaux
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {selectedTimeSlot ? "Modifier un créneau" : "Ajouter un créneau"}
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4" />
            Création en masse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <TimeSlotList
            timeSlots={timeSlots}
            onEdit={handleEditTimeSlot}
            onDelete={handleDeleteTimeSlot}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="add">
          <TimeSlotForm
            initialData={selectedTimeSlot}
            onSubmit={handleTimeSlotSave}
            onCancel={() => {
              setActiveTab('list');
              setSelectedTimeSlot(null);
            }}
          />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkTimeSlotCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTimeSlots;
