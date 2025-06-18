export interface Booking {
  id: string;
  user_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  message?: string;
  payment_status: string;
  payment_method?: string;
  payment_link?: string;
  stripe_session_id?: string;
  amount?: number;
  is_priority?: boolean;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  email?: string;
}

export interface UserData {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  profession?: string;
  age?: number;
  address?: string;
  isPriority?: boolean;
}

export interface BookingWithUserData {
  booking: Booking;
  userData?: UserData;
}

export interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  available: boolean;
  is_blocked?: boolean;
  is_recurring: boolean;
  specific_date?: string;
  created_at: string;
  updated_at: string;
  // Legacy compatibility
  startTime?: string;
  endTime?: string;
  day?: string;
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}

export interface Coach {
  name: string;
  speciality: string;
  imageUrl: string;
}

export interface BookingData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  date?: string;
  timeSlot?: TimeSlot;
  topic?: string;
  message?: string;
  notes?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  isPriority?: boolean;
  reason?: string;
}

export type PaymentMethod = 'visa' | 'mobile_money' | 'stripe';
