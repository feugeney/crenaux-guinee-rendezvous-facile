
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarPlus, Clock, Grid } from 'lucide-react';
import TimeSlotList from '@/components/admin/TimeSlotList';
import TimeSlotForm from '@/components/admin/TimeSlotForm';
import TimeSlotCalendar from '@/components/admin/TimeSlotCalendar';
import MultipleTimeSlotsForm from '@/components/admin/MultipleTimeSlotsForm';
import BulkTimeSlotCreator from '@/components/admin/BulkTimeSlotCreator';
import { supabase } from '@/lib/supabase';
import { TimeSlot } from '@/types';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';

const AdminTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('calendar');
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
      if (timeSlot.id && timeSlot.id !== "" && !timeSlot.id.startsWith('temp-')) {
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
      setActiveTab('calendar');
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error('Error saving time slot:', error);
    }
  };

  const handleMultipleTimeSlotsSave = async (timeSlots: TimeSlot[]) => {
    try {
      const insertData = timeSlots.map(slot => ({
        day_of_week: slot.day_of_week,
        start_time: slot.startTime,
        end_time: slot.endTime,
        available: slot.available,
        is_recurring: slot.is_recurring || false,
        specific_date: slot.specific_date || null
      }));

      const { error } = await supabase
        .from('time_slots')
        .insert(insertData);

      if (error) throw error;

      // Reload time slots
      await loadTimeSlots();
      setActiveTab('calendar');
    } catch (error) {
      console.error('Error saving multiple time slots:', error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'add') {
      setSelectedTimeSlot(null);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des créneaux horaires</h1>
            <p className="text-gray-600 mt-2">
              Configurez vos disponibilités et créneaux de consultation
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ajouter un créneau
            </TabsTrigger>
            <TabsTrigger value="multiple" className="flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              Créneaux multiples
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              Création en masse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <TimeSlotCalendar
              timeSlots={timeSlots}
              onEdit={handleTimeSlotSave}
              onDelete={handleDeleteTimeSlot}
              onCreate={handleTimeSlotSave}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="list">
            <TimeSlotList
              timeSlots={timeSlots}
              onEdit={handleEditTimeSlot}
              onDelete={handleDeleteTimeSlot}
              loading={loading}
              refresh={loadTimeSlots}
            />
          </TabsContent>

          <TabsContent value="add">
            <TimeSlotForm
              initialData={selectedTimeSlot}
              onSubmit={handleTimeSlotSave}
              onCancel={() => {
                setActiveTab('calendar');
                setSelectedTimeSlot(null);
              }}
            />
          </TabsContent>

          <TabsContent value="multiple">
            <MultipleTimeSlotsForm
              onSubmit={handleMultipleTimeSlotsSave}
              onCancel={() => setActiveTab('calendar')}
            />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkTimeSlotCreator />
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminTimeSlots;
