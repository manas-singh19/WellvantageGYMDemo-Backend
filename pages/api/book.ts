import { NextApiRequest, NextApiResponse } from 'next';
import { fileDB } from '../../lib/fileDB';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { userid } = req.headers;

  if (!userid) {
    return res.status(401).json({ error: 'User ID required in headers' });
  }

  switch (method) {
    case 'POST':
      const { slotId } = req.body;
      
      if (!slotId) {
        return res.status(400).json({ error: 'Slot ID required' });
      }

      const clientInfo = fileDB.getClientInfo(userid as string);
      if (clientInfo.sessionsLeft <= 0) {
        return res.status(400).json({ 
          error: 'No sessions left',
          message: 'You have used all your sessions. Please purchase more to continue.'
        });
      }

      const bookedSlot = fileDB.bookSlot(userid as string, slotId);
      if (!bookedSlot) {
        return res.status(400).json({ 
          error: 'Cannot book slot',
          message: 'Slot is not available or already booked'
        });
      }

      return res.status(200).json({ 
        message: 'Booking confirmed',
        slot: bookedSlot,
        clientInfo: fileDB.getClientInfo(userid as string)
      });

    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}