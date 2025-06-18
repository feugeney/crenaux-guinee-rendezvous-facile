
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
    is_blocked: dbSlot.is_blocked || false,
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
const mapToDbTimeSlot = (timeSlot: Partial<TimeSlot>) => {
  const dbSlot = {
    day_of_week: timeSlot.day_of_week || 0,
    start_time: timeSlot.start_time || timeSlot.startTime || '',
    end_time: timeSlot.end_time || timeSlot.endTime || '',
    available: timeSlot.available !== undefined ? timeSlot.available : true,
    is_blocked: timeSlot.is_blocked || false,
    is_recurring: timeSlot.is_recurring !== undefined ? timeSlot.is_recurring : true,
    specific_date: timeSlot.specific_date || null
  };
  
  console.log("Mapping timeSlot to DB format:", { input: timeSlot, output: dbSlot });
  return dbSlot;
};

// Helper function to get day name from day of week number
const getDayName = (dayOfWeek: number): string => {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return days[dayOfWeek] || "";
};

export const fetchTimeSlots = async () => {
  console.log("Récupération des créneaux...");
  
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }

  console.log("Créneaux récupérés:", data);
  return (data || []).map(mapToTimeSlot);
};

export const fetchAvailableTimeSlots = async (date: string) => {
  const formattedDate = date.split('T')[0];
  const dayOfWeek = new Date(formattedDate).getDay();

  console.log("Récupération des créneaux disponibles pour:", formattedDate, "jour de la semaine:", dayOfWeek);

  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .or(`and(is_recurring.eq.true,day_of_week.eq.${dayOfWeek}),and(is_recurring.eq.false,specific_date.eq.${formattedDate})`)
    .eq('available', true)
    .eq('is_blocked', false)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }

  console.log("Créneaux disponibles récupérés:", data);
  return (data || []).map(mapToTimeSlot);
};

export const createTimeSlot = async (timeSlot: Partial<TimeSlot>) => {
  console.log("Création d'un nouveau créneau:", timeSlot);
  
  // Validation des données requises
  if (!timeSlot.start_time || !timeSlot.end_time) {
    throw new Error("Les heures de début et de fin sont requises");
  }
  
  if (timeSlot.start_time >= timeSlot.end_time) {
    throw new Error("L'heure de début doit être antérieure à l'heure de fin");
  }

  // Vérifier s'il existe déjà un créneau similaire
  const existingSlotQuery = supabase
    .from('time_slots')
    .select('*')
    .eq('day_of_week', timeSlot.day_of_week || 0)
    .eq('start_time', timeSlot.start_time)
    .eq('end_time', timeSlot.end_time);

  // Si c'est un créneau récurrent, on vérifie seulement par jour de la semaine
  // Si c'est un créneau spécifique, on vérifie aussi la date
  if (!timeSlot.is_recurring && timeSlot.specific_date) {
    existingSlotQuery.eq('specific_date', timeSlot.specific_date);
  } else if (timeSlot.is_recurring) {
    existingSlotQuery.eq('is_recurring', true);
  }

  const { data: existingSlots, error: checkError } = await existingSlotQuery;
  
  if (checkError) {
    console.error('Error checking existing slots:', checkError);
    throw new Error(`Erreur lors de la vérification: ${checkError.message}`);
  }

  if (existingSlots && existingSlots.length > 0) {
    throw new Error("Un créneau identique existe déjà pour cette période");
  }
  
  const dbTimeSlot = mapToDbTimeSlot(timeSlot);
  console.log("Données mappées pour la base:", dbTimeSlot);
  
  const { data, error } = await supabase
    .from('time_slots')
    .insert([dbTimeSlot])
    .select();

  if (error) {
    console.error('Error creating time slot:', error);
    throw new Error(`Erreur lors de la création: ${error.message}`);
  }

  console.log("Créneau créé dans la base:", data);
  return data ? mapToTimeSlot(data[0]) : null;
};

export const updateTimeSlot = async (timeSlot: TimeSlot) => {
  console.log("Mise à jour du créneau:", timeSlot);
  
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

  console.log("Créneau mis à jour:", data);
  return data ? mapToTimeSlot(data[0]) : null;
};

export const deleteTimeSlot = async (id: string) => {
  console.log("Suppression du créneau:", id);
  
  const { error } = await supabase
    .from('time_slots')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting time slot:', error);
    throw error;
  }

  console.log("Créneau supprimé avec succès");
  return true;
};

export const toggleTimeSlotBlocked = async (id: string, isBlocked: boolean) => {
  console.log("Basculement du statut bloqué pour le créneau:", id, "vers:", isBlocked);
  
  const { data, error } = await supabase
    .from('time_slots')
    .update({ is_blocked: isBlocked })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error toggling time slot blocked status:', error);
    throw error;
  }

  console.log("Statut bloqué mis à jour:", data);
  return data ? mapToTimeSlot(data[0]) : null;
};
