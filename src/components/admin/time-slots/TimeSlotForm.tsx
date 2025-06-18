
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeSlot } from '@/types';

interface TimeSlotFormProps {
  selectedDate?: Date;
  setSelectedDate: (date?: Date) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  isRecurring: boolean;
  setIsRecurring: (recurring: boolean) => void;
  available: boolean;
  setAvailable: (available: boolean) => void;
  editingSlot: TimeSlot | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const TimeSlotForm = ({
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isRecurring,
  setIsRecurring,
  available,
  setAvailable,
  editingSlot,
  onSubmit,
  onCancel
}: TimeSlotFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingSlot ? 'Modifier le créneau' : 'Nouveau créneau'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date du créneau</Label>
              <DatePicker
                date={selectedDate}
                setDate={setSelectedDate}
                label=""
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
              <Label htmlFor="is_recurring">Créneau récurrent</Label>
            </div>

            <div>
              <TimePicker
                value={startTime}
                onChange={setStartTime}
                label="Heure de début"
              />
            </div>

            <div>
              <TimePicker
                value={endTime}
                onChange={setEndTime}
                label="Heure de fin"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={available}
                onCheckedChange={setAvailable}
              />
              <Label htmlFor="available">Disponible</Label>
            </div>
          </div>

          {selectedDate && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Créneau sélectionné :</strong> {format(selectedDate, 'PPP', { locale: fr })} de {startTime} à {endTime}
                {isRecurring && ' (récurrent)'}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
              {editingSlot ? 'Modifier' : 'Créer'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
