
import React, { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import TimeSlot from '@/components/TimeSlot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TimeSlot as TimeSlotType, DaySchedule } from '@/types';
import { coachData } from '@/lib/data';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RegularBookingFormProps {
  scheduleData: DaySchedule[];
  selectedDate: string | null;
  selectedTimeSlot: TimeSlotType | null;
  setSelectedDate: (date: string) => void;
  setSelectedTimeSlot: (slot: TimeSlotType) => void;
  handleContinue: () => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
}

const RegularBookingForm: React.FC<RegularBookingFormProps> = ({
  scheduleData,
  selectedDate,
  selectedTimeSlot,
  setSelectedDate,
  setSelectedTimeSlot,
  handleContinue,
  showCalendar,
  setShowCalendar
}) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlotType[]>([]);
  
  useEffect(() => {
    if (selectedDate) {
      const dayData = scheduleData.find(day => day.date === selectedDate);
      if (dayData) {
        // Only show available slots
        setAvailableSlots(dayData.slots.filter(slot => slot.available));
      } else {
        setAvailableSlots([]);
      }
    }
  }, [selectedDate, scheduleData]);
  
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2">
        <Button 
          variant="outline"
          className="mb-4"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? "Masquer le calendrier" : "Afficher le calendrier"}
        </Button>
        
        {showCalendar && (
          <Calendar 
            scheduleData={scheduleData}
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        )}
        
        {selectedDate && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">A propos de votre coach</h3>
              <div className="flex items-center gap-4">
                <img 
                  src={coachData.imageUrl} 
                  alt={coachData.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{coachData.name}</p>
                  <p className="text-sm text-gray-600">{coachData.speciality}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="lg:w-1/2">
        {availableSlots.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Créneaux horaires disponibles</CardTitle>
                <CardDescription>
                  {selectedDate ? `Pour le ${format(new Date(selectedDate), 'dd MMMM yyyy', { locale: fr })}` : 
                    "Veuillez sélectionner une date pour voir les créneaux disponibles"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSlots.map(slot => (
                    <TimeSlot 
                      key={slot.id}
                      slot={slot}
                      isSelected={selectedTimeSlot?.id === slot.id}
                      onSelect={setSelectedTimeSlot}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleContinue}
                disabled={!selectedTimeSlot}
                className="bg-coaching-600 hover:bg-coaching-700"
              >
                Continuer
              </Button>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center text-gray-500">
              <p className="mb-2">Aucun créneau disponible pour la date sélectionnée</p>
              <p className="text-sm">Veuillez sélectionner une autre date ou opter pour un rendez-vous prioritaire</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegularBookingForm;
