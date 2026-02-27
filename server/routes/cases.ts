import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { getProviders } from '../providers';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getConfig } from '../config';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

function getUpload() {
  const config = getConfig();
  const tmpDir = path.join(config.uploadsDir, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  return multer({ dest: tmpDir });
}

router.post('/cases', requireAuth, (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { items, totalKg, incentive, scheduledTime, address, addressVisible, aiConfirmed, userLevel, userId, pin } = req.body;
    const id = `CASE-${Date.now()}`;
    const pin4 = pin || Math.floor(1000 + Math.random() * 9000).toString();

    db.prepare(`
      INSERT INTO cases (id, userId, collectorId, collectorName, status, materialsJson, totalKg, incentive, scheduleJson, addressJson, addressVisible, aiConfirmed, pin4, userLevel, createdAt)
      VALUES (?, ?, '', '', 'Pendiente', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId || 'user-me', JSON.stringify(items || []), totalKg || 0, incentive || 'Efectivo', JSON.stringify(scheduledTime || ''), JSON.stringify(address || ''), addressVisible ? 1 : 0, aiConfirmed ? 1 : 0, pin4, userLevel || 'Bronce', Date.now());

    const created = db.prepare('SELECT * FROM cases WHERE id = ?').get(id) as any;
    res.status(201).json(formatCase(created));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cases', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const userId = req.query.userId as string;
    const status = req.query.status as string;

    let query = 'SELECT * FROM cases';
    const conditions: string[] = [];
    const params: any[] = [];

    if (userId) {
      conditions.push('userId = ?');
      params.push(userId);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY createdAt DESC';

    const cases = db.prepare(query).all(...params) as any[];
    res.json(cases.map(formatCase));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cases/:id', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const c = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id) as any;
    if (!c) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }
    res.json(formatCase(c));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/cases/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const db = getDb();
    const c = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id) as any;
    if (!c) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (req.body.status !== undefined) {
      updates.push('status = ?');
      params.push(req.body.status);
    }
    if (req.body.collectorId !== undefined) {
      updates.push('collectorId = ?');
      params.push(req.body.collectorId);
    }
    if (req.body.collectorName !== undefined) {
      updates.push('collectorName = ?');
      params.push(req.body.collectorName);
    }
    if (req.body.addressVisible !== undefined) {
      updates.push('addressVisible = ?');
      params.push(req.body.addressVisible ? 1 : 0);
    }
    if (req.body.address !== undefined) {
      updates.push('addressJson = ?');
      params.push(JSON.stringify(req.body.address));
    }
    if (req.body.payoutBs !== undefined) {
      updates.push('payoutBs = ?');
      params.push(req.body.payoutBs);
    }
    if (req.body.pointsEarned !== undefined) {
      updates.push('pointsEarned = ?');
      params.push(req.body.pointsEarned);
    }
    if (req.body.aiConfirmed !== undefined) {
      updates.push('aiConfirmed = ?');
      params.push(req.body.aiConfirmed ? 1 : 0);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    params.push(req.params.id);
    db.prepare(`UPDATE cases SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id) as any;
    res.json(formatCase(updated));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cases/:id/evidence', requireAuth, (req, res, next) => { getUpload().single('file')(req, res, next); }, async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const c = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id) as any;
    if (!c) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const kind = (req.body.kind as string) || 'photo';
    const result = await getProviders().storage.uploadEvidence(req.file, { caseId: req.params.id, kind });
    const evidenceId = `ev-${Date.now()}`;

    db.prepare('INSERT INTO evidence (id, caseId, url, kind, createdAt) VALUES (?, ?, ?, ?, ?)').run(evidenceId, req.params.id, result.url, kind, Date.now());

    res.status(201).json({ id: evidenceId, url: result.url, kind });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/cases/:id/rate', requireAuth, (req: Request, res: Response) => {
  try {
    const db = getDb();
    const c = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id) as any;
    if (!c) {
      res.status(404).json({ error: 'Case not found' });
      return;
    }

    const { fromRole, stars, issues } = req.body;
    const ratingId = `rat-${Date.now()}`;

    db.prepare('INSERT INTO ratings (id, caseId, fromRole, stars, issuesJson, createdAt) VALUES (?, ?, ?, ?, ?, ?)').run(ratingId, req.params.id, fromRole || 'user', stars || 0, JSON.stringify(issues || []), Date.now());

    res.status(201).json({ id: ratingId, stars, issues });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

function formatCase(c: any) {
  return {
    id: c.id,
    userId: c.userId,
    collectorId: c.collectorId,
    collectorName: c.collectorName,
    status: c.status,
    items: JSON.parse(c.materialsJson || '[]'),
    totalKg: c.totalKg,
    incentive: c.incentive,
    scheduledTime: JSON.parse(c.scheduleJson || '""'),
    address: JSON.parse(c.addressJson || '""'),
    addressVisible: !!c.addressVisible,
    aiConfirmed: !!c.aiConfirmed,
    pin: c.pin4,
    userLevel: c.userLevel,
    payoutBs: c.payoutBs,
    pointsEarned: c.pointsEarned,
    createdAt: c.createdAt,
  };
}

export default router;
