
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { addMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";

const daysOfWeek = [
  { id: 0, name: "Dimanche" },
  { id: 1, name: "Lundi" },
  { id: 2, name: "Mardi" },
  { id: 3, name: "Mercredi" },
  { id: 4, name: "Jeudi" },
  { id: 5, name: "Vendredi" },
  { id: 6, name: "Samedi" },
];

const BulkTimeSlotCreator = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("10:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Monday to Friday by default
  const [isCreatingSlots, setIsCreatingSlots] = useState(false);
  const [createRecurring, setCreateRecurring] = useState(true);
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
      // Custom range, use existing dates or defaults
      return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId) 
        : [...prev, dayId]
    );
  };

  const createTimeSlots = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une période",
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
      
      const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
      const filteredDays = daysInRange.filter(day => selectedDays.includes(day.getDay()));
      
      const timeSlots = filteredDays.map(day => ({
        day_of_week: day.getDay(),
        start_time: startTime,
        end_time: endTime,
        is_available: true,
        is_recurring: createRecurring,
        specific_date: !createRecurring ? format(day, 'yyyy-MM-dd') : null
      }));
      
      const { error } = await supabase
        .from('time_slots')
        .insert(timeSlots);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: `${timeSlots.length} créneaux créés avec succès`,
      });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer des créneaux en masse</CardTitle>
        <CardDescription>
          Créez plusieurs créneaux horaires simultanément pour une période donnée
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
        
        <div className="space-y-2">
          <Label>Jours de la semaine</Label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map(day => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day.id}`}
                  checked={selectedDays.includes(day.id)}
                  onCheckedChange={() => toggleDay(day.id)}
                />
                <Label htmlFor={`day-${day.id}`} className="text-sm">
                  {day.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="recurring"
            checked={createRecurring}
            onCheckedChange={(checked) => setCreateRecurring(checked as boolean)}
          />
          <Label htmlFor="recurring">
            Créer comme créneaux récurrents (se répètent chaque semaine)
          </Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={createTimeSlots} 
          disabled={isCreatingSlots}
          className="w-full"
        >
          {isCreatingSlots ? "Création en cours..." : "Créer les créneaux"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BulkTimeSlotCreator;
