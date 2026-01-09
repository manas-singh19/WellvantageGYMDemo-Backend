import { NextApiRequest, NextApiResponse } from 'next';
import { fileDB, TimeSlot } from '../../lib/fileDB';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  console.log('Headers received:', req.headers);
  const { userid } = req.headers;

  if (!userid) {
    return res.status(401).json({ error: 'User ID required in headers' });
  }

  switch (method) {
    case 'GET':
      const { date } = query;
      const slots = date ? fileDB.getSlotsByDate(userid as string, date as string) : fileDB.getSlots(userid as string);
      const availableSlots = slots.filter(slot => slot.status === 'Open').length;
      return res.status(200).json({ slots, availableSlots });

    case 'POST':
      const { date: slotDate, startTime, endTime, sessionName, repeatSessions, selectedDates } = req.body;
      
      if (!slotDate || !startTime || !endTime || !sessionName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const datesToCreate = repeatSessions && selectedDates?.length > 0 ? selectedDates : [slotDate];
      const createdSlots: TimeSlot[] = [];

      datesToCreate.forEach((date: string) => {
        const newSlot = {
          id: `${Date.now()}-${Math.random()}`,
          date,
          startTime,
          endTime,
          status: 'Open' as const,
          sessionName,
          createdAt: new Date().toISOString(),
        };
        createdSlots.push(fileDB.addSlot(userid as string, newSlot));
      });

      return res.status(201).json({ slots: createdSlots });

    case 'DELETE':
      const { id } = query;
      if (!id) {
        return res.status(400).json({ error: 'Slot ID required' });
      }
      
      const deleted = fileDB.deleteSlot(userid as string, id as string);
      if (!deleted) {
        return res.status(404).json({ error: 'Slot not found' });
      }
      
      return res.status(200).json({ message: 'Slot deleted' });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}