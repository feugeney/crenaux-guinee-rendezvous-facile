
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Booking {
  id: string;
  customer_name?: string;
  email?: string;
  topic: string;
  date: string;
  start_time: string;
  end_time: string;
  payment_status: string;
  message?: string;
  created_at: string;
  is_priority: boolean;
}

interface UseBookingsOptions {
  selectedDate?: string | null;
}

export const useBookings = ({ selectedDate }: UseBookingsOptions = {}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_status', 'completed')
        .gte('date', today)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous à venir:', error);
      toast.error('Erreur lors du chargement des rendez-vous à venir');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterType('all');
    setSearchTerm('');
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.topic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || 
      (filterType === 'express' && booking.is_priority) ||
      (filterType === 'standard' && !booking.is_priority);

    const matchesDate = !selectedDate || booking.date === selectedDate;

    return matchesSearch && matchesFilter && matchesDate;
  });

  const stats = {
    total: filteredBookings.length,
    express: filteredBookings.filter(b => b.is_priority).length,
    standard: filteredBookings.filter(b => !b.is_priority).length
  };

  return {
    bookings: filteredBookings,
    loading,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    resetFilters,
    stats,
    isDateSelected: !!selectedDate
  };
};
