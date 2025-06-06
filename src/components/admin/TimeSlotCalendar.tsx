
import React, { useState } from 'react';
import { TimeSlot } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TimeSlotForm from './TimeSlotForm';
import DeleteConfirmation from './DeleteConfirmation';

interface TimeSlotCalendarProps {
  timeSlots: TimeSlot[];
  onEdit: (timeSlot: TimeSlot) => void;
  onDelete: (id: string) => Promise<void>;
  onCreate: (timeSlot: TimeSlot) => Promise<void>;
  loading?: boolean;
}

const TimeSlotCalendar: React.FC<TimeSlotCalendarProps> = ({
  timeSlots,
  onEdit,
  onDelete,
  onCreate,
  loading = false
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateSubmit = async (timeSlot: TimeSlot) => {
    await onCreate(timeSlot);
    setIsCreateDialogOpen(false);
  };

  const handleEditSubmit = async (timeSlot: TimeSlot) => {
    await onEdit(timeSlot);
    setIsEditDialogOpen(false);
    setSelectedTimeSlot(null);
  };

  const handleEditClick = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedTimeSlot) {
      setDeleteId(selectedTimeSlot.id);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      setIsDeleting(true);
      try {
        await onDelete(deleteId);
        setDeleteId(null);
        setSelectedTimeSlot(null);
      } finally {
        setIsDeleting(false);
      }
    }
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Calendrier des créneaux</h3>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Ajouter un créneau
        </Button>
      </div>

      {/* Temporary grid view until FullCalendar is properly installed */}
      <div className="bg-white rounded-lg border p-4">
        <div className="text-center text-gray-500 py-8">
          <p className="mb-4">Vue calendrier temporairement indisponible</p>
          <p className="text-sm">Installation des dépendances FullCalendar en cours...</p>
        </div>
        
        {/* Simple list view as fallback */}
        <div className="mt-6 space-y-2">
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <span className="font-medium">
                  {slot.specific_date} - {slot.startTime} à {slot.endTime}
                </span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  slot.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {slot.available ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(slot)}
              >
                Modifier
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau créneau</DialogTitle>
          </DialogHeader>
          <TimeSlotForm
            initialData={{
              id: "",
              day_of_week: 1,
              startTime: "09:00",
              endTime: "10:00",
              available: true,
              is_recurring: false,
              specific_date: new Date().toISOString().split('T')[0]
            }}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le créneau</DialogTitle>
          </DialogHeader>
          {selectedTimeSlot && (
            <div className="space-y-4">
              <TimeSlotForm
                timeSlot={selectedTimeSlot}
                onSubmit={handleEditSubmit}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedTimeSlot(null);
                }}
                isEditing={true}
              />
              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Supprimer ce créneau
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Supprimer le créneau"
        description="Êtes-vous sûr de vouloir supprimer ce créneau ? Cette action est irréversible."
      />
    </div>
  );
};

export default TimeSlotCalendar;
