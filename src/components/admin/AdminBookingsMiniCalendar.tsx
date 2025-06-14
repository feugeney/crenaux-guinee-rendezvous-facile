
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { addDays, format, startOfMonth, endOfMonth, isSameDay, isSameMonth, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type HighlightedDay = string; // format 'yyyy-MM-dd'

interface AdminBookingsMiniCalendarProps {
  highlightDates: HighlightedDay[];
  selectedDate?: string | null;
  onSelectDate?: (date: string) => void;
}

const AdminBookingsMiniCalendar: React.FC<AdminBookingsMiniCalendarProps> = ({
  highlightDates,
  selectedDate,
  onSelectDate,
}) => {
  const today = new Date();
  const curMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const firstDayOfMonth = startOfMonth(curMonthDate);
  const lastDayOfMonth = endOfMonth(curMonthDate);
  const startDate = addDays(firstDayOfMonth, -((firstDayOfMonth.getDay() + 6) % 7));
  const days: Date[] = Array.from({ length: 42 }, (_, i) =>
    addDays(startDate, i)
  );

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
          const isSelected = selectedDate === formatted;

          return (
            <button
              key={formatted}
              type="button"
              className={cn(
                'p-2 rounded-md text-sm w-8 h-8 transition-all outline-none border-2 border-transparent flex items-center justify-center cursor-pointer',
                inCurMonth ? 'text-gray-900' : 'text-gray-300',
                isCurToday && 'ring-2 ring-primary ring-offset-2 font-bold',
                isHighlighted && 'bg-blue-500 border-blue-700 font-semibold text-white hover:bg-blue-600',
                isSelected && 'border-blue-700 bg-blue-700 text-white font-bold',
                !isHighlighted && !isSelected && 'hover:bg-gray-100'
              )}
              onClick={() => {
                if (inCurMonth && isHighlighted && onSelectDate) onSelectDate(formatted);
                // Si ce n’est pas un jour avec rdv, ignore le clic !
              }}
              title={isHighlighted ? 'Rendez-vous ce jour' : undefined}
              tabIndex={inCurMonth ? 0 : -1}
              disabled={!inCurMonth || !isHighlighted}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-gray-400 flex items-center">
        <span className="inline-block w-3 h-3 mr-1 bg-blue-500 border border-blue-700 rounded align-middle" />
        Jours avec rendez-vous
      </div>
    </div>
  );
};

export default AdminBookingsMiniCalendar;
