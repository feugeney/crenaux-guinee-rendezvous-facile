
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { createTimeSlot } from "@/services/timeSlotService";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeSlot } from "@/types";

const BulkTimeSlotCreator = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [isCreatingSlots, setIsCreatingSlots] = useState(false);
  const [createRecurring, setCreateRecurring] = useState(false);
  const { toast } = useToast();

  const handleCreateTimeSlot = async () => {
    console.log("Tentative de création de créneau...");
    
    if (!selectedDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une date",
        variant: "destructive"
      });
      return;
    }

    if (startTime === endTime) {
      toast({
        title: "Erreur",
        description: "Les heures de début et de fin doivent être différentes",
        variant: "destructive"
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: "Erreur",
        description: "L'heure de début doit être antérieure à l'heure de fin",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCreatingSlots(true);
      
      const timeSlotData: Partial<TimeSlot> = {
        day_of_week: selectedDate.getDay(),
        start_time: startTime,
        end_time: endTime,
        available: true,
        is_blocked: false,
        is_recurring: createRecurring,
        specific_date: createRecurring ? undefined : format(selectedDate, 'yyyy-MM-dd')
      };
      
      console.log("Données du créneau à créer:", timeSlotData);
      
      const result = await createTimeSlot(timeSlotData as TimeSlot);
      
      console.log("Créneau créé avec succès:", result);
      
      toast({
        title: "Succès",
        description: `Créneau créé avec succès pour le ${format(selectedDate, 'PPP', { locale: fr })} de ${startTime} à ${endTime}`,
      });

      // Reset form
      setSelectedDate(undefined);
      setStartTime("09:00");
      setEndTime("10:00");
      setCreateRecurring(false);

    } catch (error: any) {
      console.error("Erreur lors de la création du créneau:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création du créneau",
        variant: "destructive"
      });
    } finally {
      setIsCreatingSlots(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouveau créneau</CardTitle>
        <CardDescription>
          Créez un créneau horaire pour une date spécifique ou récurrent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Date du créneau</Label>
          <DatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            label=""
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TimePicker
            value={startTime}
            onChange={setStartTime}
            label="Heure de début"
          />
          <TimePicker
            value={endTime}
            onChange={setEndTime}
            label="Heure de fin"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="recurring"
            checked={createRecurring}
            onCheckedChange={(checked) => setCreateRecurring(checked as boolean)}
          />
          <Label htmlFor="recurring">
            Créer comme créneau récurrent (se répète chaque semaine)
          </Label>
        </div>

        {selectedDate && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Créneau sélectionné :</strong> {format(selectedDate, 'PPP', { locale: fr })} de {startTime} à {endTime}
              {createRecurring && ' (récurrent chaque semaine)'}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateTimeSlot} 
          disabled={isCreatingSlots || !selectedDate}
          className="w-full"
        >
          {isCreatingSlots ? "Création en cours..." : "Créer le créneau"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkTimeSlotCreator;
