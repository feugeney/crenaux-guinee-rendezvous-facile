
export interface PaidApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  professional_profile: string;
  city_country: string;
  preferred_topic: string;
  status: string;
  created_at: string;
  payment_option: string;
  start_period: string;
  proposed_schedule: any;
  schedule_validated?: boolean;
  payment_link?: string;
}

export interface SessionSchedule {
  session_number: number;
  date: string;
  start_time: string;
  end_time: string;
  topic: string;
  completed?: boolean;
  notes?: string;
}
