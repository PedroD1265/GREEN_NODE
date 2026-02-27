import { Router, Request, Response } from 'express';
import { getDb } from '../db';

const router = Router();

router.get('/centers', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const centers = db.prepare('SELECT * FROM centers').all() as any[];
    res.json(centers.map(c => ({
      id: c.id,
      name: c.name,
      materialsAccepted: JSON.parse(c.materialsJson || '[]'),
      hours: c.hours,
      address: c.address,
      phone: c.phone,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
