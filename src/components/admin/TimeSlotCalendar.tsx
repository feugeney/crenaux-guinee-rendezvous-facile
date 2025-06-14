
import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr.js';
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

function toYMD(dateVal: string | Date | null | undefined): string | null {
  if (!dateVal) return null;
  if (typeof dateVal === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateVal)) return dateVal;
    const parsed = new Date(dateVal);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    return dateVal;
  }
  if (dateVal instanceof Date) {
    return dateVal.toISOString().split('T')[0];
  }
  return null;
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

  const handleCreateSubmit = async (timeSlotData: TimeSlot) => {
    const formattedDate = toYMD(timeSlotData.specific_date);

    const dataToSubmit = {
      ...timeSlotData,
      specific_date: formattedDate,
    };
    await onCreate(dataToSubmit);
    setIsCreateDialogOpen(false);
  };

  const handleEditSubmit = async (timeSlotData: TimeSlot) => {
    const formattedDate = toYMD(timeSlotData.specific_date);

    const dataToSubmit = {
      ...timeSlotData,
      specific_date: formattedDate,
    };
    await onEdit(dataToSubmit);
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

  const calendarEvents = useMemo(() => {
    return timeSlots.map((slot) => {
      const event: any = {
        id: slot.id,
        title: slot.available ? 'Disponible' : 'Bloqué',
        allDay: false,
        extendedProps: { ...slot },
        className: slot.available ? 'available' : 'unavailable',
      };
      if (slot.is_recurring) {
        event.daysOfWeek = [slot.day_of_week];
        event.startTime = slot.start_time;
        event.endTime = slot.end_time;
      } else if (slot.specific_date) {
        event.start = `${slot.specific_date}T${slot.start_time}`;
        event.end = `${slot.specific_date}T${slot.end_time}`;
      }
      return event;
    });
  }, [timeSlots]);

  const handleEventClick = (clickInfo: any) => {
    const slot = clickInfo.event.extendedProps as TimeSlot;
    const preparedSlot = {
      ...slot,
      specific_date: slot.specific_date || new Date().toISOString().split('T')[0],
    };
    handleEditClick(preparedSlot);
  };
  
  const handleDateClick = (arg: any) => {
    console.log("Date clicked:", arg.dateStr);
    const newSlotInitialData: TimeSlot = {
      id: "",
      day_of_week: new Date(arg.dateStr).getDay(),
      start_time: "09:00",
      end_time: "10:00",
      available: true,
      is_recurring: false,
      specific_date: arg.dateStr.split('T')[0],
      created_at: "",
      updated_at: ""
    };
    console.log("Suggested new slot data:", newSlotInitialData);
    setIsCreateDialogOpen(true);
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Calendrier des créneaux</h3>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90 text-white">
          Ajouter un créneau
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={calendarEvents}
          locale={frLocale}
          editable={false}
          selectable={true}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          contentHeight="auto"
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator={true}
        />
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouveau créneau</DialogTitle>
          </DialogHeader>
          <TimeSlotForm
            initialData={{
              id: "", 
              day_of_week: 1,
              start_time: "09:00",
              end_time: "10:00",
              available: true,
              is_recurring: false,
              specific_date: new Date().toISOString().split('T')[0],
              created_at: "",
              updated_at: ""
            }}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateDialogOpen(false)}
            isEditing={false}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        setIsEditDialogOpen(isOpen);
        if (!isOpen) setSelectedTimeSlot(null);
      }}>
        <DialogContent className="max-w-md">
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
              <div className="flex justify-end pt-4 border-t mt-4">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Supprimer ce créneau"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
