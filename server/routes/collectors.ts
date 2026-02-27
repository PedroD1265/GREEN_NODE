import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/collectors', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const collectors = db.prepare('SELECT * FROM collectors').all() as any[];
    res.json(collectors.map(formatCollector));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/collectors/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const db = getDb();
    const c = db.prepare('SELECT * FROM collectors WHERE id = ?').get(req.params.id) as any;
    if (!c) {
      res.status(404).json({ error: 'Collector not found' });
      return;
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (req.body.autoAccept !== undefined) {
      updates.push('autoAccept = ?');
      params.push(req.body.autoAccept ? 1 : 0);
    }
    if (req.body.zone !== undefined) {
      updates.push('zone = ?');
      params.push(req.body.zone);
    }
    if (req.body.rating !== undefined) {
      updates.push('rating = ?');
      params.push(req.body.rating);
    }
    if (req.body.materialsAccepted !== undefined) {
      updates.push('materialsAcceptedJson = ?');
      params.push(JSON.stringify(req.body.materialsAccepted));
    }
    if (req.body.tariffs !== undefined) {
      updates.push('tariffsJson = ?');
      params.push(JSON.stringify(req.body.tariffs));
    }
    if (req.body.pickupWindows !== undefined) {
      updates.push('windowsJson = ?');
      params.push(JSON.stringify(req.body.pickupWindows));
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(req.params.id);
    db.prepare(`UPDATE collectors SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM collectors WHERE id = ?').get(req.params.id) as any;
    res.json(formatCollector(updated));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

function formatCollector(c: any) {
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    verified: !!c.verified,
    rating: c.rating,
    completedPickups: c.completedPickups,
    autoAccept: !!c.autoAccept,
    zone: c.zone,
    materialsAccepted: JSON.parse(c.materialsAcceptedJson || '[]'),
    tariffs: JSON.parse(c.tariffsJson || '{}'),
    pickupWindows: JSON.parse(c.windowsJson || '[]'),
  };
}

export default router;
