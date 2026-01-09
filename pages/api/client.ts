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
      case 'GET':
        const clientInfo = await supabaseDB.getClientInfo(userid as string);
        return res.status(200).json({ clientInfo });

      case 'PUT':
        const { sessions_left } = req.body;
        
        if (typeof sessions_left !== 'number') {
          return res.status(400).json({ error: 'Sessions count must be a number' });
        }

        const updatedClient = await supabaseDB.updateClientInfo(userid as string, { sessions_left });
        return res.status(200).json({ clientInfo: updatedClient });

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Client API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}