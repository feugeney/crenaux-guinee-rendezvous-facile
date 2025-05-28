
import React from 'react';
import { TimeSlot as TimeSlotType } from '@/types';
import { cn } from '@/lib/utils';

interface TimeSlotProps {
  slot: TimeSlotType;
  isSelected: boolean;
  onSelect: (slot: TimeSlotType) => void;
  showDay?: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ 
  slot, 
  isSelected, 
  onSelect,
  showDay = false 
}) => {
  return (
    <div 
      className={cn(
        "border rounded-md p-2 text-center cursor-pointer transition-colors",
        slot.available 
          ? "hover:bg-coaching-100" 
          : "opacity-50 cursor-not-allowed",
        isSelected && slot.available 
          ? "border-coaching-600 bg-coaching-50 text-coaching-800" 
          : "border-gray-200"
      )}
      onClick={() => slot.available && onSelect(slot)}
    >
      {showDay && slot.day && <div className="text-xs text-gray-500 mb-1">{slot.day}</div>}
      {slot.startTime} - {slot.endTime}
    </div>
  );
};

export default TimeSlot;
