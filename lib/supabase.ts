import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface TimeSlot {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'Open' | 'Booked' | 'Closed';
  session_name: string;
  created_at: string;
}

export interface ClientInfo {
  id: string;
  user_id: string;
  name: string;
  email: string;
  sessions_left: number;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}