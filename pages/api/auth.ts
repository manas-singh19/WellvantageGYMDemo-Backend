import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseDB } from '../../lib/supabaseDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        const { email, name, uid } = req.body;
        
        if (!email || !name || !uid) {
          return res.status(400).json({ error: 'Missing required fields: email, name, uid' });
        }

        // Get or create user data
        let clientInfo = await supabaseDB.getClientInfo(uid);
        
        if (!clientInfo) {
          clientInfo = await supabaseDB.createClientInfo(uid, {
            name,
            email,
            sessions_left: 20
          });
        } else {
          clientInfo = await supabaseDB.updateClientInfo(uid, {
            name,
            email
          });
        }

        return res.status(200).json({ 
          message: 'User authenticated',
          clientInfo,
          userId: uid
        });

      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}