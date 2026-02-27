import { Router, Request, Response } from 'express';
import { getProviders } from '../providers';
import { getDb } from '../db';

const router = Router();

router.post('/ai/classify', async (req: Request, res: Response) => {
  try {
    const { imageUrls, context } = req.body;
    const result = await getProviders().ai.classifyWasteFromImages(imageUrls || [], context);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/ai/recommend-collectors', async (req: Request, res: Response) => {
  try {
    const { caseDraft } = req.body;
    const db = getDb();
    const collectors = db.prepare('SELECT * FROM collectors').all() as any[];

    const formatted = collectors.map((c: any) => ({
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
    }));

    const result = await getProviders().ai.recommendCollectors(caseDraft || {}, formatted);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
