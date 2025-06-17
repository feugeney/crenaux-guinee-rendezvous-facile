
import { parseISO, isBefore, isAfter, isToday, startOfDay } from 'date-fns';
import { Calendar, Clock, Check, Play } from 'lucide-react';
import { SessionSchedule, PaidApplication } from './types';

export const getSessionStatusAndColor = (session: SessionSchedule, allSessions: SessionSchedule[]) => {
  const now = new Date();
  const sessionDate = parseISO(session.date);
  const today = startOfDay(now);
  const sessionDay = startOfDay(sessionDate);
  
  if (session.completed) {
    return {
      color: 'bg-green-100 border-green-300 text-green-800',
      icon: Check,
      status: 'Terminée'
    };
  } else if (isBefore(sessionDay, today)) {
    return {
      color: 'bg-red-100 border-red-300 text-red-800',
      icon: Clock,
      status: 'En retard'
    };
  } else if (isToday(sessionDate)) {
    return {
      color: 'bg-orange-100 border-orange-300 text-orange-800',
      icon: Play,
      status: "Aujourd'hui"
    };
  } else {
    // Vérifier si c'est la prochaine séance non terminée
    const incompleteSessions = allSessions
      .filter(s => !s.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const nextSession = incompleteSessions[0];
    const isNextSession = nextSession && nextSession.date === session.date && nextSession.session_number === session.session_number;
    
    return {
      color: isNextSession 
        ? 'bg-blue-100 border-blue-300 text-blue-800' 
        : 'bg-gray-100 border-gray-300 text-gray-600',
      icon: Calendar,
      status: isNextSession ? 'Prochaine séance' : 'Programmée'
    };
  }
};

export const getCompletionPercentage = (application: PaidApplication) => {
  if (!application.proposed_schedule) return 0;
  
  const allSessions = [
    ...(application.proposed_schedule.sessions || []),
    ...(application.proposed_schedule.followUpSessions || [])
  ];
  
  if (allSessions.length === 0) return 0;
  
  const completedSessions = allSessions.filter(session => session.completed);
  return Math.round((completedSessions.length / allSessions.length) * 100);
};
