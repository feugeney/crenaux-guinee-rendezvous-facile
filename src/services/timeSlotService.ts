
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/types";

// Map from database format to application format
const mapToTimeSlot = (dbSlot: any): TimeSlot => {
  return {
    id: dbSlot.id,
    day_of_week: dbSlot.day_of_week,
    start_time: dbSlot.start_time,
    end_time: dbSlot.end_time,
    available: dbSlot.available,
    is_recurring: dbSlot.is_recurring,
    specific_date: dbSlot.specific_date,
    created_at: dbSlot.created_at,
    updated_at: dbSlot.updated_at,
    // Legacy compatibility
    startTime: dbSlot.start_time,
    endTime: dbSlot.end_time,
    day: getDayName(dbSlot.day_of_week)
  };
};

// Map from application format to database format
const mapToDbTimeSlot = (timeSlot: TimeSlot) => {
  return {
    day_of_week: timeSlot.day_of_week || 0,
    start_time: timeSlot.start_time || timeSlot.startTime || '',
    end_time: timeSlot.end_time || timeSlot.endTime || '',
    available: timeSlot.available,
    is_recurring: timeSlot.is_recurring !== undefined ? timeSlot.is_recurring : true,
    specific_date: timeSlot.specific_date || null
  };
};

// Helper function to get day name from day of week number
const getDayName = (dayOfWeek: number): string => {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return days[dayOfWeek] || "";
};

export const fetchTimeSlots = async () => {
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }

  // Map DB format to application format
  return (data || []).map(mapToTimeSlot);
};

export const fetchAvailableTimeSlots = async (date: string) => {
  // Format date to YYYY-MM-DD
  const formattedDate = date.split('T')[0];
  const dayOfWeek = new Date(formattedDate).getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Fetch both recurring slots for this day of week and specific date slots
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .or(`and(is_recurring.eq.true,day_of_week.eq.${dayOfWeek}),and(is_recurring.eq.false,specific_date.eq.${formattedDate})`)
    .eq('available', true)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }

  return (data || []).map(mapToTimeSlot);
};

export const createTimeSlot = async (timeSlot: TimeSlot) => {
  const dbTimeSlot = mapToDbTimeSlot(timeSlot);
  
  const { data, error } = await supabase
    .from('time_slots')
    .insert([dbTimeSlot])
    .select();

  if (error) {
    console.error('Error creating time slot:', error);
    throw error;
  }

  return data ? mapToTimeSlot(data[0]) : null;
};

export const updateTimeSlot = async (timeSlot: TimeSlot) => {
  const dbTimeSlot = mapToDbTimeSlot(timeSlot);

  const { data, error } = await supabase
    .from('time_slots')
    .update(dbTimeSlot)
    .eq('id', timeSlot.id)
    .select();

  if (error) {
    console.error('Error updating time slot:', error);
    throw error;
  }

  return data ? mapToTimeSlot(data[0]) : null;
};

export const deleteTimeSlot = async (id: string) => {
  const { error } = await supabase
    .from('time_slots')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting time slot:', error);
    throw error;
  }

  return true;
};
