
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSlotItem } from './TimeSlotItem';
import { TimeSlot } from '@/types';

interface TimeSlotListProps {
  timeSlots: TimeSlot[];
  onEdit: (slot: TimeSlot) => void;
  onDelete: (id: string) => void;
}

export const TimeSlotList = ({ timeSlots, onEdit, onDelete }: TimeSlotListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créneaux disponibles</CardTitle>
        <CardDescription>{timeSlots.length} créneau(x) configuré(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {timeSlots.map((slot) => (
            <TimeSlotItem
              key={slot.id}
              slot={slot}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
