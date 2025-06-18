
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TimeSlotForm } from './time-slots/TimeSlotForm';
import { TimeSlotList } from './time-slots/TimeSlotList';
import { useTimeSlotManagement } from './time-slots/useTimeSlotManagement';

export const TimeSlotManagement = () => {
  const {
    timeSlots,
    loading,
    showForm,
    setShowForm,
    editingSlot,
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
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel
  } = useTimeSlotManagement();

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des créneaux</h1>
          <p className="text-gray-600">Gérez les créneaux disponibles pour les réservations</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gold-600 hover:bg-gold-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un créneau
        </Button>
      </div>

      {showForm && (
        <TimeSlotForm
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          isRecurring={isRecurring}
          setIsRecurring={setIsRecurring}
          available={available}
          setAvailable={setAvailable}
          editingSlot={editingSlot}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <TimeSlotList
        timeSlots={timeSlots}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
