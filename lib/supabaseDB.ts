import { supabase, TimeSlot, ClientInfo } from './supabase';

export class SupabaseDB {
  // Slots operations
  async getSlots(userId: string): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async getSlotsByDate(userId: string, date: string): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date);
    
    if (error) throw error;
    return data || [];
  }

  async addSlot(userId: string, slot: Omit<TimeSlot, 'user_id'>): Promise<TimeSlot> {
    const { data, error } = await supabase
      .from('time_slots')
      .insert({ ...slot, user_id: userId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteSlot(userId: string, id: string): Promise<boolean> {
    const { error } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    return !error;
  }

  async bookSlot(userId: string, id: string): Promise<TimeSlot | null> {
    const { data: clientData } = await supabase
      .from('client_info')
      .select('sessions_left')
      .eq('user_id', userId)
      .single();

    if (!clientData || clientData.sessions_left <= 0) return null;

    const { data, error } = await supabase
      .from('time_slots')
      .update({ status: 'Booked' })
      .eq('id', id)
      .eq('user_id', userId)
      .eq('status', 'Open')
      .select()
      .single();

    if (error || !data) return null;

    await supabase
      .from('client_info')
      .update({ sessions_left: clientData.sessions_left - 1 })
      .eq('user_id', userId);

    return data;
  }

  // Client operations
  async getClientInfo(userId: string): Promise<ClientInfo | null> {
    const { data, error } = await supabase
      .from('client_info')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createClientInfo(userId: string, clientInfo: Partial<ClientInfo>): Promise<ClientInfo> {
    const { data, error } = await supabase
      .from('client_info')
      .insert({
        user_id: userId,
        name: clientInfo.name || 'Guest User',
        email: clientInfo.email || '',
        sessions_left: clientInfo.sessions_left || 20,
        expiry_date: clientInfo.expiry_date || '2026-06-24',
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateClientInfo(userId: string, clientInfo: Partial<ClientInfo>): Promise<ClientInfo> {
    const { data, error } = await supabase
      .from('client_info')
      .update(clientInfo)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const supabaseDB = new SupabaseDB();