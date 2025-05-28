
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TimeSlot as TimeSlotType, DaySchedule } from '@/types';
import { generateScheduleData } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import BookingHeader from '@/components/booking/BookingHeader';
import RegularBookingForm from '@/components/booking/RegularBookingForm';
import PriorityBookingForm from '@/components/booking/PriorityBookingForm';

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotType | null>(null);
  const [bookingType, setBookingType] = useState<"regular" | "priority">("regular");
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  
  useEffect(() => {
    // Load schedule data
    const data = generateScheduleData();
    setScheduleData(data);
  }, []);
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  
  const handleTimeSlotSelect = (slot: TimeSlotType) => {
    setSelectedTimeSlot(slot);
  };
  
  const handleBookingTypeChange = (value: "regular" | "priority") => {
    setBookingType(value);
    if (value === "regular") {
      setShowCalendar(false);
    }
  };
  
  const handleContinue = () => {
    if (bookingType === "regular" && selectedDate && selectedTimeSlot) {
      navigate('/booking-confirmation', { 
        state: { 
          date: selectedDate, 
          timeSlot: selectedTimeSlot,
          isPriority: false 
        } 
      });
    } else if (bookingType === "priority") {
      if (!customDate || !customTime || !customReason) {
        toast({
          title: "Information manquante",
          description: "Veuillez remplir tous les champs pour le rendez-vous prioritaire",
          variant: "destructive",
        });
        return;
      }
      
      // Create a custom time slot for the priority booking
      const priorityTimeSlot: TimeSlotType = {
        id: `priority-${Date.now()}`,
        day_of_week: 0, // Default to Sunday, this will be calculated properly in production
        startTime: customTime,
        endTime: "", // Will be determined by the coach
        available: true
      };
      
      navigate('/booking-confirmation', { 
        state: { 
          date: customDate, 
          timeSlot: priorityTimeSlot,
          isPriority: true,
          reason: customReason
        } 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <BookingHeader 
            title="Réserver une séance de coaching" 
            subtitle="Sélectionnez une date et un créneau horaire disponible" 
          />
          
          <Tabs defaultValue="regular" onValueChange={(value) => handleBookingTypeChange(value as "regular" | "priority")}>
            <TabsList className="mb-6">
              <TabsTrigger value="regular" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Rendez-vous standard
              </TabsTrigger>
              <TabsTrigger value="priority" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Rendez-vous prioritaire (sous 48h)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="regular">
              <RegularBookingForm 
                scheduleData={scheduleData}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedDate={handleDateSelect}
                setSelectedTimeSlot={handleTimeSlotSelect}
                handleContinue={handleContinue}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
              />
            </TabsContent>
            
            <TabsContent value="priority">
              <PriorityBookingForm 
                customDate={customDate}
                setCustomDate={setCustomDate}
                customTime={customTime}
                setCustomTime={setCustomTime}
                customReason={customReason}
                setCustomReason={setCustomReason}
                handleContinue={handleContinue}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Booking;
