# Booking Backend API

Next.js REST API backend for the booking system with in-memory database.

## Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Slots Management

**GET /api/slots**
- Get all slots or filter by date
- Query params: `date` (optional, format: YYYY-MM-DD)

**POST /api/slots**
- Create new availability slots
- Body: `{ date, startTime, endTime, sessionName, repeatSessions?, selectedDates? }`

**DELETE /api/slots?id={slotId}**
- Delete a specific slot

### Booking

**POST /api/book**
- Book an available slot
- Body: `{ slotId }`

### Client Info

**GET /api/client**
- Get client information and sessions left

**PUT /api/client**
- Update client sessions
- Body: `{ sessionsLeft }`

## Data Structure

```typescript
interface TimeSlot {
  id: string;
  date: string; // "2025-02-06"
  startTime: string; // "11:00 AM"
  endTime: string; // "11:45 AM"
  status: 'Open' | 'Booked' | 'Closed';
  sessionName: string;
  createdAt: string;
}

interface ClientInfo {
  name: string;
  sessionsLeft: number;
  expiryDate: string;
}
``` 
