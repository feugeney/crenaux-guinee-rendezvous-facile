
import { Coach, DaySchedule, TimeSlot } from "@/types";
import { addDays, format } from "date-fns";

// Generate sample schedule data for 14 days
export const generateScheduleData = (): DaySchedule[] => {
  const scheduleData: DaySchedule[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const currentDate = addDays(today, i);
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // Generate 3-5 slots per day with varying availability
    const numberOfSlots = Math.floor(Math.random() * 3) + 3;
    const slots: TimeSlot[] = [];
    
    for (let j = 0; j < numberOfSlots; j++) {
      const startHour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
      const startTime = `${startHour.toString().padStart(2, '0')}:00`;
      const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;
      
      slots.push({
        id: `slot-${formattedDate}-${j}`,
        day_of_week: dayOfWeek,
        startTime,
        endTime,
        available: Math.random() > 0.3, // 70% chance of being available
      });
    }
    
    scheduleData.push({
      date: formattedDate,
      slots,
    });
  }
  
  return scheduleData;
};

// Coach data
export const coachData: Coach = {
  id: "coach-1",
  name: "Domani Doré",
  speciality: "Coaching Politique et Professionnel",
  bio: "Conseillère expérimentée avec plus de 10 ans d'expérience dans le coaching politique et le développement professionnel.",
  imageUrl: "/lovable-uploads/64df67e3-2852-4399-878d-03cb4e455f55.png",
};

// Coaching topics array
export const coachingTopics: string[] = [
  "Développement de leadership",
  "Communication politique",
  "Stratégie de campagne",
  "Prise de parole en public",
  "Gestion d'image",
  "Développement de carrière",
  "Réseautage professionnel",
  "Résolution de conflits",
  "Préparation d'interview",
  "Coaching de transition",
];
