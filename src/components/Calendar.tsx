
import React, { useState } from 'react';
import { addDays, format, startOfWeek, addWeeks, isToday, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DaySchedule } from '@/types';

interface CalendarProps {
  scheduleData: DaySchedule[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

const Calendar: React.FC<CalendarProps> = ({ scheduleData, onDateSelect, selectedDate }) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const handlePrevWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, -1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const isDayAvailable = (date: Date): boolean => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayData = scheduleData.find(day => day.date === formattedDate);
    return dayData ? dayData.slots.some(slot => slot.available) : false;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Sélectionnez une date</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevWeek}>
              Précédente
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              Suivante
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const formattedDate = format(day, 'yyyy-MM-dd');
            const dayAvailable = isDayAvailable(day);
            const isSelected = selectedDate === formattedDate;
            const dayClasses = [
              'calendar-day',
              isToday(day) ? 'today' : '',
              isSelected ? 'selected' : '',
              !dayAvailable ? 'inactive' : ''
            ].filter(Boolean).join(' ');
            
            return (
              <div
                key={formattedDate}
                className={dayClasses}
                onClick={() => dayAvailable && onDateSelect(formattedDate)}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          {selectedDate ? (
            <p>Date sélectionnée: {format(parseISO(selectedDate), 'PPP', { locale: fr })}</p>
          ) : (
            <p>Veuillez sélectionner une date disponible</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
