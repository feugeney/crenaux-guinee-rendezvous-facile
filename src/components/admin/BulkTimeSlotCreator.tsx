
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";

const BulkTimeSlotCreator = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isCreatingSlots, setIsCreatingSlots] = useState(false);
  const [createRecurring, setCreateRecurring] = useState(false);
  const { toast } = useToast();

  const handleSelectMonth = (option: string) => {
    const today = new Date();
    let newStartDate: Date;
    let newEndDate: Date;

    if (option === "current") {
      newStartDate = startOfMonth(today);
      newEndDate = endOfMonth(today);
    } else if (option === "next") {
      const nextMonth = addMonths(today, 1);
      newStartDate = startOfMonth(nextMonth);
      newEndDate = endOfMonth(nextMonth);
    } else {
      return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    // Auto-select all dates in the range
    const daysInRange = eachDayOfInterval({ start: newStartDate, end: newEndDate });
    setSelectedDates(daysInRange);
  };

  const toggleDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setSelectedDates(prev => {
      const exists = prev.some(d => format(d, 'yyyy-MM-dd') === dateString);
      if (exists) {
        return prev.filter(d => format(d, 'yyyy-MM-dd') !== dateString);
      } else {
        return [...prev, date];
      }
    });
  };

  const createTimeSlots = async () => {
    if (selectedDates.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une date",
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
    
    try {
      setIsCreatingSlots(true);
      
      const timeSlots = selectedDates.map(date => ({
        day_of_week: date.getDay(),
        start_time: startTime,
        end_time: endTime,
        is_available: true,
        is_recurring: createRecurring,
        specific_date: format(date, 'yyyy-MM-dd')
      }));
      
      const { error } = await supabase
        .from('time_slots')
        .insert(timeSlots);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: `${timeSlots.length} créneaux créés avec succès`,
      });

      // Reset form
      setSelectedDates([]);
      setStartDate(undefined);
      setEndDate(undefined);

    } catch (error: any) {
      console.error("Error creating time slots:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création des créneaux",
        variant: "destructive"
      });
    } finally {
      setIsCreatingSlots(false);
    }
  };

  const availableDates = startDate && endDate 
    ? eachDayOfInterval({ start: startDate, end: endDate })
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer des créneaux en masse</CardTitle>
        <CardDescription>
          Créez plusieurs créneaux horaires pour des dates spécifiques
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="month-select">Sélectionner une période</Label>
          <Select onValueChange={handleSelectMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Mois en cours</SelectItem>
              <SelectItem value="next">Mois prochain</SelectItem>
              <SelectItem value="custom">Période personnalisée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            label="Date de début"
          />
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            label="Date de fin"
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
        
        {availableDates.length > 0 && (
          <div className="space-y-2">
            <Label>Dates sélectionnées ({selectedDates.length})</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
              {availableDates.map(date => {
                const isSelected = selectedDates.some(d => 
                  format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                );
                return (
                  <div key={format(date, 'yyyy-MM-dd')} className="flex items-center space-x-2">
                    <Checkbox
                      id={`date-${format(date, 'yyyy-MM-dd')}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleDate(date)}
                    />
                    <Label 
                      htmlFor={`date-${format(date, 'yyyy-MM-dd')}`} 
                      className="text-xs cursor-pointer"
                    >
                      {format(date, 'dd/MM', { locale: fr })}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="recurring"
            checked={createRecurring}
            onCheckedChange={(checked) => setCreateRecurring(checked as boolean)}
          />
          <Label htmlFor="recurring">
            Créer comme créneaux récurrents
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={createTimeSlots} 
          disabled={isCreatingSlots || selectedDates.length === 0}
          className="w-full"
        >
          {isCreatingSlots ? "Création en cours..." : `Créer ${selectedDates.length} créneau(x)`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkTimeSlotCreator;
