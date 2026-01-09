import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseDB } from '../../lib/supabaseDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { userid } = req.headers;

  if (!userid) {
    return res.status(401).json({ error: 'User ID required in headers' });
  }

  try {
    switch (method) {
      case 'POST':
        const { slotId } = req.body;
        
        if (!slotId) {
          return res.status(400).json({ error: 'Slot ID required' });
        }

        const clientInfo = await supabaseDB.getClientInfo(userid as string);
        if (!clientInfo || clientInfo.sessions_left <= 0) {
          return res.status(400).json({ 
            error: 'No sessions left',
            message: 'You have used all your sessions. Please purchase more to continue.'
          });
        }

        const bookedSlot = await supabaseDB.bookSlot(userid as string, slotId);
        if (!bookedSlot) {
          return res.status(400).json({ 
            error: 'Cannot book slot',
            message: 'Slot is not available or already booked'
          });
        }

        return res.status(200).json({ 
          message: 'Booking confirmed',
          slot: bookedSlot,
          clientInfo: await supabaseDB.getClientInfo(userid as string)
        });

      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Book API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}