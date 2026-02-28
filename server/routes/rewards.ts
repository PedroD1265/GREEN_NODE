import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/rewards', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const rewards = db.prepare('SELECT * FROM rewards').all() as any[];
    res.json(rewards.map(r => ({
      id: r.id,
      name: r.title,
      description: r.description,
      pointsCost: r.pointsCost,
      type: r.type,
      icon: r.icon,
      category: r.category,
    })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/rewards/redeem', requireAuth, (req: Request, res: Response) => {
  try {
    const db = getDb();
    const authReq = req as AuthenticatedRequest;
    const { rewardId } = req.body;
    // Use authenticated user ID, ignore userId from body
    const userId = authReq.user?.id;

    if (!userId || !rewardId) {
      res.status(400).json({ error: 'rewardId is required' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(rewardId) as any;
    if (!reward) {
      res.status(404).json({ error: 'Reward not found' });
      return;
    }

    if (user.points < reward.pointsCost) {
      res.status(400).json({ error: 'Insufficient points', required: reward.pointsCost, current: user.points });
      return;
    }

    const redemptionId = `red-${Date.now()}`;
    const newPoints = user.points - reward.pointsCost;

    const redeemTx = db.transaction(() => {
      db.prepare('UPDATE users SET points = ? WHERE id = ?').run(newPoints, userId);
      db.prepare('INSERT INTO redemptions (id, userId, rewardId, createdAt) VALUES (?, ?, ?, ?)').run(redemptionId, userId, rewardId, Date.now());
    });
    redeemTx();

    res.status(201).json({
      id: redemptionId,
      reward: { id: reward.id, name: reward.title },
      pointsSpent: reward.pointsCost,
      remainingPoints: newPoints,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
