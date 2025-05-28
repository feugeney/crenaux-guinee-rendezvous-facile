export interface TimeSlot {
  id: string;
  day_of_week: number;
  startTime: string;
  endTime: string;
  available: boolean;
  is_recurring?: boolean;
  specific_date?: string | null;
  day?: string;
}

export interface DaySchedule {
  date: string; // ISO format (YYYY-MM-DD)
  slots: TimeSlot[];
}

export interface BookingData {
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string; // Adding this for backward compatibility
  email: string;
  phone: string;
  date: string;
  timeSlot: TimeSlot;
  topic: string;
  notes?: string;
  message?: string; // Adding for backward compatibility
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod?: PaymentMethod;
  isPriority?: boolean; // Explicitly add isPriority flag to BookingData
}

export interface Coach {
  id: string;
  name: string;
  speciality: string;
  bio: string;
  imageUrl: string;
}

export type PaymentMethod = 'visa' | 'mobile_money' | 'stripe';

// Adding an interface for the Profile type to ensure consistency
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}
