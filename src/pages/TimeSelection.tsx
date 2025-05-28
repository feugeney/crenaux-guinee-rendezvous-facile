import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { addDays, format, isSameDay, setHours, setMinutes, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, CalendarIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TimeSlot } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AvailableDateSlot {
  date: string;
  timeSlots: string[];
}

const TimeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { formData } = location.state || {};

  // Today + 1 day as the minimum date
  const minDate = addDays(new Date(), 1);
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [isPriority, setIsPriority] = useState<boolean>(false);
  const [availableDates, setAvailableDates] = useState<AvailableDateSlot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Available time slots for selected date
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  
  // Check if the user came from strategic consultation form
  useEffect(() => {
    if (!formData) {
      // If there's no form data, redirect to the strategic consultation form
      toast({
        title: "Information requise",
        description: "Veuillez d'abord remplir le formulaire de bilan stratégique.",
        variant: "destructive",
      });
      navigate("/strategic-consultation");
    }
  }, [formData, navigate, toast]);

  // Fetch available dates and time slots
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        setIsLoading(true);
        
        // Get time slots from database
        const { data: timeSlotData, error } = await supabase
          .from('time_slots')
          .select('*')
          .eq('available', true)
          .order('day_of_week', { ascending: true });
          
        if (error) throw error;
        
        // Create a map of day of week to available time slots
        const weekdayMap = new Map<number, string[]>();
        
        timeSlotData.forEach((slot: any) => {
          if (!weekdayMap.has(slot.day_of_week)) {
            weekdayMap.set(slot.day_of_week, []);
          }
          weekdayMap.get(slot.day_of_week)?.push(slot.start_time);
        });
        
        // Generate available dates for the next 2 months
        const today = new Date();
        const availableDateSlots: AvailableDateSlot[] = [];
        
        for (let i = 1; i <= 60; i++) {
          const currentDate = addDays(today, i);
          const dayOfWeek = currentDate.getDay();
          
          if (weekdayMap.has(dayOfWeek)) {
            availableDateSlots.push({
              date: format(currentDate, 'yyyy-MM-dd'),
              timeSlots: weekdayMap.get(dayOfWeek) || []
            });
          }
        }
        
        setAvailableDates(availableDateSlots);
      } catch (err) {
        console.error('Error fetching available dates:', err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les dates disponibles",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailableDates();
  }, [toast]);

  // Update available time slots when date is selected
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const selectedDateSlot = availableDates.find(slot => slot.date === formattedDate);
      
      if (selectedDateSlot) {
        setTimeSlots(selectedDateSlot.timeSlots);
      } else {
        setTimeSlots([]);
      }
      
      // Reset time selection when date changes
      setTime("");
    }
  }, [date, availableDates]);

  const handleContinue = async () => {
    // For priority bookings, date and time are optional but still allowed to be selected
    if (isPriority) {
      let selectedDate = date ? format(date, 'yyyy-MM-dd') : format(addDays(new Date(), 2), 'yyyy-MM-dd');
      const completeData = {
        ...formData,
        date: selectedDate,
        time: time || "09:00",
        isPriority: true
      };
      
      try {
        // Save priority booking directly to the database
        const { data, error } = await supabase
          .from('bookings')
          .insert([{
            topic: completeData.consultationTopic || 'Bilan Stratégique',
            date: completeData.date,
            start_time: completeData.time,
            end_time: `${parseInt(completeData.time.split(':')[0]) + 1}:${completeData.time.split(':')[1]}`,
            payment_status: 'pending',
            message: completeData.whyDomani || '',
            is_priority: true
          }]);
          
        if (error) throw error;
        
        // Continue to booking confirmation
        navigate('/booking-confirmation', {
          state: {
            formData: completeData
          }
        });
        
      } catch (err) {
        console.error('Error saving priority booking:', err);
        // Continue anyway to booking confirmation even if there's an error
        navigate('/booking-confirmation', {
          state: {
            formData: completeData
          }
        });
      }
    } else {
      // For regular bookings, date and time are required
      if (!date || !time) {
        toast({
          title: "Champs requis",
          description: "Veuillez sélectionner une date et une heure pour votre rendez-vous.",
          variant: "destructive",
        });
        return;
      }

      // Format the date to YYYY-MM-DD format for consistency
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Combine the form data with the selected date and time
      const completeData = {
        ...formData,
        date: formattedDate,
        time: time,
        isPriority: false
      };

      // Navigate to booking confirmation with the complete data
      navigate("/booking-confirmation", { state: { formData: completeData } });
    }
  };

  // Create a list of available dates for the calendar
  const availableDatesList = availableDates.map(slot => parseISO(slot.date));

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Sélectionnez une date et heure
      </h1>

      {formData && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Planifiez votre rendez-vous</CardTitle>
            <CardDescription>
              Veuillez choisir une date et une heure pour votre séance de consultation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <p>Chargement des disponibilités...</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Sélectionnez une date:</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="priority"
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        checked={isPriority}
                        onChange={(e) => setIsPriority(e.target.checked)}
                      />
                      <label htmlFor="priority" className="text-sm font-medium text-gray-700">
                        Je souhaite un RDV prioritaire express sous 48h (350 $ USD)
                      </label>
                    </div>
                  </div>
                  
                  {/* Always show calendar regardless of priority selection */}
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={fr}
                      disabled={(date) => {
                        // If priority booking, enable dates at least 2 days in the future
                        if (isPriority) {
                          const minPriorityDate = addDays(new Date(), 2); // At least 48h in the future
                          return date < minPriorityDate;
                        }
                        // Otherwise only allow dates that are in our available list
                        const formatted = format(date, 'yyyy-MM-dd');
                        const isAvailable = availableDates.some(slot => slot.date === formatted);
                        return date < minDate || !isAvailable;
                      }}
                      className="rounded-md border shadow pointer-events-auto"
                    />
                  </div>
                </div>

                {date && timeSlots.length > 0 && !isPriority && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Sélectionnez une heure:</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          className={`py-2 px-3 rounded-md border text-center ${
                            time === slot
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setTime(slot)}
                        >
                          {slot.substring(0, 5)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {isPriority && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Heure souhaitée (optionnelle):</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map((slot) => (
                        <button
                          key={slot}
                          className={`py-2 px-3 rounded-md border text-center ${
                            time === slot
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <div className="bg-amber-50 p-4 rounded-md">
                      <p className="text-amber-800 text-sm">
                        <span className="font-semibold">Rendez-vous prioritaire:</span> Votre demande sera traitée directement dans les 48h. Vous pouvez suggérer une date et une heure, mais notre équipe vous contactera pour confirmer la disponibilité exacte.
                      </p>
                    </div>
                  </div>
                )}

                {availableDates.length === 0 && !isPriority && (
                  <Alert variant="destructive" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>
                      Aucune date disponible pour le moment. Veuillez sélectionner l'option de rendez-vous prioritaire ou réessayer plus tard.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-800 text-sm">
                    <span className="font-semibold">Note:</span> Cette réservation est pour une session de 30 minutes.
                    {isPriority && " Avec l'option prioritaire, votre rendez-vous sera programmé dans les 48h."}
                  </p>
                </div>

                {isPriority && (
                  <div className="bg-amber-50 p-4 rounded-md">
                    <p className="text-amber-800 text-sm">
                      <span className="font-semibold">Rendez-vous prioritaire:</span> Vous avez sélectionné l'option prioritaire qui garantit une consultation dans les 48h. Le tarif pour cette option est de 350 $ USD.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Retour
            </Button>
            <Button 
              onClick={handleContinue} 
              disabled={isLoading || (!isPriority && (!date || !time))}>
              Continuer
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TimeSelection;
