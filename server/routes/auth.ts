import { Router, Request, Response } from 'express';
import { getProviders } from '../providers';
import { getDb } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!role || !['user', 'collector', 'admin'].includes(role)) {
      res.status(400).json({ error: 'Invalid role. Must be user, collector, or admin.' });
      return;
    }
    const result = await getProviders().auth.login(role);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get('/auth/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    const user = await getProviders().auth.verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.patch('/auth/points', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = getDb();
    const userId = req.user?.id;
    const { delta } = req.body;

    if (typeof delta !== 'number') {
      res.status(400).json({ error: 'delta (number) is required' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const newPoints = Math.max(0, user.points + delta);
    db.prepare('UPDATE users SET points = ? WHERE id = ?').run(newPoints, userId);

    res.json({ points: newPoints });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
