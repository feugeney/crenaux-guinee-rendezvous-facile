
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { addDays, format, startOfMonth, endOfMonth, isSameDay, isSameMonth, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type HighlightedDay = string; // format 'yyyy-MM-dd'

interface AdminBookingsMiniCalendarProps {
  highlightDates: HighlightedDay[];
}

const AdminBookingsMiniCalendar: React.FC<AdminBookingsMiniCalendarProps> = ({
  highlightDates,
}) => {
  const today = new Date();

  // Mois courant
  const curMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

  // Premier et dernier jour du mois (affiché entier semaines)
  const firstDayOfMonth = startOfMonth(curMonthDate);
  const lastDayOfMonth = endOfMonth(curMonthDate);

  // Calculer tous les jours à afficher (y compris les jours blancs au début/fin de semaine)
  const startDate = addDays(firstDayOfMonth, -((firstDayOfMonth.getDay() + 6) % 7));
  const totalDays =
    Math.ceil((endOfMonth(curMonthDate).getDate() + startDate.getDay()) / 7) * 7;
  const days: Date[] = Array.from({ length: 42 }, (_, i) =>
    addDays(startDate, i)
  );

  // Pour savoir si un jour doit être mis en surbrillance (présence rdv)
  const highlightSet = new Set(highlightDates);

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm w-full md:w-80">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-700">
          <CalendarIcon className="inline mr-2 h-5 w-5 text-primary" />
          {format(curMonthDate, 'LLLL yyyy', { locale: fr })}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-center text-gray-500 mb-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const formatted = format(day, 'yyyy-MM-dd');
          const inCurMonth = isSameMonth(day, curMonthDate);
          const isHighlighted = highlightSet.has(formatted);
          const isCurToday = isToday(day);

          return (
            <div
              key={formatted}
              className={cn(
                'p-2 rounded-md text-sm cursor-default',
                inCurMonth ? 'text-gray-900' : 'text-gray-300',
                isCurToday && 'ring-2 ring-primary ring-offset-2 font-bold',
                isHighlighted && 'bg-blue-100 border border-blue-400 font-semibold'
              )}
              title={isHighlighted ? 'Rendez-vous ce jour' : undefined}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-gray-400">
        <span className="inline-block w-3 h-3 mr-1 bg-blue-100 border border-blue-400 rounded align-middle" />
        Jours avec rendez-vous
      </div>
    </div>
  );
};

export default AdminBookingsMiniCalendar;

