
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { TimeSlot } from '@/types';
import RegularBookingForm from '@/components/booking/RegularBookingForm';
import PriorityBookingForm from '@/components/booking/PriorityBookingForm';
import LoadingIndicator from '@/components/booking/LoadingIndicator';
import { scheduleData } from '@/lib/data';
import { format, addDays } from 'date-fns';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPriority, setIsPriority] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isRegularBooking, setIsRegularBooking] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);

  // Priority booking form state
  const [customDate, setCustomDate] = useState<string>('');
  const [customTime, setCustomTime] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const priorityParam = params.get('priority');
    setIsPriority(priorityParam === 'true');
    setLoading(false);
  }, [location.search]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Clear previously selected time slot
  };

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (selectedDate) {
        try {
          setLoading(true);
          const formattedDate = selectedDate.split('T')[0];
          const { data, error } = await supabase
            .from('time_slots')
            .select('*')
            .or(`and(is_recurring.eq.true,day_of_week.eq.${new Date(formattedDate).getDay()}),and(is_recurring.eq.false,specific_date.eq.${formattedDate})`)
            .eq('available', true)
            .order('start_time', { ascending: true });

          if (error) {
            console.error('Error fetching available time slots:', error);
            setSubmissionError('Failed to load time slots. Please try again.');
            setLoading(false);
            return;
          }

          setTimeSlots(data as TimeSlot[]);
          setLoading(false);
        } catch (error) {
          console.error('Unexpected error fetching time slots:', error);
          setSubmissionError('An unexpected error occurred. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchAvailableTimeSlots();
  }, [selectedDate]);

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const handleContinue = () => {
    if (selectedTimeSlot && selectedDate) {
      navigate('/time-selection', {
        state: {
          selectedDate,
          selectedTimeSlot
        }
      });
    }
  };

  const handlePriorityContinue = () => {
    if (customDate && customTime && customReason) {
      // Handle priority booking submission
      navigate('/time-selection', {
        state: {
          selectedDate: customDate,
          customTime,
          customReason,
          isPriority: true
        }
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-4">Réserver une consultation</h1>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {isPriority ? (
              <PriorityBookingForm
                customDate={customDate}
                setCustomDate={setCustomDate}
                customTime={customTime}
                setCustomTime={setCustomTime}
                customReason={customReason}
                setCustomReason={setCustomReason}
                handleContinue={handlePriorityContinue}
              />
            ) : (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
