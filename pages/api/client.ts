import { NextApiRequest, NextApiResponse } from 'next';
import { fileDB } from '../../lib/fileDB';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { userid } = req.headers;

  if (!userid) {
    return res.status(401).json({ error: 'User ID required in headers' });
  }

  switch (method) {
    case 'GET':
      const clientInfo = fileDB.getClientInfo(userid as string);
      return res.status(200).json({ clientInfo });

    case 'PUT':
      const { sessionsLeft } = req.body;
      
      if (typeof sessionsLeft !== 'number') {
        return res.status(400).json({ error: 'Sessions count must be a number' });
      }

      const updatedClient = fileDB.updateClientInfo(userid as string, { sessionsLeft });
      return res.status(200).json({ clientInfo: updatedClient });

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}