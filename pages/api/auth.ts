import { NextApiRequest, NextApiResponse } from 'next';
import { fileDB } from '../../lib/fileDB';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const { email, name, uid } = req.body;
      
      if (!email || !name || !uid) {
        return res.status(400).json({ error: 'Missing required fields: email, name, uid' });
      }

      // Update or create user data
      const clientInfo = fileDB.updateClientInfo(uid, {
        name,
        email,
        sessionsLeft: fileDB.getClientInfo(uid).sessionsLeft || 20
      });

      return res.status(200).json({ 
        message: 'User authenticated',
        clientInfo,
        userId: uid
      });

    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}