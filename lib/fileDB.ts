import fs from 'fs';
import path from 'path';

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
  email: string;
  sessionsLeft: number;
  expiryDate: string;
}

interface UserData {
  clientInfo: ClientInfo;
  slots: TimeSlot[];
}

class FileDB {
  private dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');

  private getUserFilePath(userId: string): string {
    return path.join(this.dataDir, `${userId}.json`);
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private getUserData(userId: string): UserData {
    this.ensureDataDir();
    const filePath = this.getUserFilePath(userId);
    
    if (!fs.existsSync(filePath)) {
      const defaultData: UserData = {
        clientInfo: {
          name: 'Guest User',
          email: '',
          sessionsLeft: 20,
          expiryDate: '24 June 2026',
        },
        slots: []
      };
      this.saveUserData(userId, defaultData);
      return defaultData;
    }
    
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  private saveUserData(userId: string, data: UserData): void {
    this.ensureDataDir();
    const filePath = this.getUserFilePath(userId);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  getSlots(userId: string): TimeSlot[] {
    return this.getUserData(userId).slots;
  }

  getSlotsByDate(userId: string, date: string): TimeSlot[] {
    return this.getSlots(userId).filter(slot => slot.date === date);
  }

  addSlot(userId: string, slot: TimeSlot): TimeSlot {
    const userData = this.getUserData(userId);
    userData.slots.push(slot);
    this.saveUserData(userId, userData);
    return slot;
  }

  deleteSlot(userId: string, id: string): boolean {
    const userData = this.getUserData(userId);
    const index = userData.slots.findIndex(slot => slot.id === id);
    if (index > -1) {
      userData.slots.splice(index, 1);
      this.saveUserData(userId, userData);
      return true;
    }
    return false;
  }

  bookSlot(userId: string, id: string): TimeSlot | null {
    const userData = this.getUserData(userId);
    const slot = userData.slots.find(s => s.id === id);
    if (slot && slot.status === 'Open' && userData.clientInfo.sessionsLeft > 0) {
      slot.status = 'Booked';
      userData.clientInfo.sessionsLeft--;
      this.saveUserData(userId, userData);
      return slot;
    }
    return null;
  }

  getClientInfo(userId: string): ClientInfo {
    return this.getUserData(userId).clientInfo;
  }

  updateClientInfo(userId: string, clientInfo: Partial<ClientInfo>): ClientInfo {
    const userData = this.getUserData(userId);
    userData.clientInfo = { ...userData.clientInfo, ...clientInfo };
    this.saveUserData(userId, userData);
    return userData.clientInfo;
  }
}

export const fileDB = new FileDB();