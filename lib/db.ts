export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Open' | 'Booked' | 'Closed';
  sessionName: string;
  createdAt: string;
}

export interface ClientInfo {
  name: string;
  sessionsLeft: number;
  expiryDate: string;
}

class InMemoryDB {
  private slots: TimeSlot[] = [
    {
      id: '1',
      date: '2025-02-06',
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      status: 'Open',
      sessionName: 'PT',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      date: '2025-02-06',
      startTime: '5:00 PM',
      endTime: '5:30 PM',
      status: 'Open',
      sessionName: 'PT',
      createdAt: new Date().toISOString(),
    },
  ];

  private clientInfo: ClientInfo = {
    name: 'Guest User',
    sessionsLeft: 20,
    expiryDate: '24 June 2026',
  };

  getSlots(): TimeSlot[] {
    return this.slots;
  }

  getSlotsByDate(date: string): TimeSlot[] {
    return this.slots.filter(slot => slot.date === date);
  }

  addSlot(slot: TimeSlot): TimeSlot {
    this.slots.push(slot);
    return slot;
  }

  deleteSlot(id: string): boolean {
    const index = this.slots.findIndex(slot => slot.id === id);
    if (index > -1) {
      this.slots.splice(index, 1);
      return true;
    }
    return false;
  }

  bookSlot(id: string): TimeSlot | null {
    const slot = this.slots.find(s => s.id === id);
    if (slot && slot.status === 'Open' && this.clientInfo.sessionsLeft > 0) {
      slot.status = 'Booked';
      this.clientInfo.sessionsLeft--;
      return slot;
    }
    return null;
  }

  getClientInfo(): ClientInfo {
    return this.clientInfo;
  }

  updateClientSessions(sessions: number): ClientInfo {
    this.clientInfo.sessionsLeft = Math.max(0, sessions);
    return this.clientInfo;
  }
}

export const db = new InMemoryDB();