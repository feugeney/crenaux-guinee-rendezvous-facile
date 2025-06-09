
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SimpleTimeSlotForm from './SimpleTimeSlotForm';
import DeleteConfirmation from './DeleteConfirmation';

interface SimpleTimeSlot {
  id: string;
  specific_date: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

interface SimpleTimeSlotListProps {
  timeSlots: SimpleTimeSlot[];
  onEdit: (timeSlot: SimpleTimeSlot) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (timeSlot: Omit<SimpleTimeSlot, 'id'>) => Promise<void>;
  loading?: boolean;
}

const SimpleTimeSlotList: React.FC<SimpleTimeSlotListProps> = ({
  timeSlots,
  onEdit,
  onDelete,
  onCreate,
  loading = false
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<SimpleTimeSlot | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: Omit<SimpleTimeSlot, 'id'>) => {
    setIsSubmitting(true);
    try {
      await onCreate(data);
      setIsCreateDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: SimpleTimeSlot) => {
    setIsSubmitting(true);
    try {
      await onEdit(data);
      setEditingSlot(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des créneaux horaires</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un créneau
          </Button>
        </CardHeader>
        <CardContent>
          {timeSlots.length > 0 ? (
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
                    <TableCell>{formatDate(slot.specific_date)}</TableCell>
                    <TableCell>{slot.start_time}</TableCell>
                    <TableCell>{slot.end_time}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        slot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {slot.available ? 'Disponible' : 'Bloqué'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingSlot(slot)}
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
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau créneau</DialogTitle>
          </DialogHeader>
          <SimpleTimeSlotForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le créneau</DialogTitle>
          </DialogHeader>
          {editingSlot && (
            <SimpleTimeSlotForm
              initialData={editingSlot}
              onSubmit={handleEdit}
              onCancel={() => setEditingSlot(null)}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le créneau"
        description="Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est irréversible."
      />
    </div>
  );
};

export default SimpleTimeSlotList;
