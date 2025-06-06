
import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TimeSlot } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TimeSlotForm from './TimeSlotForm';
import DeleteConfirmation from './DeleteConfirmation';
import './fullcalendar.css';

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
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const calendarRef = useRef<FullCalendar>(null);

  // Convert time slots to FullCalendar events
  const events = timeSlots.map(slot => {
    let eventDate: string;
    
    if (slot.is_recurring && slot.specific_date) {
      // For recurring slots, use the specific_date as base
      eventDate = slot.specific_date;
    } else if (slot.specific_date) {
      // For specific date slots
      eventDate = slot.specific_date;
    } else {
      // Fallback to today for display
      eventDate = new Date().toISOString().split('T')[0];
    }

    return {
      id: slot.id,
      title: `${slot.startTime} - ${slot.endTime}`,
      start: `${eventDate}T${slot.startTime}`,
      end: `${eventDate}T${slot.endTime}`,
      backgroundColor: slot.available ? '#10b981' : '#ef4444',
      borderColor: slot.available ? '#059669' : '#dc2626',
      textColor: '#ffffff',
      extendedProps: {
        timeSlot: slot,
        isRecurring: slot.is_recurring
      }
    };
  });

  const handleDateSelect = (selectInfo: any) => {
    const selectedDate = selectInfo.startStr.split('T')[0];
    const startTime = selectInfo.start.toTimeString().slice(0, 5);
    const endTime = selectInfo.end.toTimeString().slice(0, 5);
    
    setSelectedDate(selectedDate);
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setIsCreateDialogOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const timeSlot = clickInfo.event.extendedProps.timeSlot;
    setSelectedTimeSlot(timeSlot);
    setIsEditDialogOpen(true);
  };

  const handleCreateSubmit = async (timeSlot: TimeSlot) => {
    const newTimeSlot = {
      ...timeSlot,
      specific_date: selectedDate || timeSlot.specific_date,
      startTime: selectedStartTime || timeSlot.startTime,
      endTime: selectedEndTime || timeSlot.endTime
    };
    await onCreate(newTimeSlot);
    setIsCreateDialogOpen(false);
    setSelectedDate('');
    setSelectedStartTime('');
    setSelectedEndTime('');
  };

  const handleEditSubmit = async (timeSlot: TimeSlot) => {
    await onEdit(timeSlot);
    setIsEditDialogOpen(false);
    setSelectedTimeSlot(null);
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

      <div className="bg-white rounded-lg border p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="600px"
          locale="fr"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '09:00',
            endTime: '18:00'
          }}
          nowIndicator={true}
          editable={false}
          eventResizableFromStart={false}
          eventDurationEditable={false}
        />
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
              day_of_week: selectedDate ? new Date(selectedDate).getDay() : 1,
              startTime: selectedStartTime || "09:00",
              endTime: selectedEndTime || "10:00",
              available: true,
              is_recurring: false,
              specific_date: selectedDate || new Date().toISOString().split('T')[0]
            }}
            onSubmit={handleCreateSubmit}
            onCancel={() => {
              setIsCreateDialogOpen(false);
              setSelectedDate('');
              setSelectedStartTime('');
              setSelectedEndTime('');
            }}
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
