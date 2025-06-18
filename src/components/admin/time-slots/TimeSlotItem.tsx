
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeSlot } from '@/types';

interface TimeSlotItemProps {
  slot: TimeSlot;
  onEdit: (slot: TimeSlot) => void;
  onDelete: (id: string) => void;
}

export const TimeSlotItem = ({ slot, onEdit, onDelete }: TimeSlotItemProps) => {
  const getDayName = (dayOfWeek: number) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[dayOfWeek] || "";
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <div>
          <p className="font-medium">
            {slot.specific_date ? format(new Date(slot.specific_date), 'PPP', { locale: fr }) : getDayName(slot.day_of_week)}
          </p>
          <p className="text-sm text-gray-500">
            {slot.start_time} - {slot.end_time}
            {slot.is_recurring && ' (récurrent)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {slot.available ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Disponible
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Indisponible
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(slot)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDelete(slot.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
