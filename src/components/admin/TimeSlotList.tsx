import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TimeSlot } from '@/types';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import TimeSlotForm from './TimeSlotForm';
import DeleteConfirmation from './DeleteConfirmation';

export interface TimeSlotListProps {
  timeSlots: TimeSlot[];
  onEdit: (timeSlot: TimeSlot) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
  refresh?: () => void;
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({ 
  timeSlots = [], 
  onEdit, 
  onDelete,
  loading = false,
  refresh
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddSlot = async (newTimeSlot: TimeSlot) => {
    try {
      await new Promise<void>(async (resolve) => {
        await onEdit(newTimeSlot);
        resolve();
      });
      if (refresh) {
        refresh();
      }
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  };

  const handleEditSlot = async (updatedTimeSlot: TimeSlot) => {
    try {
      await new Promise<void>(async (resolve) => {
        await onEdit(updatedTimeSlot);
        resolve();
      });
      if (refresh) {
        refresh();
      }
    } catch (error) {
      console.error('Error editing time slot:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      setIsDeleting(true);
      try {
        await onDelete(deleteId);
      } finally {
        setIsDeleting(false);
        setDeleteId(null);
      }
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayOfWeek];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Créneaux horaires</CardTitle>
          <CardDescription>
            Gérez vos créneaux disponibles pour les rendez-vous
          </CardDescription>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un créneau
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 p-4 border rounded-md bg-muted/50">
            <h3 className="text-lg font-medium mb-4">Ajouter un nouveau créneau</h3>
            <TimeSlotForm
              onSubmit={handleAddSlot}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        )}

        {editingTimeSlot && (
          <div className="mb-6 p-4 border rounded-md bg-muted/50">
            <h3 className="text-lg font-medium mb-4">Modifier le créneau</h3>
            <TimeSlotForm
              timeSlot={editingTimeSlot}
              onSubmit={handleEditSlot}
              onCancel={() => setEditingTimeSlot(null)}
              isEditing={true}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : timeSlots.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Jour / Date</TableHead>
                <TableHead>Heure de début</TableHead>
                <TableHead>Heure de fin</TableHead>
                <TableHead>Disponible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{slot.is_recurring ? 'Récurrent' : 'Spécifique'}</TableCell>
                  <TableCell>
                    {slot.is_recurring 
                      ? getDayName(slot.day_of_week) 
                      : formatDate(slot.specific_date)
                    }
                  </TableCell>
                  <TableCell>{slot.startTime}</TableCell>
                  <TableCell>{slot.endTime}</TableCell>
                  <TableCell>{slot.available ? 'Oui' : 'Non'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingTimeSlot(slot)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setDeleteId(slot.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucun créneau horaire n'a été créé.
          </div>
        )}

        <DeleteConfirmation
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
          title="Supprimer le créneau"
          description="Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est irréversible."
        />
      </CardContent>
    </Card>
  );
};

export default TimeSlotList;
