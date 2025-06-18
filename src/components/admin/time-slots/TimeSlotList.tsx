
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeSlot } from '@/types';

interface TimeSlotListProps {
  timeSlots: TimeSlot[];
  onEdit: (slot: TimeSlot) => void;
  onDelete: (id: string) => void;
}

export const TimeSlotList = ({ timeSlots, onEdit, onDelete }: TimeSlotListProps) => {
  const getDayName = (dayOfWeek: number) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[dayOfWeek] || "";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Créneaux disponibles</CardTitle>
        <CardDescription>{timeSlots.length} créneau(x) configuré(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Heure de début</TableHead>
              <TableHead>Heure de fin</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeSlots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>
                  {slot.specific_date 
                    ? format(new Date(slot.specific_date), 'PPP', { locale: fr })
                    : `${getDayName(slot.day_of_week)} ${slot.is_recurring ? '(récurrent)' : ''}`}
                </TableCell>
                <TableCell>{slot.start_time}</TableCell>
                <TableCell>{slot.end_time}</TableCell>
                <TableCell>
                  {slot.available ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Disponible
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                      Indisponible
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(slot)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(slot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
